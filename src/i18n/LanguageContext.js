import React, { createContext, useContext, useState, useEffect } from "react"
import translations from "./translations"

const LanguageContext = createContext()

const STORAGE_KEY = "nevtec-lang"

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("en")

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && translations[stored]) {
      setLangState(stored)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = lang
    }
  }, [lang])

  const setLang = newLang => {
    setLangState(newLang)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newLang)
    }
  }

  const t = key => translations[lang][key] || key

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return ctx
}
