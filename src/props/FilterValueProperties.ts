import { ColumnFilteringProperties } from "./ColumnFilteringProperties";

export class FilterValueProperties extends ColumnFilteringProperties {
    column: string = "";
    label?: string | null = null;
}