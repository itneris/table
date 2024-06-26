import { Box, LinearProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useReducer, useState, useMemo, useEffect, useCallback, useImperativeHandle, forwardRef, useContext } from 'react';
import { ColumnDescription } from '../base/ColumnDescription';
import { ITableRef } from '../base/ITableRef';
import { FilterValueProperties } from '../props/FilterValueProperties';
import { ITableProperties } from '../props/ITableProperties';
import { SortProperties } from '../props/SortProperties';
import { TableQueryState } from '../props/TableQueryState';
import { TableState } from '../props/TableState';
import { getFileFromServer, getFilters, getRows } from '../queries/dataQueries';
import ItnTableHeader from './ItnTableHeader';
import ItnTablePagination from './ItnTablePagination';
import ItnTableRow from './ItnTableRow';
import TableFilter from './TableFilter';
import TablePanelFilterValue from './TablePanelFilterValue';
import { RESET_SELECTED_ROWS, SET_FILTERS, SET_SELECTED_ROWS, SET_SORT, SET_STATE, tableReducer } from './tableReducer';
import TableToolbar from './TableToolbar';
import getTableInitState from '../utils/getTableInitState';
import saveState from '../utils/saveState';
import { TableRowsResponse } from '../base/TableRowsResponse';
import { createTableContext } from '../context/TableContext';
import { ItnTableGlobalContext } from '../localization/ItnTableProvider';

/*const usePrevious = (value, initialValue) => {
    const ref = useRef(initialValue);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

const useEffectDebugger = (effectHook, dependencies, dependencyNames = []) => {
    const previousDeps = usePrevious(dependencies, []);

    const changedDeps = dependencies.reduce((acc, dependency, index) => {
        if (dependency !== previousDeps[index]) {
            const keyName = dependencyNames[index] || index;
            return {
                ...acc,
                [keyName]: {
                    before: previousDeps[index],
                    after: dependency
                }
            };
        }

        return acc;
    }, {});

    if (Object.keys(changedDeps).length) {
        console.log('[use-effect-debugger] ', changedDeps);
    }

    useEffect(effectHook, dependencies);
};*/

declare module "react" {
    function forwardRef<T, P = {}>(
        render: (props: P, ref: React.Ref<T>) => React.ReactNode | null
    ): (props: P & React.RefAttributes<T>) => React.ReactNode | null;
}

const INITIAL_PAGE_OPTIONS = [10, 25, 50, 100];

