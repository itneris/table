import { ReactNode } from "react";
import { ColumnFilteringProperties } from "../props/ColumnFilteringProperties";
import { LooseObject } from "./LooseObject";

export class ColumnDescription implements LooseObject {
    order: number = 0;
    property: string = "";
    displayName: string = "";
    bold: boolean = false;
    dateFormat: string | null = null;
    tooltip: string | null = null;

    dateWithTime: boolean = false;

    sortOrder: number | null = null;
    sortAscending: boolean = true;
    disableSort: boolean = false;

    display: boolean = true;
    systemHide: boolean = false;

    nullValue: string | null = "-";
    width: number | null = null;

    filtering: ColumnFilteringProperties | null = null;

    bodyRenderer: ((value: any, row: LooseObject) => ReactNode) | null = null;
}
