import React from "react"
import { LanguageProvider } from "../src/i18n/LanguageContext"
import "../src/styles/global.css"

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  )
}
