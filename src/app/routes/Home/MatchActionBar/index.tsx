import { Badge, Button } from "antd";
import { useTranslation } from "react-i18next";
import ticketIcon from "@/assets/svg/ticket.svg";
import { translationKey } from "@/i18n/constants";
import "./styles.css";

export function MatchActionBar() {
  const { t } = useTranslation();

  return (
    <div className="matchActionBar" aria-label="Match ticket actions">
      <Button type="text" className="matchActionBarLabel">
        {t(translationKey.MATCH_ACTION_BAR_LABEL)}
      </Button>
      <div className="matchActionBarActions">
        <Button type="primary" className="matchActionBarTicketCountButton">
          <img className="matchActionBarTicketIconImage" src={ticketIcon} alt="" aria-hidden="true" />
          <span>{t(translationKey.MATCH_ACTION_BAR_TICKET)}</span>
          <Badge
            count={1200}
            showZero
            className="matchActionBarTicketBadge"
            styles={{
              indicator: {
                background: "#ffffff",
                color: "#0f65cf",
                boxShadow: "none",
              },
            }}
          />
        </Button>
        <Button type="primary" className="matchActionBarGetTicketsButton">
          {t(translationKey.MATCH_ACTION_BAR_GET_TICKETS)}
        </Button>
      </div>
    </div>
  );
}
