import { ReactNode } from "react";
import { ColumnAlignType } from "./ColumnAlignType";

type DateColumnName = "date" | "datetime";
export type ColumnType = DateColumnName | "action" | "data" | "bool";

type CommonColumnProps = {
    label?: string;
    align?: ColumnAlignType;
    bold?: boolean; //false
    display?: boolean;// = true;
    nullValue?: string;// = "-";
    width?: number;// = null;
    tooltip?: string;
}

export type ActionColumnProps<T> = CommonColumnProps & {
    name?: string,
    component?: <K extends keyof T>(value: T[K], row: T) => ReactNode;
}

export type DataColumnProps<T> = CommonColumnProps & {
    name: string;
    disableSorting?: boolean,
    component?: <K extends keyof T>(value: T[K], row: T) => ReactNode;
}

export type DateColumnProps = CommonColumnProps & {
    name: string;
    disableSorting?: boolean;
    dateFormat?: string;
    withTime?: boolean;
}

export type BoolColumnProps = CommonColumnProps & {
    name: string;
    showText?: boolean;
}

type CommonSettings = CommonColumnProps & {
    type?: ColumnType;
    disableSorting?: boolean;
}

type DataColumnSettings<T> = DataColumnProps<T> & {
    type?: "data"
};


type ActionColumnSettings<T> = ActionColumnProps<T> & {
    type: "action",    
    disableSorting: true
};

type BoolColumnSettings = BoolColumnProps & {
    type: "bool"
};

export type DateTimeColumnSettings = DateColumnProps & {
    type: DateColumnName,
    component?: undefined
}


export type ColumnSettings<T> = CommonSettings &
(
    DataColumnSettings<T> | 
    ActionColumnSettings<T> |
    DateTimeColumnSettings | 
    BoolColumnSettings
) 