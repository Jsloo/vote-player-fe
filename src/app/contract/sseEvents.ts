import { z } from "zod";
import { MatchStatusSchema, type PlayerMatchResponse } from "./playerCampaignMatches";

/** SSE `SCORE` payload — backend pushes the new status + per-team scores on each goal / settle. */
export const SseScoreDataSchema = z.object({
  matchId: z.number(),
  status: MatchStatusSchema,
  /** Map of teamId (stringified) -> current score. */
  scores: z.record(z.string(), z.number()),
  sseAction: z.literal("NOTIFY_SCORE"),
});

export const SseScoreEventSchema = z.object({
  sseType: z.literal("SCORE"),
  data: SseScoreDataSchema,
});

/** Discriminated union — add more `sseType`s here as the backend grows. */
export const SseEventSchema = z.discriminatedUnion("sseType", [
  SseScoreEventSchema,
]);

export type SseScoreData = z.infer<typeof SseScoreDataSchema>;
export type SseScoreEvent = z.infer<typeof SseScoreEventSchema>;
export type SseEvent = z.infer<typeof SseEventSchema>;

export function parseSseEvent(raw: string): SseEvent | null {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return null;
  }
  const parsed = SseEventSchema.safeParse(json);
  return parsed.success ? parsed.data : null;
}

/**
 * Pure helper — returns a new match list with the SCORE update applied, or the original reference
 * when nothing matched (lets callers bail out cheaply).
 */
export function applyScoreUpdateToMatches(
  matches: PlayerMatchResponse[],
  update: SseScoreData,
): PlayerMatchResponse[] {
  let mutated = false;
  const next = matches.map((m) => {
    if (m.id !== update.matchId) return m;
    mutated = true;
    const teams = m.teams.map((t) => {
      const newScore = update.scores[String(t.team.id)];
      return newScore === undefined || newScore === t.score
        ? t
        : { ...t, score: newScore };
    });
    return { ...m, status: update.status, teams };
  });
  return mutated ? next : matches;
}
