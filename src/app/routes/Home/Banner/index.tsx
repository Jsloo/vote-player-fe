import { Button } from "antd";
import { IoChevronBack } from "react-icons/io5";
import { bannerImage } from "@/assets/image";
import { exitApps } from "@/app/utils";
import "./styles.css";

export function Banner() {
  return (
    <div className="homeBanner">
      <Button
        type="text"
        shape="circle"
        className="homeBannerBackButton"
        onClick={exitApps}
        icon={<IoChevronBack aria-hidden="true" />}
        aria-label="Go back"
      />
      <img className="homeBannerImage" src={bannerImage} alt="World Cup 2026 promo" />
    </div>
  );
}
