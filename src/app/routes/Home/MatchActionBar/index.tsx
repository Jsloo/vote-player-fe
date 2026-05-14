import { Badge, Button } from "antd";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/app/components/Skeleton";
import ticketIcon from "@/assets/svg/ticket.svg";
import { translationKey } from "@/i18n/constants";
import "./styles.css";

type MatchActionBarProps = {
  totalTicketBalance: number
  isLoading?: boolean
}

export function MatchActionBar({ totalTicketBalance, isLoading }: MatchActionBarProps) {
  const { t } = useTranslation();

  return (
    <div className="matchActionBar" aria-label="Match ticket actions">
      <Button type="text" className="matchActionBarLabel">
        {t(translationKey.MATCH_ACTION_BAR_LABEL, {
          defaultValue: 'WorldCup Match',
        })}
      </Button>
      <div className="matchActionBarActions">
        <Button type="primary" className="matchActionBarTicketCountButton">
          <img className="matchActionBarTicketIconImage" src={ticketIcon} alt="" aria-hidden="true" />
          <span>
            {t(translationKey.MATCH_ACTION_BAR_TICKET, { defaultValue: 'Ticket' })}
          </span>
          {isLoading ? (
            <Skeleton
              width={28}
              height={14}
              radius={5}
              className="matchActionBarTicketBadgeSkeleton"
            />
          ) : (
            <Badge
              count={totalTicketBalance}
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
          )}
        </Button>
        <Button type="primary" className="matchActionBarGetTicketsButton">
          {t(translationKey.MATCH_ACTION_BAR_GET_TICKETS, {
            defaultValue: 'Get Tickets ?',
          })}
        </Button>
      </div>
    </div>
  );
}
