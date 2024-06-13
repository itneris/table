export type TableLocalizationType = {
    pagination: {
        pageSizeText: string;
        prevPageText: string;
        nextPageText: string;
        pageLabelText: ({ from, to, count }: { from: number, to: number, count: number }) => string;
    },
    search: {
        resetText: string;
        searchText: string;
    },
    filtering: {
        filterText: string;
        filterTooltipText: string;
        resetText: string;
        clearText: string;
        minPlaceholder: string;
        maxPlaceholder: string;
        closeText: string;
        openText: string;
        noOptionsText: string;
        allValuesText: string;
        selectValueText: string;
        greaterThanText: string;
        lessThanText: string;    
        laterThanText: string;
        earlierThanText: string;
    },
    download: {
        downloadText: string;
    },
    visibility: {
        columnsText: string;
        visibilityText: string;
    },
    table: {
        noDataText: string;
        loadingText: string;        
    },
    formatters: {
        number: (value: number) => string,
        date: (value: Date, withTime: boolean, format?: string) => string,
        bool: (value: boolean) => string
    }
}