import { Box, LinearProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React, {  useState, useMemo, useEffect, useCallback, useImperativeHandle, forwardRef, useContext } from 'react';
import { ColumnSettings } from '../types/ColumnProps';
import { TableRef } from '../types/TableRef';
import { ITableProperties } from '../props/ITableProperties';
import { TableState } from '../props/TableState';
import ItnTableHeader from './ItnTableHeader';
import ItnTablePagination from './ItnTablePagination';
import ItnTableRow from './ItnTableRow';
import TableFilter from './TableFilter';
import TablePanelFilterValue from './TablePanelFilterValue';
import TableToolbar from './TableToolbar';
import saveState from '../utils/saveState';
import { createTableContext } from '../context/TableContext';
import { ItnTableGlobalContext } from '../providers/ItnTableProvider';
import { ITableContext } from '../context/ITableContext';
import { createTableStateContext } from '../context/TableStateContext';
import { ITableStateContext } from '../context/ITableStateContext';
import useColumns from '../providers/TableColumnsProvider/useColumns';
import calculateRows from '../utils/calculateRows';

const INITIAL_PAGE_OPTIONS = [10, 25, 50, 100];

function ItnTable<T>(props: ITableProperties<T>) {
    const {
        data = [],
        total = 0,
        idField = ("id" as keyof T),

        title = null,
        dense = false,

        toolbarAdornment = null,

        enableHideColumns = false,

        disableSearch = false,
        filters = [],

        disablePaging = false,
        pageSizeOptions = INITIAL_PAGE_OPTIONS,

        selectedRows = null,
        onRowSelect = null,
        onRowClick = null,
        enableRowsSelection = false,

        saveState: propSaveState = null,
        initialState = {
            filtering: [],
            page: 0,
            pageSize: INITIAL_PAGE_OPTIONS[0],
            searching: "",
            selectedRows: [],
            sorting: []
        },
        onStateChange,
        isError = false,
        isFetching = false,
        serverSide = false,
        errorMessage,
        isSuccess = true,
        ref
    } = props;

    const { locale } = useContext(ItnTableGlobalContext);

    const [tableState, setTableState] = useState(initialState);

    useImperativeHandle(ref, () => ({
        getState(): TableState {
            return tableState;
        },
        setState(state: TableState) {
            setTableState(state);
            saveState(propSaveState, state);
        },
        getSelectedRows() {
            return tableState.selectedRows;
        },
        resetSelection() {
            setTableState(old => ({ ...old, selectedRows: [] }));
        },
        setSelectedRows(ids: string[]) {
            setTableState(old => ({ ...old, selectedRows: ids }));
        }
    }));

    const [ctrlIsClicked, setCtrlIsClicked] = useState<boolean>(false);
    
    const { columnsSettings: columns, changeVisibility: changeColumnsVisibility } = useColumns<T>();

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

    // useEffect(() => {
    //     const newColumns = columnsBuilder.Build();
    //     const initTableState = getTableInitState(props);

    //     setColumns(newColumns);
    //     const defaultSorting = newColumns
    //         .filter(col => col.sortOrder !== null)
    //         .map(col => ({ column: col.property, ascending: col.sortAscending } as SortProperties));

    //     dispatch({ type: SET_SORT, sorting: initTableState.sorting || defaultSorting });

    //     const defaultFiltering = newColumns
    //         .filter(col => col.filtering !== null)
    //         .map(col => ({
    //             column: col.property,
    //             label: col.displayName,
    //             ...col.filtering
    //         } as FilterValueProperties));

    //     dispatch({ type: SET_FILTERS, filtering: [...(initTableState.filtering ?? []), ...defaultFiltering], isInit: true });
    // }, [columnsBuilder, setColumns]); // eslint-disable-line react-hooks/exhaustive-deps

    const displayColumns = useMemo(() => columns.filter(c => c.display), [columns]);

    useEffect(() => {
        if (selectedRows) {
            setTableState(old => ({ ...old, selectedRows: selectedRows }));
        }
    }, [selectedRows]);

    const hasToolbar = useMemo(() => {
        return title ||
            !disableSearch ||
            filters.filter(f => f.inToolbar).length > 0
    }, [title, disableSearch, filters]);
    
    const onStateChanged = useCallback((stateChange: React.SetStateAction<TableState>) => {
        const newState = typeof stateChange === "function" ? stateChange(tableState) : stateChange;

        setTableState(newState);
        saveState(propSaveState, newState);
        onStateChange && onStateChange(newState);
    }, [onStateChange, propSaveState]);

    const rows = useMemo(() => {
        if (serverSide) {
            return data ?? [];
        }

        if (data) {
            return calculateRows(data, tableState, columns);
        }

        return [];
    }, [data, serverSide, tableState, columns]);

    const contextValue = useMemo(() => {
        return {
            disableSearch: disableSearch,
            title: title,
            filters,
            columns: columns,
            toolbarAdornment: toolbarAdornment,
            enableHideColumns: enableHideColumns,
            changeColumns: changeColumnsVisibility,
            ctrlIsClicked: ctrlIsClicked,
            onRowClick: onRowClick,
            idField: idField,
            total: total,
            pageSizeOptions: pageSizeOptions,
            enableRowsSelection: enableRowsSelection,
            rows,
            saveState: propSaveState
        } satisfies ITableContext<T>
    }, [
        total,
        changeColumnsVisibility,
        columns,
        ctrlIsClicked,
        filters,
        data,
        disableSearch,
        enableHideColumns,
        enableRowsSelection, 
        idField,
        onRowClick,
        pageSizeOptions,
        propSaveState,
        title,
        toolbarAdornment
    ]);

    const stateContextValue = useMemo(() => {
        return {
            ...tableState,
            onStateChanged,
            onRowSelect
        } satisfies ITableStateContext<T>
    }, [tableState, onStateChanged, onRowSelect]);


    const TableContext = useMemo(() => createTableContext<T>(), []);
    const TableStateContext = useMemo(() => createTableStateContext<T>(), []);

    return (
        <Paper>
            <TableContext.Provider value={contextValue}>
                <TableStateContext.Provider value={stateContextValue}>
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
                        ((title != null || !disableSearch) && (tableState.filtering ?? []).length > 0) &&
                        <Box display="flex" ml={2} flexWrap="wrap" gap={2}>
                            {
                                tableState.filtering.map(f => <TablePanelFilterValue key={"col-" + f.column} filter={f} />)
                            }
                        </Box>
                    }
                    <Box /*style={{ maxHeight: `calc(100vh - ${maxHeight}px)` }}*/ overflow="auto">
                        {props.children}
                        <Box sx={{ width: "100%", height: 4 }}>
                            {isFetching && <LinearProgress color="secondary" />}
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
                                    isError ? 
                                        <TableRow>
                                            <TableCell
                                                    colSpan={displayColumns.length + (enableRowsSelection ? 1 : 0)}// + (showRowNumbers ? 1 : 0) + (detailRow ? 1 : 0)}
                                                    style={{ textAlign: "center" }}//, height: 36 }}
                                                >
                                                    Ошибка загрузки данных: {errorMessage}
                                            </TableCell>
                                        </TableRow> :
                                        rows.length === 0 ?
                                            <TableRow>
                                                <TableCell
                                                    colSpan={displayColumns.length + (enableRowsSelection ? 1 : 0)}// + (showRowNumbers ? 1 : 0) + (detailRow ? 1 : 0)}
                                                    style={{ textAlign: "center" }}//, height: 36 }}
                                                >
                                                    {!isSuccess ? locale.table.loadingText : locale.table.noDataText}
                                                </TableCell>
                                            </TableRow> :
                                            rows.map((row) => {
                                                const idProp = idField as keyof typeof row;
                                                return <ItnTableRow row={row} key={`row-${row[idProp]}`} />;
                                            })
                                }
                            </TableBody>
                        </Table>
                    </Box>
                    {
                        (!disablePaging && isSuccess) &&
                        <ItnTablePagination />
                    }
                </TableStateContext.Provider>
            </TableContext.Provider>
        </Paper>
    );
};

export default ItnTable;