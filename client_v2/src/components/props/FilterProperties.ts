import { FilterType } from "./FilterType";

export class FilterProperties {
    column: string = "";
    label: string = "";
    values: Array<string> = [];
    multiple: boolean = false;
    inToolbar: boolean = false;
    type: FilterType = FilterType.Select;
}