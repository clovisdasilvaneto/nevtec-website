import React, { useEffect, useRef } from "react"
import Head from "next/head"
import Link from "next/link"
import dynamic from "next/dynamic"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import LanguageSwitcher from "../src/components/LanguageSwitcher"
import { useLanguage } from "../src/i18n/LanguageContext"

const WebGLBackground = dynamic(() => import("../src/components/WebGLBackground"), { ssr: false })
const AboutVisual = dynamic(() => import("../src/components/AboutVisual"), { ssr: false })

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Home() {
  const mainRef = useRef(null)
  const { t, lang } = useLanguage()

  useEffect(() => {
    if (typeof window === "undefined") return

    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ delay: 0.3 })

      heroTl
        .to(".hero-title .line-inner", {
          y: 0, duration: 1.2, ease: "power4.out", stagger: 0.1,
        })
        .to(".hero-label", { opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.8")
        .to(".hero-description", { opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.5")
        .to(".hero-cta", { opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.4")
        .to(".hero-scroll-indicator", { opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.3")

      ScrollTrigger.create({
        start: "top -80",
        onUpdate: self => {
          const nav = document.querySelector(".nav")
          if (nav) {
            nav.classList.toggle("scrolled", self.direction === 1 && self.scroll() > 80)
          }
        },
      })

      gsap.to(".about .section-label", {
        scrollTrigger: { trigger: ".about", start: "top 75%" },
        opacity: 1, x: 0, duration: 0.8, ease: "power3.out",
      })
      gsap.to(".about-title", {
        scrollTrigger: { trigger: ".about", start: "top 70%" },
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
      })
      gsap.to(".about-text", {
        scrollTrigger: { trigger: ".about", start: "top 65%" },
        opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.15,
      })
      gsap.from(".stat-number", {
        scrollTrigger: { trigger: ".about-stats", start: "top 80%" },
        textContent: 0, duration: 2, ease: "power2.out", stagger: 0.2, snap: { textContent: 1 },
      })
      gsap.to(".stat", {
        scrollTrigger: { trigger: ".about-stats", start: "top 80%" },
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.15,
      })
      gsap.to(".services-header .section-label", {
        scrollTrigger: { trigger: ".services", start: "top 75%" },
        opacity: 1, x: 0, duration: 0.8, ease: "power3.out",
      })
      gsap.to(".services-title", {
        scrollTrigger: { trigger: ".services", start: "top 70%" },
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
      })
      gsap.to(".services-subtitle", {
        scrollTrigger: { trigger: ".services", start: "top 65%" },
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
      })
      gsap.to(".service-card", {
        scrollTrigger: { trigger: ".services-grid", start: "top 75%" },
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.12,
      })
      gsap.to(".contact-title", {
        scrollTrigger: { trigger: ".contact", start: "top 70%" },
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
      })
      gsap.to(".contact-text", {
        scrollTrigger: { trigger: ".contact", start: "top 65%" },
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
      })
      gsap.to(".contact-whatsapp", {
        scrollTrigger: { trigger: ".contact", start: "top 60%" },
        opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.5)",
      })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  const scrollTo = e => {
    e.preventDefault()
    const id = e.currentTarget.getAttribute("href").slice(1)
    const el = document.getElementById(id)
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top: offset, behavior: "smooth" })
    }
  }

  return (
    <>
      <Head>
        <title>{t("siteTitle")}</title>
        <meta name="description" content={t("siteDescription")} />
        <html lang={lang} />
      </Head>

      <WebGLBackground />

      <div ref={mainRef} className="main-content">
        <nav className="nav">
          <Link href="/" className="nav-logo">Nevtec</Link>
          <ul className="nav-links">
            <li><a href="#about" onClick={scrollTo}>{t("navAbout")}</a></li>
            <li><a href="#services" onClick={scrollTo}>{t("navServices")}</a></li>
            <li><Link href="/cases">{t("navCases")}</Link></li>
            <li><a href="#contact" onClick={scrollTo}>{t("navContact")}</a></li>
            <li><LanguageSwitcher /></li>
          </ul>
          <div className="lang-switcher-mobile"><LanguageSwitcher /></div>
        </nav>

        <section className="hero">
          <span className="hero-label">{t("heroLabel")}</span>
          <h1 className="hero-title">
            <span className="line"><span className="line-inner">{t("heroLine1")}</span></span>
            <span className="line"><span className="line-inner outline-text">{t("heroLine2")}</span></span>
            <span className="line"><span className="line-inner gradient-text">{t("heroLine3")}</span></span>
          </h1>
          <p className="hero-description">{t("heroDescription")}</p>
          <div className="hero-cta">
            <a href="https://api.whatsapp.com/send/?phone=551148635954&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="btn-primary">{t("heroCta")}</a>
            <a href="#services" onClick={scrollTo} className="btn-secondary">{t("heroCtaSecondary")}</a>
          </div>
          <div className="hero-scroll-indicator">
            <div className="scroll-line" />
            <span className="scroll-text">{t("heroScroll")}</span>
          </div>
        </section>

        <div className="section-divider" />

        <section className="about" id="about">
          <div className="about-inner">
            <div className="about-content">
              <span className="section-label reveal-left">{t("aboutLabel")}</span>
              <h2 className="about-title reveal-up">{t("aboutTitle")}</h2>
              <p className="about-text reveal-up">{t("aboutText1")}</p>
              <p className="about-text reveal-up">{t("aboutText2")}</p>
              <div className="about-stats">
                <div className="stat reveal-up"><div className="stat-number">50</div><div className="stat-label">{t("statProjects")}</div></div>
                <div className="stat reveal-up"><div className="stat-number">8</div><div className="stat-label">{t("statYears")}</div></div>
                <div className="stat reveal-up"><div className="stat-number">30</div><div className="stat-label">{t("statClients")}</div></div>
              </div>
            </div>
            <div className="about-visual"><AboutVisual /></div>
          </div>
        </section>

        <div className="section-divider" />

        <section className="services" id="services">
          <div className="services-header">
            <span className="section-label reveal-left">{t("servicesLabel")}</span>
            <h2 className="services-title reveal-up">{t("servicesTitle")}</h2>
            <p className="services-subtitle reveal-up">{t("servicesSubtitle")}</p>
          </div>
          <div className="services-grid">
            <div className="service-card reveal-up">
              <div className="service-number">01</div>
              <h3 className="service-name">{t("service1Name")}</h3>
              <p className="service-desc">{t("service1Desc")}</p>
              <div className="service-tags"><span className="service-tag">React</span><span className="service-tag">Next.js</span><span className="service-tag">Node.js</span></div>
            </div>
            <div className="service-card reveal-up">
              <div className="service-number">02</div>
              <h3 className="service-name">{t("service2Name")}</h3>
              <p className="service-desc">{t("service2Desc")}</p>
              <div className="service-tags"><span className="service-tag">Three.js</span><span className="service-tag">GSAP</span><span className="service-tag">WebGL</span></div>
            </div>
            <div className="service-card reveal-up">
              <div className="service-number">03</div>
              <h3 className="service-name">{t("service3Name")}</h3>
              <p className="service-desc">{t("service3Desc")}</p>
              <div className="service-tags"><span className="service-tag">UI/UX</span><span className="service-tag">Design Systems</span><span className="service-tag">Prototyping</span></div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        <section className="contact" id="contact">
          <div className="contact-inner">
            <h2 className="contact-title reveal-up">
              {t("contactTitle")}{" "}
              <span className="gradient-text">{t("contactTitleAccent")}</span>
            </h2>
            <p className="contact-text reveal-up">{t("contactText")}</p>
            <a href="https://api.whatsapp.com/send/?phone=551148635954&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="btn-primary contact-whatsapp reveal-scale">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {t("contactWhatsapp")}
            </a>
          </div>
        </section>

        <footer className="footer">
          <span className="footer-text">&copy; {new Date().getFullYear()} Nevtec. {t("footerRights")}</span>
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
