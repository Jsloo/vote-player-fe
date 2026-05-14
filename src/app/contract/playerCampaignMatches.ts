import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { ErrorCodes } from "@/app/constant/errorCode";
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
  /** `true` when the current player has voted for this team in the match. */
  voted: z.boolean().optional().default(false),
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

export const PlayerVoteRequestSchema = z.object({
  teamId: z.number(),
})

export const PlayerMatchesByDateSchema = z.object({
  date: z.string(),
  matches: z.array(PlayerMatchResponseSchema),
});

export const PlayerMatchesByDateListSchema = z.array(PlayerMatchesByDateSchema);

export const MatchCountByDateSchema = z.object({
  date: z.string(),
  totalMatches: z.number(),
});

export const MatchCountByDateListSchema = z.array(MatchCountByDateSchema);

export const TicketBalanceSchema = z.object({
  ticketBalance: z.number(),
  promoTicketBalance: z.number(),
  totalTicketBalance: z.number(),
});

export type MatchStatus = z.infer<typeof MatchStatusSchema>;
export type TeamResponse = z.infer<typeof TeamResponseSchema>;
export type MatchTeamResponse = z.infer<typeof MatchTeamResponseSchema>;
export type PlayerMatchResponse = z.infer<typeof PlayerMatchResponseSchema>;
export type PlayerMatchesByDate = z.infer<typeof PlayerMatchesByDateSchema>;
export type MatchCountByDate = z.infer<typeof MatchCountByDateSchema>;
export type TicketBalance = z.infer<typeof TicketBalanceSchema>;

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
      if (env.code === ErrorCodes.SESSION_INVALID) {
        notifyAuthError(ErrorCodes.SESSION_INVALID);
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

/** Flat list envelope for GET …/matches?date=… which returns PlayerMatchResponse[] directly. */
export const PlayerMatchListEnvelopeSchema = publicEnvelopeSchema(
  z.array(PlayerMatchResponseSchema),
);

/** GET …/matches/count-by-date — same `{ success, code, message, data }` envelope as other public APIs. */
export const MatchCountByDateEnvelopeSchema = publicEnvelopeSchema(
  MatchCountByDateListSchema,
);

/** GET …/ticket — same `{ success, code, message, data }` envelope as other public APIs. */
export const TicketBalanceEnvelopeSchema = publicEnvelopeSchema(
  TicketBalanceSchema,
);

export function parseCampaignIdFromEnv(): number | null {
  const raw = import.meta.env.VITE_CAMPAIGN_ID as string | undefined;
  if (raw === undefined || String(raw).trim() === "") {
    return null;
  }
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function selectDateMatchesWithTwoTeams(
  matches: PlayerMatchResponse[],
): PlayerMatchResponse[] {
  return matches.filter(
    (m) =>
      (m.status === 'UPCOMING' || m.status === 'LIVE') &&
      m.teams?.length >= 2,
  )
}

export function selectLiveMatchesWithTwoTeams(
  matches: PlayerMatchResponse[],
): PlayerMatchResponse[] {
  return matches.filter(
    (m) => m.status === 'LIVE' && m.teams?.length >= 2,
  )
}

const c = initContract();

export const playerCampaignMatchesContract = c.router({
  getMatch: {
    method: "GET",
    path: "/player/campaigns/:campaignId/matches",
    pathParams: z.object({
      campaignId: z.coerce.number(),
    }),
    query: z.object({
      /** ISO date `YYYY-MM-DD` */
      date: z.string(),
    }),
    responses: {
      200: PlayerMatchListEnvelopeSchema,
    },
    summary: "List campaign matches for a given date",
  },
  getMatchesCountByDate: {
    method: "GET",
    path: "/player/campaigns/:campaignId/matches/count-by-date",
    pathParams: z.object({
      campaignId: z.coerce.number(),
    }),
    responses: {
      200: MatchCountByDateEnvelopeSchema,
    },
    summary: "Match counts per date for campaign calendar",
  },
  getTicket: {
    method: "GET",
    path: "/player/campaigns/:campaignId/ticket",
    pathParams: z.object({
      campaignId: z.coerce.number(),
    }),
    responses: {
      200: TicketBalanceEnvelopeSchema,
    },
    summary: "Ticket balances for campaign",
  },
  voteTeam: {
    method: "POST",
    path: "/player/campaigns/:campaignId/matches/:matchId/vote",
    pathParams: z.object({
      campaignId: z.coerce.number(),
      matchId: z.coerce.number(),
    }),
    body: PlayerVoteRequestSchema,
    responses: {
      200: z.unknown(),
    },
    summary: "Vote for a team in match",
  },
});
