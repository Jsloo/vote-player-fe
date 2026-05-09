// playerLeaderboard.ts
import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { publicEnvelopeSchema } from "./playerCampaignMatches";

const c = initContract();

// ── Single ranking entry ──
export const LeaderboardResponseSchema = z.object({
  playerId: z.number(),
  username: z.string(),
  totalPoints: z.coerce.number(),    // BigDecimal → number
  currentStreak: z.number(),
  rank: z.number(),
});

// ── Page response (topRankings + currentUser) ──
export const LeaderboardPageResponseSchema = z.object({
  topRankings: z.array(LeaderboardResponseSchema),
  currentUser: LeaderboardResponseSchema.nullable(),    // 可能没登录就是 null
});

// ── Envelope-wrapped ──
export const LeaderboardPageEnvelopeSchema = publicEnvelopeSchema(
  LeaderboardPageResponseSchema
);

// ── Type exports ──
export type LeaderboardResponse = z.infer<typeof LeaderboardResponseSchema>;
export type LeaderboardPageResponse = z.infer<typeof LeaderboardPageResponseSchema>;

// ── Contract ──
export const playerLeaderboardContract = c.router({
  getLeaderboard: {
    method: "GET",
    path: "/leaderboard/:campaignId",
    pathParams: z.object({
      campaignId: z.coerce.number(),
    }),
    responses: {
      200: LeaderboardPageEnvelopeSchema,
    },
    summary: "Get leaderboard for a campaign",
  },
});