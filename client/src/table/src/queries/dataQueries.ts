import axios, {  AxiosResponse } from "axios";
import { TableRowsReponse } from "../base/TableRowsReponse";
import { DownloadFileProperties } from "../props/DownloadFileProperties";
import { FilterProperties } from "../props/FilterProperties";
import { TableQueryState } from "../props/TableQueryState";

export const getRows = (apiUrl: string, options: TableQueryState) => async (): Promise<AxiosResponse<TableRowsReponse>> => {
    return await axios.post(`${apiUrl}/List`, options);
}

export const getFilters = (apiUrl: string) => async (): Promise<AxiosResponse<Array<FilterProperties>>> => {
    return await axios.get(`${apiUrl}/Filters`);
}

export interface DownloadParams {
    url: string,
    downloadProperties: DownloadFileProperties,
    state: TableQueryState
}

export async function getFileFromServer(params: DownloadParams): Promise<File> {
    let url = params.downloadProperties.url ?? `${params.url}/Download`;

    let response: AxiosResponse;
    if (!params.downloadProperties.useState) {
        response = await axios.get(url);
    } else {
        response = await axios.post(url, params.state);
    }

    if (response.data instanceof File) {
        return response.data as File;
    }

    let base64str = response.data as string;
    // decode base64 string, remove space for IE compatibility
    var binary = window.atob(base64str.replace(/\s/g, ''));
    var len = binary.length;
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i);
    }

    const blob = new Blob([view], { type: params.downloadProperties.mimeType ?? "application/csv" });
    const file = new File([blob], params.downloadProperties.name ?? "Экспорт");
    return file;
}