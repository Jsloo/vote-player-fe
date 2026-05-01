import { Banner } from "./Banner";
import { CalendarStrip } from "./CalendarStrip";
import { MatchActionBar } from "./MatchActionBar";

export function HomePage() {
  return (
    <section aria-label="Promotional banner">
      <Banner />
      <MatchActionBar />
      <CalendarStrip />
    </section>
  );
}
