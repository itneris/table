import { Box, LinearProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import React, { useReducer, useState, useMemo, useEffect, useCallback, useImperativeHandle, forwardRef, useRef } from 'react';
import { ColumnDescription } from '../base/ColumnDescription';
import { ITableRef } from '../base/ITableRef';
import { LooseObject } from '../base/LooseObject';
import { TableRowsReponse } from '../base/TableRowsReponse';
import { FilterProperties } from '../props/FilterProperties';
import { FilterValueProperties } from '../props/FilterValueProperties';
import { ITableContext } from '../props/ITableContext';
import { ITableProperties } from '../props/ITableProperties';
import { SortProperties } from '../props/SortProperties';
import { TableQueryState } from '../props/TableQueryState';
import { TableState } from '../props/TableState';
import { getFilters, getRows } from '../queries/dataQueries';
import ItnTableHeader from './ItnTableHeader';
import ItnTablePagination from './ItnTablePagination';
import ItnTableRow from './ItnTableRow';
import TableFilter from './TableFilter';
import TablePanelFilterValue from './TablePanelFilterValue';
import { RESET_SELECTED_ROWS, SET_FILTERS, SET_SELECTED_ROWS, SET_SORT, SET_STATE, tableReducer } from './tableReducer';
import TableToolbar from './TableToolbar';

/*const usePrevious = (value, initialValue) => {
    const ref = useRef(initialValue);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

const useEffectDebugger = (effectHook, dependencies, dependencyNames = []) => {
    const previousDeps = usePrevious(dependencies, []);

    const changedDeps = dependencies.reduce((accum, dependency, index) => {
        if (dependency !== previousDeps[index]) {
            const keyName = dependencyNames[index] || index;
            return {
                ...accum,
                [keyName]: {
                    before: previousDeps[index],
                    after: dependency
                }
            };
        }

        return accum;
    }, {});

    if (Object.keys(changedDeps).length) {
        console.log('[use-effect-debugger] ', changedDeps);
    }

    useEffect(effectHook, dependencies);
};*/


export const TableContext = React.createContext<ITableContext | null>(null);

/*const ItnTable = forwardRef(<T,>(props: TableProperties<T>, ref: React.ForwardedRef<any>) => {
    useImperativeHandle(ref, () => ({
        fetch() {
            queryRows.refetch();
        },
        getData() {
            return rows;
        },
        getState(): TableState {
            return table;
        }
    }));*/

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        }
    }
});

const ItnTableWrapper = forwardRef<ITableRef, ITableProperties>((props, ref) => {
    const tableRef = useRef<ITableRef | null>(null);
    useImperativeHandle(ref, () => ({
        fetch() {
            tableRef.current!.fetch();
        },
        getData() {
            return tableRef.current!.getData();
        },
        getState(): TableState {
            return tableRef.current!.getState();
        },
        setState(state: TableState) {
            return tableRef.current!.setState(state);
        },
        getSelectedRows() {
            return tableRef.current!.getSelectedRows();
        },
        resetSelection() {
            tableRef.current!.resetSelection();
        },
        setSelectedRows(ids: string[]) {
            tableRef.current!.setSelectedRows(ids);
        }
    }));

    return <QueryClientProvider client={props.queryClient ?? queryClient} contextSharing>
        <ItnTable {...props} ref={tableRef}/>
    </QueryClientProvider>;
});

const getTableInitState = (props: ITableProperties) => {
    let propsState = {
        filtering: props.filtering,
        searching: props.searching,
        sorting: props.sorting,
        pageSize: props.pageSize,
        page: props.page,
        selectedRows: props.selectedRows
    } as TableState;

    if (!props.saveState) {
        return propsState;
    } else {
        let tableState: any;
        if (props.saveState.type === "storage" && localStorage.getItem(props.saveState.name)) {
            tableState = JSON.parse(localStorage.getItem(props.saveState.name)!);
        } else if (props.saveState.type === "session" && sessionStorage.getItem(props.saveState.name)) {
            tableState = JSON.parse(sessionStorage.getItem(props.saveState.name)!);
        }

        if (tableState) {
            return {
                filtering: tableState.filtering ?? props.filtering,
                searching: tableState.searching ?? props.searching,
                sorting: tableState.sorting ?? props.sorting,
                pageSize: tableState.pageSize ?? props.pageSize,
                page: tableState.page ?? props.page,
                selectedRows: props.selectedRows
            } as TableState;
        } else {
            return propsState;
        }
    }
}

