import React from "react"
import { LanguageProvider } from "./src/i18n/LanguageContext"

export const wrapRootElement = ({ element }) => (
  <LanguageProvider>{element}</LanguageProvider>
)
