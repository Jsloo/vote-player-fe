import { initContract, tsRestFetchApi, type ApiFetcher } from "@ts-rest/core";
import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import { API_PUBLIC_BASE } from "@/app/constant/url";
import {
  REFERAL_CODE_KEY,
  REFERAL_SHARE_KEY,
  SESSION_ID_KEY,
} from "@/app/constant/storageKeys";
import { genFingerprint } from "@/app/utils/genFingerprint";
import { safeParseStorage } from "@/app/utils/sessionTools";
import i18n from "@/i18n";
import {
  MatchCountByDateEnvelopeSchema,
  MatchCountByDateListSchema,
  MatchCountByDateSchema,
  MatchStatusSchema,
  MatchTeamResponseSchema,
  PlayerCampaignMatchesEnvelopeSchema,
  PlayerMatchListEnvelopeSchema,
  PlayerMatchResponseSchema,
  PlayerMatchesByDateListSchema,
  PlayerMatchesByDateSchema,
  TicketBalanceEnvelopeSchema,
  TicketBalanceSchema,
  TeamResponseSchema,
  parseCampaignIdFromEnv,
  playerCampaignMatchesContract,
  selectDateMatchesWithTwoTeams,
  selectLiveMatchesWithTwoTeams,
} from "./playerCampaignMatches";
import { playerSessionContract } from "./playerSession";

export type {
  MatchCountByDate,
  MatchStatus,
  MatchTeamResponse,
  PlayerMatchResponse,
  PlayerMatchesByDate,
  TicketBalance,
  TeamResponse,
} from "./playerCampaignMatches";

export {
  MatchCountByDateEnvelopeSchema,
  MatchCountByDateListSchema,
  MatchCountByDateSchema,
  MatchStatusSchema,
  MatchTeamResponseSchema,
  PlayerCampaignMatchesEnvelopeSchema,
  PlayerMatchResponseSchema,
  PlayerMatchesByDateListSchema,
  PlayerMatchesByDateSchema,
  TicketBalanceEnvelopeSchema,
  TicketBalanceSchema,
  TeamResponseSchema,
  parseCampaignIdFromEnv,
  playerCampaignMatchesContract,
  playerSessionContract,
  selectDateMatchesWithTwoTeams,
  selectLiveMatchesWithTwoTeams,
  PlayerMatchListEnvelopeSchema,
};

async function appendPlayerPublicQuery(path: string) {
  let qs = "";

  const referralCode = safeParseStorage(
    sessionStorage.getItem(REFERAL_CODE_KEY) || "",
  );
  if (referralCode.length > 0) {
    qs += qs.length
      ? `&code=${encodeURIComponent(referralCode)}`
      : `?code=${encodeURIComponent(referralCode)}`;
  }

  const referralShareCode = safeParseStorage(
    sessionStorage.getItem(REFERAL_SHARE_KEY) || "",
  );
  if (referralShareCode.length > 0) {
    qs += qs.length
      ? `&referral=${encodeURIComponent(referralShareCode)}`
      : `?referral=${encodeURIComponent(referralShareCode)}`;
    const fingerprint = await genFingerprint();
    qs += `&fingerprint=${encodeURIComponent(fingerprint)}`;
  }

  return path + qs;
}

const publicPlayerApi: ApiFetcher = async (args) => {
  const path = await appendPlayerPublicQuery(args.path);
  return tsRestFetchApi({ ...args, path });
};

const contractRoot = initContract();

export const publicContract = contractRoot.router({
  ...playerCampaignMatchesContract,
  ...playerSessionContract,
});

export const tsr = initTsrReactQuery(publicContract, {
  baseUrl: API_PUBLIC_BASE,
  baseHeaders: {
    "Content-Type": "application/json",
    "Accept-Language": () => i18n.language || "en",
    "X-Session-Id": () =>
      safeParseStorage(sessionStorage.getItem(SESSION_ID_KEY) || ""),
  },
  api: publicPlayerApi,
  validateResponse: true,
});
