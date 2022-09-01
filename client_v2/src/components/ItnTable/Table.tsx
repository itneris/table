import { useTheme } from '@emotion/react';
import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useReducer, useState, useMemo, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { ColumnDescription, ColumnDescriptionBase } from '../base/ColumnDescription';
import { LooseObject } from '../base/LooseObject';
import { FilterProperties } from '../props/FilterProperties';
import { ITableContext, ITableContextBase } from '../props/ITableContext';
import { TableProperties } from '../props/TableProperties';
import { TableQueryState } from '../props/TableQueryState';
import { TableState } from '../props/TableState';
import { getFilters, getRows } from '../queries/dataQueries';
import ItnTableHeader from './ItnTableHeader';
import ItnTablePagination from './ItnTablePagination';
import ItnTableRow from './ItnTableRow';
import TableFilter from './TableFilter';
import TablePanelFilterValue from './TablePanelFilterValue';
import { SET_FILTERS, SET_SELECT, SET_SORT, tableReducer } from './tableReducer';
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


export const TableContext = React.createContext<ITableContextBase | null>(null);

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

function ItnTable<T>(props: TableProperties<T>) {
    const [ctrlIsClicked, setCtrlIsClicked] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorLoading, setErrorLoading] = useState<string|null>(null);
    const [rows, setRows] = useState<Array<T>>([]);
    const [filters, setFilters] = useState<Array<FilterProperties>>([]);
    const [total, setTotal] = useState<number>(0);
    const [columns, setColumns] = useState<Array<ColumnDescription<T>>>([]);

    const changeColumns = useCallback((newColumns: Array<ColumnDescription<T>>) => setColumns(newColumns), []);

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
    }, []);

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


    const queryRows = useQuery(
        [props.apiUrl, 'list', queryOptions],
        getRows<T>(props.apiUrl ?? "", queryOptions),
        {
            enabled: props.useReactQuery,
            onError: () => {
                setErrorLoading('Ошибка загрузки данных');
            },
            onSuccess: (data) => {
                setRows(data.rows);
                setTotal(data.total);
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

    useQuery(
        [props.apiUrl, 'filters'],
        getFilters(props.apiUrl ?? ""),
        {
            enabled: props.useReactQuery && props.filters == null,
            onSuccess: (data) => {
                setFilters(data);
            }
        }
    );

    //useEffectDebugger(() => {
    useEffect(() => {
        if (props.apiUrl) {
            queryRows.refetch();
            return;
        }
    }, [
        rows,
        props.apiUrl,
        props.disablePaging,
        table.filtering,
        table.pageSize,
        table.searching,
        table.sorting,
        table.page
    ]);

    useEffect(() => {
        dispatch({ type: SET_SORT, sorting: props.sorting });
    }, [props.sorting]);

    useEffect(() => {
        dispatch({ type: SET_FILTERS, filtering: props.filtering ?? [] });
    }, [props.filtering]);

    useEffect(() => {
        dispatch({
            type: SET_SELECT,
            selectedRows: props.selectedRows.map(row => {
                if (typeof (row) === "string") {
                    return row;
                } else {
                    const idPropName = props.idField as keyof typeof row;
                    return row[idPropName];
                }
            })
        });
    }, [props.selectedRows]);

    const hasToolbar = props.title || !props.disableSearch || props.onDownload !== null || filters.some(f => f.inToolbar);

    const contextValue: ITableContext<T> = {
        searching: table.searching,
        dispatch: dispatch,
        disableSearch: props.disableSearch,
        title: props.title,
        onSearchingChange: props.onSearchingChange,
        resetSearchTooltipText: props.restSearchTooltipText,
        filters: filters,
        filtering: table.filtering,
        onFilteringChange: props.onFilteringChange,
        columns: columns,
        toolbarAdornment: props.toolbarAdornment,
        searchTooltipText: props.searchTooltipText,
        enableHideColumns: props.enableHideColumns,
        hideColumnToolipText: props.hideColumnToolipText,
        columnsText: props.columnsText,
        changeColumns: changeColumns,
        filterTooltipText: props.filterTooltipText,
        filtersResetText: props.filtersResetText,
        filtersMinPlaceHolder: props.filtersMinPlaceHolder,
        filtersMaxPlaceHolder: props.filtersMaxPlaceHolder,
        sorting: table.sorting,
        ctrlIsClicked: ctrlIsClicked,
        onSortingChange: props.onSortingChange,
        onRowClick: props.onRowClick,
        idField: props.idField,
        pageSize: props.pageSize,
        page: table.page
    };

    return (
        <>
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
        </>
    );
}//)

/*const useStyles = makeStyles({
    inputRoot: {
        marginTop: "24px !important"
    },
    paperMenu: {
        padding: 16,
        maxWidth: 800,
        minWidth: 200
    }
})*/

export default ItnTable;