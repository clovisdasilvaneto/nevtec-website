import React from "react"
import { useLanguage } from "../i18n/LanguageContext"

const LanguageSwitcher = () => {
  const { lang, setLang } = useLanguage()

  return (
    <div className="lang-switcher">
      <button
        className={`lang-btn ${lang === "en" ? "lang-btn--active" : ""}`}
        onClick={() => setLang("en")}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="lang-divider">/</span>
      <button
        className={`lang-btn ${lang === "pt" ? "lang-btn--active" : ""}`}
        onClick={() => setLang("pt")}
        aria-label="Mudar para Portugues"
      >
        PT
      </button>
    </div>
  )
}

export default LanguageSwitcher
