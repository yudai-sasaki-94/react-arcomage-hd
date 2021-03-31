import React, { createContext, useEffect, useState } from 'react'
import { i18n as defaultTrans } from './en'
import { cardsI18n } from '../../src/i18n/cards.en'
import { defaultLang } from './langs'
import {
  AvailableLangType,
  I18nContextType,
  TranslationFullType,
} from './types'
import { useAppSelector } from '../utils/useAppDispatch'

const allDefault = { i18n: defaultTrans, cards: cardsI18n }

const transObjDefault = { i18n: () => '', cards: () => '' }

export const I18nContext = createContext<I18nContextType>(transObjDefault)

const translationDefault: TranslationFullType = {
  [defaultLang]: allDefault,
}

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [translation, setTranslation] = useState<TranslationFullType>(
    translationDefault,
  )
  const lang = useAppSelector((state): AvailableLangType => state.lang.code)
  useEffect(() => {
    if (!translation[lang]) {
      setTranslation({ ...translation, [lang]: null })
      ;(async () => {
        const [{ i18n }, { cardsI18n }] = await Promise.all([
          import(
            /* webpackChunkName: "i18n" */
            /* webpackMode: "lazy" */
            /* webpackPrefetch: true */
            /* webpackPreload: false */
            `./${lang}`
          ),
          import(
            /* webpackChunkName: "cardi18n" */
            /* webpackMode: "lazy" */
            /* webpackPrefetch: true */
            /* webpackPreload: false */
            `./cards.${lang}`
          ),
        ])
        setTranslation({ ...translation, [lang]: { i18n, cards: cardsI18n } })
      })()
    }
  }, [lang])

  return (
    <I18nContext.Provider
      value={{
        i18n: (str: string): string => {
          const t = translation[lang] ?? translation[defaultLang]
          return t.i18n?.[str] ?? ''
        },
        cards: (n: number, cardI18nProp: 'name' | 'desc'): string => {
          const t = translation[lang] ?? translation[defaultLang]
          const cont = t.cards
          const card = cont?.[n]
          return card?.[cardI18nProp] ?? ''
        },
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export const upper1st = (s: string | undefined): string | undefined =>
  s && s.charAt(0).toUpperCase() + s.slice(1)
