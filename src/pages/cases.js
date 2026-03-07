import React, { useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import { Link } from "gatsby"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import WebGLBackground from "../components/WebGLBackground"
import LanguageSwitcher from "../components/LanguageSwitcher"
import { useLanguage } from "../i18n/LanguageContext"
import "../styles/global.css"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const featured = [
  {
    id: "01",
    title: "Betelytics",
    categoryKey: "betelytics_category",
    descKey: "betelytics_desc",
    url: "https://www.betelytics.com/pt-BR",
    image: "/img/betelytics.webp",
    color: "#00e5ff",
  },
  {
    id: "02",
    title: "LocaFacil",
    categoryKey: "locafacil_category",
    descKey: "locafacil_desc",
    url: "https://locafacil.app/",
    image: "/img/loca-facil.png",
    color: "#7b2ff7",
  },
]

const cases = [
  {
    id: "03",
    title: "TRG Club",
    categoryKey: "trgclub_category",
    descKey: "trgclub_desc",
    url: "https://www.trgclub.com/",
    image: "/img/trg-club.svg",
    color: "#00e5ff",
  },
  {
    id: "04",
    title: "Lean Contabilidade",
    categoryKey: "lean_category",
    descKey: "lean_desc",
    url: "https://leancontabilidade.com.br/",
    image: "/img/lean.svg",
    color: "#7b2ff7",
  },
  {
    id: "05",
    title: "Datacert",
    categoryKey: "datacert_category",
    descKey: "datacert_desc",
    url: "https://datacertbr.com/",
    image: "/img/datacert.svg",
    color: "#00e5ff",
  },
  {
    id: "06",
    title: "Novocred",
    categoryKey: "novocred_category",
    descKey: "novocred_desc",
    url: "https://novocred.com.br/",
    image: "/img/novocred.svg",
    color: "#7b2ff7",
  },
  {
    id: "07",
    title: "BENBEY",
    categoryKey: "benbey_category",
    descKey: "benbey_desc",
    url: null,
    image: "/img/benbey.svg",
    color: "#00e5ff",
  },
  {
    id: "08",
    title: "ZeusPay",
    categoryKey: "zeuspay_category",
    descKey: "zeuspay_desc",
    url: null,
    image: "/img/zeus-pay.svg",
    color: "#7b2ff7",
  },
]

export default function Cases() {
  const mainRef = useRef(null)
  const { t, lang } = useLanguage()

  useEffect(() => {
    if (typeof window === "undefined") return

    const ctx = gsap.context(() => {
      const headerTl = gsap.timeline({ delay: 0.2 })

      headerTl
        .to(".cases-hero-label", { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" })
        .to(".cases-hero-title .line-inner", { y: 0, duration: 1.2, ease: "power4.out", stagger: 0.08 }, "-=0.5")
        .to(".cases-hero-subtitle", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
        .to(".cases-count", { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.4")

      gsap.utils.toArray(".featured-item").forEach((item, i) => {
        gsap.from(item, {
          scrollTrigger: { trigger: item, start: "top 90%" },
          opacity: 0, y: 80, duration: 1.2, ease: "power3.out", delay: i * 0.2,
        })
      })

      gsap.utils.toArray(".case-item").forEach((item, i) => {
        gsap.from(item, {
          scrollTrigger: { trigger: item, start: "top 90%" },
          opacity: 0, y: 60, duration: 1, ease: "power3.out",
          delay: i % 2 === 0 ? 0 : 0.15,
        })

        const glow = item.querySelector(".case-glow")
        if (glow) {
          gsap.to(glow, {
            scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 1.5 },
            y: -60, rotation: 15,
          })
        }
      })

      gsap.from(".cases-cta-title", {
        scrollTrigger: { trigger: ".cases-cta", start: "top 75%" },
        opacity: 0, y: 40, duration: 1, ease: "power3.out",
      })

      gsap.from(".cases-cta .btn-primary", {
        scrollTrigger: { trigger: ".cases-cta", start: "top 70%" },
        opacity: 0, y: 30, duration: 0.8, ease: "power3.out", delay: 0.2,
      })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <Helmet>
        <html lang={lang} />
        <title>{t("casesTitle")}</title>
        <meta name="description" content={t("casesDescription")} />
      </Helmet>

      <WebGLBackground />

      <div ref={mainRef} className="main-content">
        <nav className="nav">
          <Link to="/" className="nav-logo">Nevtec</Link>
          <ul className="nav-links">
            <li><a href="/#about">{t("navAbout")}</a></li>
            <li><a href="/#services">{t("navServices")}</a></li>
            <li><Link to="/cases" className="nav-link-active">{t("navCases")}</Link></li>
            <li><a href="/#contact">{t("navContact")}</a></li>
            <li><LanguageSwitcher /></li>
          </ul>
          <div className="lang-switcher-mobile"><LanguageSwitcher /></div>
        </nav>

        <section className="cases-hero">
          <span className="cases-hero-label section-label reveal-left">
            {t("casesHeroLabel")}
          </span>
          <h1 className="cases-hero-title">
            <span className="line">
              <span className="line-inner">{t("casesHeroLine1")}</span>
            </span>
            <span className="line">
              <span className="line-inner">
                {t("casesHeroLine2")}{" "}
                <span className="gradient-text">{t("casesHeroLine2Accent")}</span>
              </span>
            </span>
          </h1>
          <p className="cases-hero-subtitle reveal-up">{t("casesHeroSubtitle")}</p>
          <div className="cases-count">
            <span className="cases-count-number">{featured.length + cases.length}</span>
            <span className="cases-count-label">{t("casesCount")}</span>
          </div>
        </section>

        <div className="section-divider" />

        <section className="cases-section">
          <div className="cases-section-header">
            <span className="section-label">{t("casesFeaturedLabel")}</span>
          </div>

          <div className="featured-grid">
            {featured.map((c, i) => (
              <a
                key={c.id}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`featured-item featured-item--${i % 2 === 0 ? "left" : "right"}`}
              >
                <span className="featured-number">{c.id}</span>
                <div className="featured-accent-line" style={{ background: c.color }} />

                <div className="featured-visual">
                  <div
                    className="featured-glow"
                    style={{ background: `radial-gradient(ellipse at 50% 50%, ${c.color}18, transparent 65%)` }}
                  />
                  <div className="featured-grid-pattern" style={{ borderColor: `${c.color}08` }} />
                  <img src={c.image} alt={c.title} className="featured-image" />
                </div>

                <div className="featured-content">
                  <div className="featured-top-row">
                    <span className="featured-badge">{t("casesFeaturedBadge")}</span>
                    <span className="case-category">{t(c.categoryKey)}</span>
                  </div>

                  <h2 className="featured-title">{c.title}</h2>
                  <p className="featured-description">{t(c.descKey)}</p>

                  <div className="featured-bottom">
                    <span className="featured-cta">
                      {t("casesViewProject")}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M7 7h10v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7 17L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="featured-url">{c.url.replace(/https?:\/\//, '').replace(/\/$/, '')}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <div className="section-divider" />

        <section className="cases-section">
          <div className="cases-section-header">
            <span className="section-label">{t("casesAllLabel")}</span>
          </div>

          <div className="cases-grid">
            {cases.map((c, i) => (
              <article
                key={c.id}
                className={`case-item case-item--${i % 2 === 0 ? "left" : "right"}`}
              >
                <div className="case-visual">
                  <div
                    className="case-glow"
                    style={{ background: `radial-gradient(ellipse at 50% 50%, ${c.color}15, transparent 70%)` }}
                  />
                  <img src={c.image} alt={c.title} className="case-image" />
                  <span className="case-visual-id">{c.id}</span>
                </div>

                <div className="case-content">
                  <div className="case-meta">
                    <span className="case-category">{t(c.categoryKey)}</span>
                    {!c.url && (
                      <>
                        <span className="case-dot" />
                        <span className="case-status">{t("casesInDevelopment")}</span>
                      </>
                    )}
                  </div>
                  <h2 className="case-title">{c.title}</h2>
                  <p className="case-description">{t(c.descKey)}</p>
                  {c.url && (
                    <div className="case-link-row">
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="case-link">
                        {t("casesViewProject")}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M7 7h10v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M7 17L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="section-divider" />

        <section className="cases-cta">
          <h2 className="cases-cta-title">
            {t("casesCtaTitle")}
            <br />
            <span className="gradient-text">{t("casesCtaAccent")}</span>
          </h2>
          <a href="/#contact" className="btn-primary">{t("casesCtaButton")}</a>
        </section>

        <footer className="footer">
          <span className="footer-text">
            &copy; {new Date().getFullYear()} Nevtec. {t("footerRights")}
          </span>
          <div className="footer-links">
            <a href="#">GitHub</a>
            <a href="#">LinkedIn</a>
            <a href="#">Twitter</a>
          </div>
        </footer>
      </div>
    </>
  )
}
