import { FilterType } from "./FilterType";

export class FilterValueProperties {
    column: string = "";
    label?: string | null = null;
    values?: Array<string> | null = null;
    type: FilterType = FilterType.Select;

    checked?: boolean | null = null;

    startDate?: Date | null = null;
    endDate?: Date | null = null;

    min?: number | null = null;
    max?: number | null = null;
}