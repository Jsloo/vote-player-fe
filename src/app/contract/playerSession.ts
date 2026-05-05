import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { publicEnvelopeSchema } from "./playerCampaignMatches";

const PlayerSessionEnvelopeSchema = publicEnvelopeSchema(z.unknown());

const c = initContract();

export const playerSessionContract = c.router({
  getPlayer: {
    method: "GET",
    path: "/player/sessions/player",
    query: z.object({
      sessionToken: z.string(),
    }),
    responses: {
      200: PlayerSessionEnvelopeSchema,
    },
    summary: "Current player for session",
  },
});
