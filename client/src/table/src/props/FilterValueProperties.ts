import { ColumnFilteringProperties } from "./ColumnFilteringProperties";
import { FilterType } from "./FilterType";

export class FilterValueProperties extends ColumnFilteringProperties {
    column: string = "";
    label?: string | null = null;
}