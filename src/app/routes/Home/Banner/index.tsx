import { Button } from "antd";
import { IoChevronBack } from "react-icons/io5";
import { bannerImage } from "@/assets/image";
import { closeEmbeddedApp } from "@/app/utils";
import "./styles.css";

export function Banner() {
  const handleBack = () => {
    if (window.parent && window.parent !== window) {
      closeEmbeddedApp();
      return;
    }

    window.history.back();
  };

  return (
    <div className="homeBanner">
      <Button
        type="text"
        shape="circle"
        className="homeBannerBackButton"
        onClick={handleBack}
        icon={<IoChevronBack aria-hidden="true" />}
        aria-label="Go back"
      />
      <img className="homeBannerImage" src={bannerImage} alt="World Cup 2026 promo" />
    </div>
  );
}