export const saveState = (saveState: { type: "storage" | "session", name: string } | null, propChangeCallback: ((storageState: any) => any)) => {
    if (!saveState) {
        return;
    }

    let tableStateJson = localStorage.getItem(saveState.name) ??
        sessionStorage.getItem(saveState.name);

    let tableState = tableStateJson ? JSON.parse(tableStateJson) : {};
    tableState = propChangeCallback(tableState);

    if (saveState.type === "storage") {
        localStorage.setItem(saveState.name, JSON.stringify(tableState));
    } else {
        sessionStorage.setItem(saveState.name, JSON.stringify(tableState));
    }
};

const ItnTable = forwardRef<ITableRef, ITableProperties>((props, ref) => {
    const [table, dispatch] = useReducer(tableReducer, getTableInitState(props));

    useImperativeHandle(ref, () => ({
        fetch() {
            queryRows.refetch();
        },
        getData() {
            return rows;
        },
        getState(): TableState {
            return table;
        },
        setState(state: TableState) {
            dispatch({ type: SET_STATE, state });
        },
        getSelectedRows() {
            return table.selectedRows;
        },
        resetSelection() {
            dispatch({ type: RESET_SELECTED_ROWS });
        },
        setSelectedRows(ids: string[]) {
            dispatch({ type: SET_SELECTED_ROWS, selectedRows: ids });
        }
    }))

    const [ctrlIsClicked, setCtrlIsClicked] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorLoading, setErrorLoading] = useState<string | null>(null); 
    const [rows, setRows] = useState<Array<LooseObject>>([]);
    const [filters, setFilters] = useState<Array<FilterProperties>>([]);
    const [total, setTotal] = useState<number>(0);
    const [columns, setColumns] = useState<Array<ColumnDescription>>([]);

    const changeColumns = useCallback((newColumns: Array<ColumnDescription>) => setColumns(newColumns), []);

    //INITIAL LOAD
    useEffect(() => {
        function EventCtlrClicked(e: KeyboardEvent) { e.code === "ControlLeft" && setCtrlIsClicked(true) };
        function EventCtlrUnclicked(e: KeyboardEvent) { e.code === "ControlLeft" && setCtrlIsClicked(false) };

        window.addEventListener("keydown", EventCtlrClicked);
        window.addEventListener("keyup", EventCtlrUnclicked);

        setIsLoading(props.apiUrl !== null);

        return () => {
            window.removeEventListener("keydown", EventCtlrClicked);
            window.removeEventListener("keyup", EventCtlrUnclicked);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const newColumns = props.columnsBuilder.Build();
        const initTableState = getTableInitState(props);

        setColumns(newColumns);
        const defaultSorting = newColumns
            .filter(col => col.sortOrder !== null)
            .map(col => ({ column: col.property, ascending: col.sortAscending } as SortProperties));

        dispatch({ type: SET_SORT, sorting: initTableState.sorting || defaultSorting });

        const defaultFiltering = newColumns
            .filter(col => col.filtering !== null)
            .map(col => ({
                column: col.property,
                label: col.displayName,
                ...col.filtering
            } as FilterValueProperties));

        dispatch({ type: SET_FILTERS, filtering: [...(initTableState.filtering ?? []), ...defaultFiltering], isInit: true });
    }, [props.columnsBuilder, setColumns]); // eslint-disable-line react-hooks/exhaustive-deps

    const displayColumns = useMemo(() => columns.filter(c => c.display && !c.systemHide), [columns]);

    const queryOptions = useMemo(() => {
        return {
            pageSize: table.pageSize,
            page: table.page,
            searching: table.searching,
            sorting: table.sorting,
            filtering: table.filtering
        } as TableQueryState
    }, [table]);


    const queryRows = useQuery<AxiosResponse<TableRowsReponse>, AxiosError>(
        [props.apiUrl, 'list', queryOptions],
        getRows(props.apiUrl ?? "", queryOptions),
        {
            enabled: props.apiUrl !== null && columns.length > 0,
            onError: (err) => {
                setErrorLoading(`Ошибка загрузки данных: ${err.message}`);
            },
            onSuccess: (response) => {
                setErrorLoading(null);
                setRows(response.data.rows);
                setTotal(response.data.total);
            },
            onSettled: () => {
                setIsLoading(false);
            }
        }
    );

    useEffect(() => {
        setIsLoading(queryRows.isFetching);
    }, [queryRows.isFetching]);

    useEffect(() => {
        if (props.filters) {
            setFilters(props.filters);
        }
    }, [props.filters]);

    useEffect(() => {
        if (props.selectedRows) {
            dispatch({ type: SET_SELECTED_ROWS, selectedRows: props.selectedRows });
        }
    }, [props.selectedRows]);

    useQuery<AxiosResponse<FilterProperties[]>, AxiosError>(
        [props.apiUrl, 'filters'],
        getFilters(props.apiUrl ?? ""),
        {
            enabled: props.apiUrl != null && props.filters == null && !props.disableQueryFilters,
            onSuccess: (response) => {
                setFilters(response.data);
            }
        }
    );

    //useEffectDebugger(() => {
    useEffect(() => {
        if (props.apiUrl && columns.length > 0) {
            queryRows.refetch();
            return;
        }
    }, [ // eslint-disable-line react-hooks/exhaustive-deps
        columns,
        props.apiUrl,
        props.disablePaging,
        //table.filtering,
        //table.pageSize,
        //table.searching,
        //table.sorting,
        //table.page,
    ]);

    /*useEffect(() => {
        dispatch({ type: SET_SORT, sorting: props.sorting });
    }, [props.sorting]);

    useEffect(() => {
        dispatch({ type: SET_FILTERS, filtering: props.filtering ?? [] });
    }, [props.filtering]);*/

    /*useEffect(() => {
        dispatch({
            type: SET_SELECT,
            selectedRows: props.selectedRows!.map(row => {
                if (typeof (row) === "string") {
                    return row;
                } else {
                    return row[props.idField!];
                }
            })
        });
    }, [props.selectedRows, props.idField]);*/

    const hasToolbar = props.title || !props.disableSearch || props.onDownload !== null || filters.filter(f => f.inToolbar).length > 0;

    const contextValue: ITableContext = {
        searching: table.searching,
        dispatch: dispatch,
        disableSearch: props.disableSearch!,
        title: props.title!,
        onSearchingChange: props.onSearchingChange!,
        resetSearchTooltipText: props.resetSearchTooltipText!,
        filters: filters,
        filtering: table.filtering,
        onFilteringChange: props.onFilteringChange!,
        columns: columns,
        toolbarAdornment: props.toolbarAdornment,
        searchTooltipText: props.searchTooltipText!,
        enableHideColumns: props.enableHideColumns!,
        hideColumnToolipText: props.hideColumnToolipText!,
        columnsText: props.columnsText!,
        changeColumns: changeColumns,
        filterTooltipText: props.filterTooltipText!,
        filtersResetText: props.filtersResetText!,
        filtersMinPlaceHolder: props.filtersMinPlaceHolder!,
        filtersMaxPlaceHolder: props.filtersMaxPlaceHolder!,
        filterClearText: props.filterClearText!,
        filterCloseText: props.filterCloseText!,
        filterOpenText: props.filterOpenText!,
        filterNoOptionsText: props.filterNoOptionsText!,
        filterAllText: props.filterAllText!,
        filterSelectValuesText: props.filterSelectValuesText!,
        sorting: table.sorting,
        ctrlIsClicked: ctrlIsClicked,
        onSortingChange: props.onSortingChange!,
        onRowClick: props.onRowClick!,
        idField: props.idField!,
        pageSize: table.pageSize!,
        page: table.page,
        total: total,
        dateParseRE: props.dateParseRE!,
        pageSizeOptions: props.pageSizeOptions!,
        pageSizeOptionsText: props.pageSizeOptionsText!,
        nextPageText: props.nextPageText!,
        pageLabelText: props.pageLabelText!,
        prevPageText: props.prevPageText!,
        enableRowsSelection: props.enableRowsSelection,
        onRowSelect: props.onRowSelect,
        selectedRows: table.selectedRows!,
        rows: rows,
        saveState: props.saveState ?? null
    };

    return (
        <Paper>
            <TableContext.Provider value={contextValue}>
                {
                    hasToolbar &&
                    <TableToolbar />
                }
                {
                    filters.filter(f => f.inToolbar === true).length > 0 &&
                    <Box display="flex" flexWrap="wrap">
                        {
                            filters
                                .filter(f => f.inToolbar)
                                .map((filter, i) =>
                                    <TableFilter
                                        key={"tab-filt-" + i}
                                        filter={filter}
                                    />
                                )
                        }
                    </Box>
                }
                {
                    ((props.title != null || !props.disableSearch) && (table.filtering ?? []).length > 0) &&
                    <Box display="flex" ml={2} flexWrap="wrap" gap={2}>
                        {
                            table.filtering.map(f => <TablePanelFilterValue key={"col-" + f.column} filter={f} />)
                        }
                    </Box>
                }
                <Box /*style={{ maxHeight: `calc(100vh - ${maxHeight}px)` }}*/ overflow="auto">
                    <Box sx={{ width: "100%", height: 4 }}>
                        {isLoading && <LinearProgress color="secondary" />}
                    </Box>
                    <Table
                        size={props.dense ? "small" : "medium"}
                    /*style={{
                        minWidth: minWidth,
                        overflowX: overflow ? "auto" : undefined,
                        borderCollapse: stickyHeader ? "separate" : null,
                        borderSpacing: stickyHeader ? 0 : null
                    }}*/
                    >
                        <TableHead>
                            <ItnTableHeader />
                        </TableHead>
                        <TableBody>
                            {
                                errorLoading !== null ? <TableRow>
                                        <TableCell
                                            colSpan={displayColumns.length}// + (showRowNums ? 1 : 0) + (onRowSelect ? 1 : 0) + (detailRow ? 1 : 0)}
                                            style={{ textAlign: "center" }}//, height: 36 }}
                                        >
                                            {errorLoading}
                                        </TableCell>
                                    </TableRow> :
                                    rows.length === 0 ?
                                        <TableRow>
                                            <TableCell
                                                colSpan={displayColumns.length}// + (showRowNums ? 1 : 0) + (onRowSelect ? 1 : 0) + (detailRow ? 1 : 0)}
                                                style={{ textAlign: "center" }}//, height: 36 }}
                                            >
                                                {isLoading ? props.loadingMessage : props.noDataMessage}
                                            </TableCell>
                                        </TableRow> :
                                        rows.map((row) => {
                                            const idProp = props.idField as keyof typeof row;
                                            return <ItnTableRow row={row} key={`row-${row[idProp]}`} />;
                                        })
                            }
                        </TableBody>
                    </Table>
                </Box>
                {
                    (!props.disablePaging && queryRows.isFetched) &&
                    <ItnTablePagination />
                }
            </TableContext.Provider>
        </Paper>
    );
});

