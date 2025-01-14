import { ReactNode, createContext, useCallback, useMemo, useState } from "react";
import { TableLocalizationType } from "../localization/TableLocalizationType";
import { localeRu } from "../localization/dictionaries/localeRu";
import { localeEn } from "../localization/dictionaries/localeEn";
import { TableState } from "src/props/TableState";

type TableLocaleType = "ru" | "en" | TableLocalizationType;

type ItnTableGlobalContextType = {
    locale: TableLocalizationType,
    getState?: (tableKey?: string) => TableState,
    setState?: (state: TableState, tableKey?: string) => void
}

export const ItnTableGlobalContext = createContext<ItnTableGlobalContextType>({
    locale: localeRu
});

const defaultState: TableState = {
    searching: "",
    sorting: [],
    filtering: [],
    page: 1,
    pageSize: 10,
    selectedRows: []
}

//TODO Add default state provider
const ItnTableProvider = (props: { children: ReactNode, locale?: TableLocaleType, nameResolver?: () => string }) => {
    const { 
        children, 
        locale, 
        nameResolver 
    } = props;

    const [states, setStates] = useState<{ tableKey: string, state: TableState }[]>([]);

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

    const getState = useCallback((tableKey?: string) => {
        if (!tableKey && !nameResolver) {
            throw new Error("Table key or global name resolver must be provided");
        }

        const foundTableKey = tableKey ?? nameResolver!(); 
        return states.find(state => state.tableKey === foundTableKey)?.state ?? defaultState;
    }, [states, nameResolver]);

    const setState = useCallback((state: TableState, tableKey?: string) => {
        if (!tableKey && !nameResolver) {
            throw new Error("Table key or global name resolver must be provided");
        }

        const foundTableKey = tableKey ?? nameResolver!(); 
        setStates(old => {
            if (old.find(state => state.tableKey === foundTableKey)) {
                return old.map(tableState => {
                    if (tableState.tableKey === foundTableKey) {
                        return { 
                            ...tableState, 
                            state 
                        };
                     } else { 
                        return tableState 
                     };
                });
            }

            return [...old, { tableKey: foundTableKey, state }]
        });
    }, [nameResolver]);

    const contextValue = useMemo(() => {
        return { 
            locale: localeDict, 
            getState, 
            setState 
        }
    }, [
        localeDict, 
        getState, 
        setState
    ]);

    return (
        <ItnTableGlobalContext.Provider 
            value={contextValue}
        >
            {children}
        </ItnTableGlobalContext.Provider>
    );
};

export default ItnTableProvider;