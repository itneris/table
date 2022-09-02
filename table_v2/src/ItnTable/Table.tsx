import { Box, LinearProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { tab } from '@testing-library/user-event/dist/tab';
import { AxiosError, AxiosPromise, AxiosResponse } from 'axios';
import { error } from 'console';
import React, { useReducer, useState, useMemo, useEffect, useCallback, useImperativeHandle, forwardRef, FunctionComponent, useRef } from 'react';
import { ColumnDescription } from '../base/ColumnDescription';
import { ITableRef } from '../base/ITableRef';
import { LooseObject } from '../base/LooseObject';
import { TableRowsReponse } from '../base/TableRowsReponse';
import { FilterProperties } from '../props/FilterProperties';
import { ITableContext } from '../props/ITableContext';
import { ITableProperties } from '../props/ITableProperties';
import { TableQueryState } from '../props/TableQueryState';
import { TableState } from '../props/TableState';
import { getFilters, getRows } from '../queries/dataQueries';
import ItnTableHeader from './ItnTableHeader';
import ItnTablePagination from './ItnTablePagination';
import ItnTableRow from './ItnTableRow';
import TableFilter from './TableFilter';
import TablePanelFilterValue from './TablePanelFilterValue';
import { tableReducer } from './tableReducer';
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
 
const ItnTableWithQuery = forwardRef<ITableRef, ITableProperties>((props, ref) => {
    const table = useRef<ITableRef | null>(null);

    useImperativeHandle(ref, () => ({
        fetch() {
            table.current!.fetch();
        },
        getData() {
            return table.current!.getData();
        },
        getState(): TableState {
            return table.current!.getState();
        }
    }))

    if (props.queryClient) { 
        return (
            <QueryClientProvider client={props.queryClient}>
                <ItnTable ref={table} {...props} />
            </QueryClientProvider>
        );
    } else {
        return <ItnTable ref={table} {...props} />;
    }
});

const ItnTable = forwardRef<ITableRef,ITableProperties>((props, ref) => {
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
    }))

    const [ctrlIsClicked, setCtrlIsClicked] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorLoading, setErrorLoading] = useState<string | null>(null); 
    const [rows, setRows] = useState<Array<LooseObject>>([]);
    const [filters, setFilters] = useState<Array<FilterProperties>>([]);
    const [total, setTotal] = useState<number>(0);
    const [columns, setColumns] = useState<Array<ColumnDescription>>([]);

    const changeColumns = useCallback((newColumns: Array<ColumnDescription>) => setColumns(newColumns), []);

    const [table, dispatch] = useReducer(tableReducer, {
        filtering: props.filtering,
        searching: props.searching,
        sorting: props.sorting,
        pageSize: props.pageSize,
        page: props.page
    } as TableState);

    //INITIAL LOAD
    useEffect(() => {
        function EventCtlrClicked(e: KeyboardEvent) { e.code === "ControlLeft" && setCtrlIsClicked(true) };
        function EventCtlrUnclicked(e: KeyboardEvent) { e.code === "ControlLeft" && setCtrlIsClicked(false) };

        window.addEventListener("keydown", EventCtlrClicked);
        window.addEventListener("keyup", EventCtlrUnclicked);

        setColumns(props.columnsBuilder.Build());
        setIsLoading(props.apiUrl !== null);

        return () => {
            window.removeEventListener("keydown", EventCtlrClicked);
            window.removeEventListener("keyup", EventCtlrUnclicked);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
            enabled: props.queryClient !== null,
            onError: (err) => {
                setErrorLoading(`Ошибка загрузки данных: ${err.message || err.response.data.toString()}`);
            },
            onSuccess: (response) => {
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

    useQuery<AxiosResponse<FilterProperties[]>, AxiosError>(
        [props.apiUrl, 'filters'],
        getFilters(props.apiUrl ?? ""),
        {
            enabled: props.queryClient != null && props.filters == null && !props.disableQueryFilters,
            onSuccess: (response) => {
                setFilters(response.data);
            }
        }
    );

    //useEffectDebugger(() => {
    useEffect(() => {
        if (props.apiUrl) {
            queryRows.refetch();
            return;
        }
    }, [ // eslint-disable-line react-hooks/exhaustive-deps
        props.apiUrl,
        props.disablePaging,
        table.filtering,
        table.pageSize,
        table.searching,
        table.sorting,
        table.page,
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

    const hasToolbar = props.title || !props.disableSearch || props.onDownload !== null || filters.some(f => f.inToolbar);

    const contextValue: ITableContext = {
        searching: table.searching,
        dispatch: dispatch,
        disableSearch: props.disableSearch!,
        title: props.title!,
        onSearchingChange: props.onSearchingChange!,
        resetSearchTooltipText: props.restSearchTooltipText!,
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
        sorting: table.sorting,
        ctrlIsClicked: ctrlIsClicked,
        onSortingChange: props.onSortingChange!,
        onRowClick: props.onRowClick!,
        idField: props.idField!,
        pageSize: table.pageSize!,
        page: table.page,
        total: total,
        dateParseRE: props.dateParseRE
    };

    return (
        <Paper>
            <TableContext.Provider value={contextValue}>
                {
                    hasToolbar &&
                    <TableToolbar />
                }
                {
                    filters.some(f => f.inToolbar === true) &&
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
                    ((props.title != null || !props.disableSearch) && table.filtering.length > 0) &&
                    <Box display="flex" flexWrap="wrap">
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
                                                {props.noDataMessage}
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
                    !props.disablePaging &&
                    <ItnTablePagination total={total} />
                }
            </TableContext.Provider>
        </Paper>
    );
});

ItnTable.defaultProps = {
    items:  null,
    apiUrl: null,
    queryClient: null,
    idField: "id",
    disableQueryFilters: false,

    title: null,
    dense: false,

    toolbarAdornment: null,

    downloadProperties: null,

    noDataMessage: "Нет данных для отображения",
    loadingMessage: "Загрузка...",
    searchTooltipText: "Поиск",
    restSearchTooltipText: "Сбросить поиск",
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
    sorting: [],
    onSortingChange: null,
    filtering: [],
    onFilteringChange: null,
    filters: null,

    disablePaging: false,
    pageSize: 10,
    page: 0,
    onDownload: null,
    selectedRows: [],
    onRowSelect: null,
    onRowClick: null
}

export default ItnTableWithQuery;