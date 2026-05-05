import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { ErrorCode } from "@/app/constant/errorCode";
import { notifyAuthError } from "@/app/utils/sessionHandler";
import { clearSession } from "@/app/utils/sessionTools";

export const MatchStatusSchema = z.enum([
  "UPCOMING",
  "LIVE",
  "FINISHED",
  "SETTLED",
  "CANCELLED",
]);

export const TeamResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  logoUrl: z.string(),
  campaignId: z.number(),
});

export const MatchTeamResponseSchema = z.object({
  score: z.number(),
  team: TeamResponseSchema,
  votedCount: z.number(),
});

export const PlayerMatchResponseSchema = z.object({
  id: z.number(),
  campaignId: z.number(),
  matchName: z.string(),
  titleName: z.string(),
  matchTime: z.string(),
  basePoints: z.number(),
  status: MatchStatusSchema,
  winnerTeamId: z.number().nullable(),
  teams: z.array(MatchTeamResponseSchema),
  draw: z.boolean(),
});

export const PlayerMatchesByDateSchema = z.object({
  date: z.string(),
  matches: z.array(PlayerMatchResponseSchema),
});

export const PlayerMatchesByDateListSchema = z.array(PlayerMatchesByDateSchema);

export type MatchStatus = z.infer<typeof MatchStatusSchema>;
export type TeamResponse = z.infer<typeof TeamResponseSchema>;
export type MatchTeamResponse = z.infer<typeof MatchTeamResponseSchema>;
export type PlayerMatchResponse = z.infer<typeof PlayerMatchResponseSchema>;
export type PlayerMatchesByDate = z.infer<typeof PlayerMatchesByDateSchema>;

/** Shared public API envelope: session invalid + success flag, then unwrap `data`. */
export function publicEnvelopeSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z
    .object({
      success: z.boolean().optional(),
      status: z.boolean().optional(),
      code: z.string(),
      message: z.string(),
      data: dataSchema,
    })
    .transform((env) => {
      if (env.code === ErrorCode.SESSION_INVALID) {
        notifyAuthError(ErrorCode.SESSION_INVALID);
        clearSession();
        throw new Error(env.message || "Session invalid");
      }
      if (!(env.success ?? env.status)) {
        throw new Error(env.message || "Request failed");
      }
      return env.data;
    });
}

export const PlayerCampaignMatchesEnvelopeSchema = publicEnvelopeSchema(
  PlayerMatchesByDateListSchema,
);

export function parseCampaignIdFromEnv(): number | null {
  const raw = import.meta.env.VITE_CAMPAIGN_ID as string | undefined;
  if (raw === undefined || String(raw).trim() === "") {
    return null;
  }
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function selectLiveMatchesWithTwoTeams(
  buckets: PlayerMatchesByDate[],
): PlayerMatchResponse[] {
  const out: PlayerMatchResponse[] = [];
  for (const day of buckets) {
    for (const m of day.matches) {
      if (m.status === "LIVE" && m.teams?.length >= 2) {
        out.push(m);
      }
    }
  }
  return out;
}

const c = initContract();

export const playerCampaignMatchesContract = c.router({
  getMatch: {
    method: "GET",
    path: "/player/campaigns/:campaignId/matches",
    pathParams: z.object({
      campaignId: z.coerce.number(),
    }),
    responses: {
      200: PlayerCampaignMatchesEnvelopeSchema,
    },
    summary: "List campaign matches grouped by date",
  },
});
