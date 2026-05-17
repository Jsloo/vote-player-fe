import { Button } from "antd";
import { IoChevronBack } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { bannerImage } from "@/assets/image";
import { exitApps } from "@/app/utils";
import { translationKey } from "@/i18n/constants";
import "./styles.css";

export function Banner() {
  const { t } = useTranslation();

  return (
    <div className="homeBanner">
      <Button
        type="text"
        shape="circle"
        className="homeBannerBackButton"
        onClick={exitApps}
        icon={<IoChevronBack aria-hidden="true" />}
        aria-label={t(translationKey.COMMON_GO_BACK, { defaultValue: "Go back" })}
      />
      <img
        className="homeBannerImage"
        src={bannerImage}
        alt={t(translationKey.BANNER_ALT, { defaultValue: "World Cup 2026 promo" })}
      />
    </div>
  );
}
