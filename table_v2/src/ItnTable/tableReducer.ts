import { TableState } from "../props/TableState";

export const RESET_SEARCH = 'RESET_SEARCH_ACTION';
export const SEARCH = 'SEARCH_ACTION';
export const SET_SELECT = 'SET_SELECT_ACTION';
export const RESET_FILTERS = 'RESET_FILTERS_ACTION';
export const SET_FILTERS = 'SET_FILTERS_ACTION';
export const SET_SORT = 'SET_SORT_ACTION';
export const SET_SECTIONS = 'SET_SECTIONS_ACTION';
export const SET_DETAIL_ROWS = 'SET_DETAIL_ROWS_ACTION';
export const SET_SELECTED_ROWS = 'SET_SELECTED_ROWS_ACTION';
export const RESET_SELECTED_ROWS = 'RESET_SELECTED_ROWS_ACTION';
export const SET_ROWS_PER_PAGE = 'SET_ROWS_PER_PAGE_ACTION';
export const SET_PAGE = 'SET_PAGE_ACTION';

export function tableReducer(state: TableState, action: any) {
    switch (action.type) {
        case RESET_SEARCH:
            return {
                ...state,
                searching: "",
                page: 1
            } as TableState;
        case SEARCH:
            return {
                ...state,
                searching: action.searching,
                page: 1
            } as TableState;
        case SET_SELECT:
            return {
                ...state,
                selectedRows: action.selectedRows
            } as TableState;
        case SET_FILTERS:
            return {
                ...state,
                filtering: action.filtering,
                page: 1
            } as TableState;
        case RESET_FILTERS:
            return {
                ...state,
                filtering: [],
                page: 1
            } as TableState;
        case SET_SORT:
            return {
                ...state,
                sorting: action.sorting
            } as TableState;
        case SET_DETAIL_ROWS:
            return {
                ...state,
                detailRows: action.detailRows
            } as TableState;
        case SET_SELECTED_ROWS:
            return {
                ...state,
                selectedRows: action.selectedRows
            } as TableState;
        case RESET_SELECTED_ROWS:
            return {
                ...state,
                selectedRows: []
            } as TableState;
        case SET_ROWS_PER_PAGE:
            return {
                ...state,
                pageSize: action.pageSize,
                page: 1
            } as TableState;
        case SET_PAGE:
            return {
                ...state,
                page: action.page
            } as TableState;
        default:
            throw new Error();
    }
}