function ItnTableInner<T>(props: ITableProperties<T>, ref: React.ForwardedRef<ITableRef<T>>) {
    const {
        apiUrl = null,
        idField = ("id" as keyof T),
        disableQueryFilters = false,

        title = null,
        dense = false,

        toolbarAdornment = null,
        downloadProperties = null,

        dateParseRE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*$/,

        enableHideColumns = false,

        disableSearch = false,
        onSearchingChange = null,
        onSortingChange = null,
        onFilteringChange = null,
        filters: propFilters = null,

        disablePaging = false,
        pageSizeOptions = INITIAL_PAGE_OPTIONS,

        onDownload = null,
        selectedRows = null,
        onRowSelect = null,
        onRowClick = null,
        enableRowsSelection = false,

        saveState: propSaveState = null,
        columnsBuilder,
        mutateRows
    } = props;

    const { locale } = useContext(ItnTableGlobalContext);

    const [table, dispatch] = useReducer(tableReducer, getTableInitState(props));
    const queryClient = useQueryClient();

    useImperativeHandle(ref, () => ({
        fetch() {
            tableDataQuery.refetch();
        },
        getData() {
            return tableData.rows;
        },
        setData(rows: T[]) {
            queryClient.setQueryData([apiUrl, 'list', queryOptions], (oldData: TableRowsResponse<T> | undefined) => {
                if (!oldData) {
                    return oldData;
                }
                return {
                    ...oldData,
                    rows
                }
            });
        },
        getState(): TableState {
            return table;
        },
        setState(state: TableState) {
            dispatch({ type: SET_STATE, state });
            saveState(propSaveState, () => {
                return state;
            });
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
    }));

    const [ctrlIsClicked, setCtrlIsClicked] = useState<boolean>(false);
    const [columns, setColumns] = useState<Array<ColumnDescription<T>>>([]);

    const changeColumns = useCallback((newColumns: Array<ColumnDescription<T>>) => setColumns(newColumns), []);

    //INITIAL LOAD
    useEffect(() => {
        function EventCtrlClicked(e: KeyboardEvent) { e.code === "ControlLeft" && setCtrlIsClicked(true) };
        function EventCtrlBlurred(e: KeyboardEvent) { e.code === "ControlLeft" && setCtrlIsClicked(false) };

        window.addEventListener("keydown", EventCtrlClicked);
        window.addEventListener("keyup", EventCtrlBlurred);

        return () => {
            window.removeEventListener("keydown", EventCtrlClicked);
            window.removeEventListener("keyup", EventCtrlBlurred);
        };
    }, []);

    useEffect(() => {
        const newColumns = columnsBuilder.Build();
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
    }, [columnsBuilder, setColumns]); // eslint-disable-line react-hooks/exhaustive-deps

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

    const queryFn = useMemo(() => {
        return getRows(apiUrl ?? "", queryOptions, mutateRows);
    }, [apiUrl, queryOptions, mutateRows]);


    const { data: tableData, ...tableDataQuery } = useQuery({
        queryKey: [apiUrl, 'list', queryOptions],
        queryFn: queryFn,
        initialData: { rows: [], total: 0 },
        enabled: apiUrl !== null && columns.length > 0
    });

    const queryFiltersFn = useMemo(() => {
        return getFilters(apiUrl ?? "");
    }, [apiUrl]);

    const { data: filters } = useQuery({
        queryKey: [apiUrl, 'filters'],
        queryFn: queryFiltersFn,
        initialData: propFilters ?? [],
        enabled: apiUrl != null && propFilters == null && !disableQueryFilters,
    });

    useEffect(() => {
        if (selectedRows) {
            dispatch({ type: SET_SELECTED_ROWS, selectedRows });
        }
    }, [selectedRows]);

    const { mutate: downloadMutate, ...downloadMutation } = useMutation({
        mutationFn: getFileFromServer,        
        onSuccess: (file) => {
            const url = URL.createObjectURL(file);
            let downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = file.name;

            downloadLink.click();
            downloadLink.remove();
        }
    });

    //useEffectDebugger(() => {
    /*useEffect(() => {
        if (apiUrl && columns.length > 0) {
            tableDataQuery.refetch();
            return;
        }
    }, [ // eslint-disable-line react-hooks/exhaustive-deps
        columns,
        apiUrl,
        disablePaging,
        //table.filtering,
        //table.pageSize,
        //table.searching,
        //table.sorting,
        //table.page,
    ]);*/

    const handleDownload = useCallback(() => {
        if (onDownload) {
            onDownload(table);
            return;
        }

        downloadMutate({
            downloadProperties: downloadProperties!,
            state: table,
            url: apiUrl!
        });
    }, [apiUrl, downloadProperties, table, downloadMutate, onDownload]);

    const hasToolbar = useMemo(() => {
        return title ||
            !disableSearch ||
            onDownload !== null ||
            filters.filter(f => f.inToolbar).length > 0 ||
            downloadProperties !== null
    }, [title, onDownload, disableSearch, filters, downloadProperties]);

    const contextValue = useMemo(() => {
        return {
            searching: table.searching,
            dispatch: dispatch,
            disableSearch: disableSearch,
            title: title,
            onSearchingChange: onSearchingChange,
            filters: filters,
            filtering: table.filtering,
            onFilteringChange: onFilteringChange,
            columns: columns,
            toolbarAdornment: toolbarAdornment,
            enableHideColumns: enableHideColumns,
            changeColumns,
            sorting: table.sorting,
            ctrlIsClicked: ctrlIsClicked,
            onSortingChange: onSortingChange,
            onRowClick: onRowClick,
            idField: idField,
            pageSize: table.pageSize,
            page: table.page,
            total: tableData.total,
            dateParseRE: dateParseRE,
            pageSizeOptions: pageSizeOptions,
            enableRowsSelection: enableRowsSelection,
            onRowSelect: onRowSelect,
            selectedRows: table.selectedRows,
            rows: tableData.rows,
            saveState: propSaveState,
            onDownload: onDownload || downloadProperties ? handleDownload : null
        }
    }, [
        tableData,
        table,
        changeColumns,
        columns,
        ctrlIsClicked,
        filters,
        handleDownload,
        dateParseRE,
        disableSearch,
        downloadProperties,
        enableHideColumns,
        enableRowsSelection, 
        idField,
        onDownload,
        onFilteringChange,
        onRowClick,
        onRowSelect,
        onSearchingChange,
        onSortingChange,
        pageSizeOptions,
        propSaveState,
        title,
        toolbarAdornment
    ]);


    const TableContext = useMemo(() => createTableContext<T>(), []);

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
                                        key={"tab-filter-" + i}
                                        filter={filter}
                                    />
                                )
                        }
                    </Box>
                }
                {
                    ((title != null || !disableSearch) && (table.filtering ?? []).length > 0) &&
                    <Box display="flex" ml={2} flexWrap="wrap" gap={2}>
                        {
                            table.filtering.map(f => <TablePanelFilterValue key={"col-" + f.column} filter={f} />)
                        }
                    </Box>
                }
                <Box /*style={{ maxHeight: `calc(100vh - ${maxHeight}px)` }}*/ overflow="auto">
                    <Box sx={{ width: "100%", height: 4 }}>
                        {(tableDataQuery.isFetching || downloadMutation.isPending) && <LinearProgress color="secondary" />}
                    </Box>
                    <Table
                        size={dense ? "small" : "medium"}
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
                                tableDataQuery.isError ? <TableRow>
                                    <TableCell
                                            colSpan={displayColumns.length + (enableRowsSelection ? 1 : 0)}// + (showRowNumbers ? 1 : 0) + (detailRow ? 1 : 0)}
                                            style={{ textAlign: "center" }}//, height: 36 }}
                                        >
                                            Ошибка загрузки данных: {tableDataQuery.error.message}
                                        </TableCell>
                                    </TableRow> :
                                    tableData.rows.length === 0 ?
                                        <TableRow>
                                            <TableCell
                                                colSpan={displayColumns.length + (enableRowsSelection ? 1 : 0)}// + (showRowNumbers ? 1 : 0) + (detailRow ? 1 : 0)}
                                                style={{ textAlign: "center" }}//, height: 36 }}
                                            >
                                                {tableDataQuery.isLoading ? locale.table.loadingText : locale.table.noDataText}
                                            </TableCell>
                                        </TableRow> :
                                        tableData.rows.map((row) => {
                                            const idProp = idField as keyof typeof row;
                                            return <ItnTableRow row={row} key={`row-${row[idProp]}`} />;
                                        })
                            }
                        </TableBody>
                    </Table>
                </Box>
                {
                    (!disablePaging && tableDataQuery.isFetched) &&
                    <ItnTablePagination />
                }
            </TableContext.Provider>
        </Paper>
    );
};

const ItnTable = forwardRef(ItnTableInner);
export default ItnTable;