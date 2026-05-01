import bannerImage from './banner.png'
import './banner.css'

export function HomePage() {
  return (
    <section className="homeBanner" aria-label="Promotional banner">
      <img className="homeBanner__image" src={bannerImage} alt="World Cup 2026 promo" />
    </section>
  )
}
