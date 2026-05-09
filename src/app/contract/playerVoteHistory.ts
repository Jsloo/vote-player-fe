import { initContract } from "@ts-rest/core";
import { z } from "zod"
import {publicEnvelopeSchema} from "@/app/contract/playerCampaignMatches.ts";

const c = initContract();

export const TeamInfoSchema = z.object({
  teamId: z.number(),
  teamName: z.string(),
  teamLogo: z.string(),
  score: z.number().nullable(),
})

export const VoteStatusSchema = z.enum(["PENDING", "WIN", "LOSS", "DRAW"]);

export const PlayerVoteHistoryResponseSchema = z.object({
  voteId: z.number(),
  matchId: z.number(),
  matchName: z.string(),
  matchTitle: z.string(),
  matchTime: z.string(),
  votedTeamId: z.number(),
  votedTeamName: z.string(),
  votedTeamLogo: z.string(),
  pointsEarned: z.coerce.number().nullable(),       // ← 加 .nullable()
  multiplier: z.coerce.number().nullable(),
  status: VoteStatusSchema.nullable(),
  teams: z.array(TeamInfoSchema),
  winnerTeamId: z.number().nullable(),
})

export const PlayerVoteHistoryListEnvelopeSchema = publicEnvelopeSchema(
  z.array(PlayerVoteHistoryResponseSchema)
);

export type PlayerVoteHistoryResponse = z.infer<typeof PlayerVoteHistoryResponseSchema>

export const playerVoteHistoryContract = c.router({
  getVoteHistory: {
    method: "GET",
    path: "/vote-history/:campaignId",
    pathParams: z.object({
      campaignId: z.coerce.number(),
    }),
    responses: {
      200: PlayerVoteHistoryListEnvelopeSchema,
    },
    summary: "Get player's vote history for a campaign",
  },
})