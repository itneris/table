import axios, {  AxiosResponse } from "axios";
import { TableRowsReponse } from "../base/TableRowsReponse";
import { FilterProperties } from "../props/FilterProperties";
import { TableQueryState } from "../props/TableQueryState";

export const getRows = (apiName: string, options: TableQueryState) => async (): Promise<AxiosResponse<TableRowsReponse>> => {
    return await axios.post(`/api/${apiName}/List`, options);
}

export const getFilters = (apiName: string) => async (): Promise<AxiosResponse<Array<FilterProperties>>> => {
    return await axios.get(`/api/${apiName}/Filters`);
}