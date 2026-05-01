import bannerImage from './banner.png'
import { IoChevronBack } from 'react-icons/io5'
import { closeEmbeddedApp } from '../../utils'
import './banner.css'

export function HomePage() {
  const handleBack = () => {
    if (window.parent && window.parent !== window) {
      closeEmbeddedApp()
      return
    }

    window.history.back()
  }

  return (
    <section className="homeBanner" aria-label="Promotional banner">
      <button type="button" className="homeBanner__backButton" onClick={handleBack} aria-label="Go back">
        <IoChevronBack aria-hidden="true" />
      </button>
      <img className="homeBanner__image" src={bannerImage} alt="World Cup 2026 promo" />
    </section>
  )
}