ItnTable.defaultProps = {
    apiUrl: null,
    idField: "id",
    disableQueryFilters: false,

    title: null,
    dense: false,

    toolbarAdornment: null,

    downloadProperties: null,

    noDataMessage: "Нет данных для отображения",
    loadingMessage: "Загрузка...",
    searchTooltipText: "Поиск",
    resetSearchTooltipText: "Сбросить поиск",
    filterTooltipText: "Фильтры",
    filterText: "Фильтры",
    hideColumnToolipText: "Отображение колонок",
    columnsText: "Колонки",
    filtersResetText: "Сбросить",
    filtersMinPlaceHolder: "минимум",
    filtersMaxPlaceHolder: "максимум",
    dateParseRE: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*$/,

    enableHideColumns: false,

    disableSearch: false,
    searching: "",
    onSearchingChange: null,
    onSortingChange: null,
    onFilteringChange: null,
    filters: null,
    filterNoOptionsText: "Ничего не найдено",
    filterClearText: "Очистить поиск",
    filterCloseText: "Свернуть",
    filterOpenText: "Развернуть",
    filterAllText: "Все",
    filterSelectValuesText: "Выбрано значений",

    disablePaging: false,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
    page: 0,
    pageSizeOptionsText: "Строк на странице",
    pageLabelText: ({ from, to, count }) => `${from}-${to} из ${count}`,
    prevPageText: "Пред. страница",
    nextPageText: "След. страница",

    onDownload: null,
    selectedRows: [],
    onRowSelect: null,
    onRowClick: null,
    enableRowsSelection: false,

    saveState: null
}

export default ItnTableWrapper;