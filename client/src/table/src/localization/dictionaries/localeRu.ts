import { format } from "date-fns";
import { TableLocalizationType } from "../TableLocalizationType";
import { ru } from "date-fns/locale";

export const localeRu = {
    pagination: {
        pageSizeText: "Строк на странице",
        prevPageText:"Пред. страница",
        nextPageText: "След. страница",
        pageLabelText: ({ from, to, count }: 
            { from: number, to: number, count: number }) => 
                `${from}-${to} из ${count}`,
    },
    search: {
        resetText: "Сбросить поиск",
        searchText: "Поиск"
    },
    filtering: {
        filterText: "Фильтры",
        filterTooltipText: "Фильтры",
        resetText: "Сбросить",
        clearText: "Очистить фильтры",
        minPlaceholder: "минимум",
        maxPlaceholder: "максимум",
        closeText: "Свернуть",
        openText: "Развернуть",
        allValuesText: "Все",
        noOptionsText: "Нет вариантов для выбора",
        selectValueText: "Выбрано значений",
        greaterThanText: "Больше",
        lessThanText: "Меньше",
        laterThanText: "Позже",
        earlierThanText: "Раньше"
    },
    download: {
        downloadText: "Скачать"
    },
    visibility: {
        columnsText: "Колонки",
        visibilityText: "Отображение колонок"
    },
    table: {
        noDataText: "Нет данных для отображения",
        loadingText: "Загрузка..."        
    },
    formatters: {
        number: (value: number) => value.toLocaleString("ru-RU"),
        date: (value: Date, withTime: boolean, dateFormat?: string) => {
            return format(value, dateFormat ?? (withTime ? "dd.MM.yyyy HH:mm:ss" : "dd.MM.yyyy"), { locale: ru });
        },
        bool: (value: boolean) => (value ? "Да" : "Нет") as string
    }
} satisfies TableLocalizationType;