import { format } from "date-fns";
import { TableLocalizationType } from "../TableLocalizationType";

export const localeEn = {
    pagination: {
        pageSizeText: "Rows per page",
        prevPageText:"Prev. page",
        nextPageText: "Next page",
        pageLabelText: ({ from, to, count }: 
            { from: number, to: number, count: number }) => 
                `${from}-${to} from ${count}`,
    },
    search: {
        resetText: "Reset search",
        searchText: "Search"
    },
    filtering: {
        filterText: "Filters",
        filterTooltipText: "Filters",
        resetText: "Reset",
        clearText: "Clear filters",
        minPlaceholder: "min",
        maxPlaceholder: "max",
        closeText: "Close",
        openText: "Open",
        allValuesText: "All",
        noOptionsText: "No options to select",
        selectValueText: "Values selected",
        greaterThanText: "Greater",
        lessThanText: "Less",
        laterThanText: "Later",
        earlierThanText: "Earlier"
    },
    download: {
        downloadText: "Download"
    },
    visibility: {
        columnsText: "Columns",
        visibilityText: "Columns visibility"
    },
    table: {
        noDataText: "No data to display",
        loadingText: "Loading..."        
    },
    formatters: {
        number: (value: number) => value.toLocaleString("ru-RU"),
        date: (value: Date, withTime: boolean, dateFormat?: string) => {
            return dateFormat ? format(value, dateFormat) : 
                withTime ? value.toLocaleString("en-US") : 
                    value.toLocaleDateString("en-US");
        },
        bool: (value: boolean) => (value ? "Yes" : "No") as string
    }
} satisfies TableLocalizationType;