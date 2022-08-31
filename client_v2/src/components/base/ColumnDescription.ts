import { ReactNode } from "react";
import { LooseObject } from "./LooseObject";

export class ColumnDescriptionBase implements LooseObject {
    order: number = 0;
    property: string = "";
    displayName: string = "";
    bold: boolean = false;
    dateFormat: string | null = null;
    tooltip: string | null = null;

    dateWithTime: boolean = false;

    sortOrder: number | null = null;
    sortAscending: boolean = true;
    disableSort: boolean = true;

    display: boolean = true;
    systemHide: boolean = false;

    nullValue: string | null = null;
    width: number | null = null;

    filters: Array<string | null> = [];
}

export class ColumnDescription<T> extends ColumnDescriptionBase {

    bodyRenderer: ((value: any, row: T) => ReactNode) | null = null;
}
