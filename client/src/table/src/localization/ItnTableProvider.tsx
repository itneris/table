import React, { ReactNode, createContext, useMemo } from "react";
import { TableLocalizationType } from "./TableLocalizationType";
import { localeRu } from "./dictionaries/localeRu";
import { localeEn } from "./dictionaries/localeEn";

type TableLocaleType = "ru" | "en" | TableLocalizationType;

export const ItnTableGlobalContext = createContext({
    locale: localeRu
});

const ItnTableProvider = (props: { children: ReactNode, locale?: TableLocaleType }) => {
    const { children, locale } = props;

    const localeDict = useMemo(() => {
        if (locale === undefined) {
            return localeRu;
        }

        if (typeof locale === "object") {
            return locale;
        }

        switch (locale) {
            case "en":
                return localeEn;
            default:
                return localeRu;
        }
    }, [locale]);

    return (
        <ItnTableGlobalContext.Provider value={{ locale: localeDict }}>
            {children}
        </ItnTableGlobalContext.Provider>
    );
};

export default ItnTableProvider;