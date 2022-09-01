import axios from "axios";
import { TableRowsReponse } from "../base/TableRowsReponse";
import { FilterProperties } from "../props/FilterProperties";
import { TableQueryState } from "../props/TableQueryState";

export const getRows = <T>(apiName: string, options: TableQueryState) => (): Promise<TableRowsReponse> => {
    return axios({
        method: "POST",
        url: `/api/${apiName}/List`,
        data: options
    }).then(response => response.data);
}

export const getFilters = (apiName: string) => (): Promise<Array<FilterProperties>> => {
    return axios({
        method: "GET",
        url: `/api/${apiName}/Filters`
    }).then(response => response.data);;
}