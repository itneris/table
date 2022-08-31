import { useTheme } from '@emotion/react';
import { Box, Paper } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useReducer, useState, useMemo, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { ColumnDescription, ColumnDescriptionBase } from '../base/ColumnDescription';
import { FilterProperties } from '../props/FilterProperties';
import { ITableContext, ITableContextBase } from '../props/ITableContext';
import { TableProperties } from '../props/TableProperties';
import { TableQueryState } from '../props/TableQueryState';
import { TableState } from '../props/TableState';
import { getFilters, getRows } from '../queries/dataQueries';
import { SET_FILTERS, SET_SORT, tableReducer } from './tableReducer';
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

const Table = forwardRef(<T extends unknown>(props: TableProperties<T>, ref: React.ForwardedRef<any>) => {
    const [ctrlIsClicked, setCtrlIsClicked] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorLoading, setErrorLoading] = useState<string|null>(null);
    const [rows, setRows] = useState<Array<T>>([]);
    const [filters, setFilters] = useState<Array<FilterProperties>>([]);
    const [total, setTotal] = useState<number>(0);
    const [contextOptions, setContextOptions] = useState(null);
    const theme = useTheme();
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

    const displayColumns = useMemo(() => columns.filter(c => !c.display), [columns]);
    const idField = useMemo(() => props.idField ?? "id", [props.idField]);

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
    }));

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
                    const idPropName = (props.idField ?? 'id') as (keyof typeof row);
                    return row[idPropName];
                }
            })
        });
    }, [props.selectedRows]);

    const hasToolbar = props.title || !props.disableSearch || props.onDownload !== null || filters.some(f => f.inToolbar);

    return (
        <>
            <Paper>
                <TableContext.Provider
                    value={{
                        searching: table.searching,
                        dispatch: dispatch,
                        disableSearch: props.disableSearch,
                        title: props.title,
                        onSearchingChange: props.onSearchingChange,
                        resetSearchTooltipText: props.restSearchTooltipText,
                        filters: filters,
                        filtering: table.filtering,
                        onFilteringChange: props.onFilteringChange,
                        columns: columns.map(c => c as ColumnDescriptionBase),
                        toolbarAdornment: props.toolbarAdornment,
                        searchTooltipText: props.searchTooltipText,
                        enableHideColumns: props.enableHideColumns,
                        hideColumnToolipText: props.hideColumnToolipText,
                        columnsText: props.columnsText,
                        changeColumns: changeColumns,
                        filterTooltipText: props.filterTooltipText,
                        filtersResetText: props.filtersResetText,
                        filtersMinPlaceHolder: props.filtersMinPlaceHolder,
                        filtersMaxPlaceHolder: props.filtersMaxPlaceHolder
                    } as ITableContext<T>}
                >
                    {
                        hasToolbar &&
                        <TableToolbar />
                    }
                    {
                        filters.filter(f => f.inToolbar === true).length > 0 &&
                        <Box display="flex" flexWrap="wrap">
                            {
                                filters.filter(f => f.inToolbar === true).map((filter, i) =>
                                    <Filter
                                        key={"tab-filt-" + i}
                                        c={columns.find(c => c.name === filter.column)}
                                        changeFilter={ChangeFilter}
                                        getFilterValue={GetFilterValue}

                                        currentFilter={table.filters.find(currentFilter => currentFilter.column === filter.column)}
                                        filter={filter}
                                        multiFilter={multiFilter}
                                    />
                                )
                            }
                        </Box>
                    }
                    {
                        (
                            (title || !disableSearch) &&
                            table.filters.length > 0
                        )
                        &&
                        <div style={{ display: "flex", paddingLeft: 24, flexWrap: 'wrap' }}>
                            {
                                table.filters.map(f =>
                                    <Box key={"col-" + f.column} display="flex" alignItems="center" mr={1} flexWrap="wrap">
                                        <Typography variant="body2" color="textSecondary">
                                            {columns.find(tc => tc.name === f.column) ? columns.find(tc => tc.name === f.column).label : f.label}:
                                        </Typography>
                                        {RenderFilter(f)}
                                    </Box>
                                )
                            }
                        </div>
                    }
                    <Box style={{ maxHeight: `calc(100vh - ${maxHeight}px)` }} overflow="auto">
                        <Table
                            size={small ? "small" : 'medium'}
                            style={{
                                minWidth: minWidth,
                                overflowX: overflow ? "auto" : undefined,
                                borderCollapse: stickyHeader ? "separate" : null,
                                borderSpacing: stickyHeader ? 0 : null
                            }}
                        >
                            <TableHead>
                                {
                                    headRows.length > 0 ?
                                        headRows.map((r, index) => {
                                            return <TableRow key={"table-row-" + index}>
                                                {
                                                    index === 0 && detailRow &&
                                                    <TableCell key="dr0" rowSpan={headRows.length} style={{ zIndex: 1, padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}> </TableCell>
                                                }
                                                {
                                                    (index === 0 && onRowSelect) &&
                                                    <TableCell style={{ zIndex: 1, padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>
                                                        <Checkbox
                                                            checked={table.selectedRows.length > 0 && table.selectedRows.length === rows.length}
                                                            onChange={(event) => {
                                                                if (event.target.checked) {
                                                                    dispatch({ type: SET_SELECTED_ROWS, selectedRows: rows });
                                                                    onRowSelect && onRowSelect(rows);
                                                                } else {
                                                                    dispatch({ type: RESET_SELECTED_ROWS });
                                                                    onRowSelect && onRowSelect([]);
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                }
                                                {
                                                    index === 0 && showRowNums &&
                                                    <TableCell key="hd0" rowSpan={headRows.length} style={{ zIndex: 1, padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>№ п/п</TableCell>
                                                }
                                                {
                                                    r.map((c, i) => {
                                                        return enableColumnsHide && !columns.find(col => col.name === c.name)?.options.display ? null : <HeadCell
                                                            sections={table.sections}
                                                            key={"hd1" + i}
                                                            column={c}
                                                            sorted={table.sort.find(s => s.column === c.name)}
                                                            sort={ChangeSort}
                                                            small={small}
                                                            sortIndex={table.sort.length < 2 ? undefined : table.sort.map(s => s.column).indexOf(c.name)}
                                                        />
                                                    })
                                                }
                                            </TableRow>;
                                        }) :
                                        <TableRow>
                                            {
                                                detailRow &&
                                                <TableCell key="dr0" rowSpan={headRows.length}
                                                    style={{ zIndex: 1, padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>
                                                </TableCell>
                                            }
                                            {
                                                onRowSelect &&
                                                <TableCell style={{ zIndex: 1, padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>
                                                    <Checkbox
                                                        checked={table.selectedRows.length > 0 && table.selectedRows.length === rows.length}
                                                        onChange={(event) => {
                                                            if (event.target.checked) {
                                                                dispatch({ type: SET_SELECTED_ROWS, selectedRows: rows });
                                                                onRowSelect(rows);
                                                            } else {
                                                                dispatch({ type: RESET_SELECTED_ROWS });
                                                                onRowSelect([]);
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                            }
                                            {
                                                showRowNums &&
                                                <TableCell key="hd0" style={{ zIndex: 1, padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>№ п/п</TableCell>
                                            }
                                            {
                                                displayColumns.map((c, i) => {
                                                    return <HeadCell
                                                        sections={table.sections}
                                                        key={"hd2" + i}
                                                        column={c}
                                                        sorted={table.sort.find(s => s.column === c.name)}
                                                        sort={ChangeSort}
                                                        small={small}
                                                        sortIndex={table.sort.length < 2 ? undefined : table.sort.map(s => s.column).indexOf(c.name)}
                                                    />;
                                                })
                                            }
                                        </TableRow>
                                }
                                {
                                    showColNums &&
                                    <TableRow>
                                        {
                                            showRowNums &&
                                            <TableCell key="hd0" style={{ zIndex: 1, padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>1</TableCell>
                                        }
                                        {
                                            columns.filter(c => !c.options || !c.options.onlyHead).map((c, i) => {
                                                return <TableCell key={c.name} style={{
                                                    ...(c.options && c.options.customHeadStyle),
                                                    padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px",
                                                    display: (c.options && c.options.section && !table.sections[c.options.section].expanded) ? "none" : null,
                                                    zIndex: 1
                                                }}>
                                                    {i + (showRowNums ? 2 : 1)}
                                                </TableCell>;
                                            })
                                        }
                                    </TableRow>
                                }
                            </TableHead>
                            <TableBody>
                                {
                                    /* isLoading ?
                                         <TableRow>
                                             <TableCell
                                                 colSpan={displayColumns.length + (showRowNums ? 1 : 0) + (onRowSelect ? 1 : 0) + (detailRow ? 1 : 0)}
                                                 style={{ textAlign: "center", height: 36 }}
                                             >
                                                 Загрузка...
                                             </TableCell>
                                         </TableRow> :*/
                                    rows.length === 0 ?
                                        <TableRow>
                                            <TableCell
                                                colSpan={displayColumns.length + (showRowNums ? 1 : 0) + (onRowSelect ? 1 : 0) + (detailRow ? 1 : 0)}
                                                style={{ textAlign: "center", height: 36 }}
                                            >
                                                {noDataMessage || 'Нет данных для отображения'}
                                            </TableCell>
                                        </TableRow> :
                                        rows.map((n, rowI) => <React.Fragment key={"data-row" + n.id}>
                                            <TableRow
                                                hover={onRowClick != null}
                                                style={{
                                                    cursor: onRowClick ? "pointer" : "default",
                                                    backgroundColor: stripedRows && rowI % 2 ? '#fafafa' : color ? color(n) : undefined,
                                                    display: !n.totalId || openTotals.includes(n.totalId) ? "table-row" : "none"
                                                }}
                                                onClick={() => !n.totalRow && onRowClick && onRowClick(n)}
                                                onContextMenu={e => {
                                                    if (context) {
                                                        e.preventDefault();
                                                        let visibleContext = context.filter(c => c.hidden === undefined || c.hidden === null || c.hidden(n) === false);
                                                        if (visibleContext.length > 0) {
                                                            setContextOptions(
                                                                contextOptions === null ?
                                                                    { position: { x: e.clientX - 2, y: e.clientY - 4 }, context: visibleContext, id: n[idField], row: n } :
                                                                    {}
                                                            );
                                                        }
                                                    }
                                                }}
                                            >
                                                {
                                                    detailRow && n.isChild ?
                                                        <TableCell
                                                            key={"detailRow" + n.id}
                                                            style={{
                                                                padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px",
                                                                borderLeft: `3px solid ${theme.palette.primary.main}`
                                                            }}>
                                                        </TableCell> :
                                                        detailRow &&
                                                        <TableCell key={"detailRow" + n.id} style={{ padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>
                                                            <IconButton
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    e.nativeEvent.stopImmediatePropagation();
                                                                    let detailRows;
                                                                    if (table.detailRows.find(dr => dr[idField] === n[idField])) {
                                                                        detailRows = [...table.detailRows].filter(sc => sc[idField] !== n[idField]);
                                                                    } else {
                                                                        detailRows = [...table.detailRows, n];
                                                                    }
                                                                    dispatch({ type: SET_DETAIL_ROWS, detailRows });
                                                                }}
                                                            >
                                                                {
                                                                    !!table.detailRows.find(dr => dr[idField] === n[idField]) ?
                                                                        <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />
                                                                }
                                                            </IconButton>
                                                        </TableCell>
                                                }
                                                {
                                                    onRowSelect &&
                                                    <TableCell key={"checkbox" + n.id} style={{ padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>
                                                        <Checkbox
                                                            checked={!!table.selectedRows.find(sc => sc[idField] === n[idField])}
                                                            onChange={async (event) => {
                                                                let selectedRows;
                                                                if (event.target.checked) {
                                                                    selectedRows = [...table.selectedRows, n];
                                                                } else {
                                                                    selectedRows = [...table.selectedRows].filter(sc => sc[idField] !== n[idField]);
                                                                }
                                                                dispatch({ type: SET_SELECTED_ROWS, selectedRows });
                                                                onRowSelect(selectedRows);
                                                            }}
                                                        />
                                                    </TableCell>
                                                }
                                                {
                                                    (showRowNums && !n.totalRow) &&
                                                    <TableCell key={"row-" + n.id + "-number"} style={{ padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px" }}>{rowNumber++}</TableCell>
                                                }
                                                {
                                                    n.totalRow && !totalRow &&
                                                    <TableCell key={"row-" + n.id + "-total"}>
                                                        <IconButton aria-label="expand row" size="small" onClick={() => ToggleTotal(n.id)}>
                                                            {openTotals.includes(n.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                        </IconButton>
                                                    </TableCell>
                                                }
                                                {
                                                    displayColumns.filter(c => !c.options || !c.options.onlyHead).map((c, i) =>
                                                        n.totalRow && c.name === totalRow ?
                                                            <TableCell key={"row-" + n.id + "-column-" + c.name}>
                                                                <IconButton aria-label="expand row" size="small" onClick={() => ToggleTotal(n.id)}>
                                                                    {openTotals.includes(n.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                                </IconButton>
                                                            </TableCell> :
                                                            <TableCell
                                                                key={"row-" + n.id + "-column-" + c.name}
                                                                style={{
                                                                    display: (c.options && c.options.section && !table.sections[c.options.section].expanded) ? "none" : null,
                                                                    padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px",
                                                                    paddingRight: i === columns.length - 1 ? 16 : 4,
                                                                    backgroundColor: c.options && c.options.color ? c.options.color(n) : "inherit",
                                                                    fontWeight: n.totalRow ? "bold" : "inherit",
                                                                    ...((c.options || {}).tdStyle || {})
                                                                }}
                                                            >
                                                                {c.options && c.options.customBodyRender ? c.options.customBodyRender(n[c.name], n) : dateFormat.test(n[c.name]) ? format(n[c.name], 'DD.MM.yyyy') : n[c.name]}
                                                            </TableCell>
                                                    )
                                                }
                                            </TableRow>
                                            {
                                                table.detailRows.find(dr => dr[idField] === n[idField]) && detailRow === true && n[childField].length === 0 ?
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={displayColumns.length + (showRowNums ? 1 : 0) + (onRowSelect ? 1 : 0) + (detailRow ? 1 : 0)}
                                                            style={{ textAlign: "center", height: 36 }}
                                                        >
                                                            {noDataMessage || 'Нет данных для отображения'}
                                                        </TableCell>
                                                    </TableRow>
                                                    :
                                                    table.detailRows.find(dr => dr[idField] === n[idField]) && detailRow !== true && <TableRow>
                                                        <TableCell colSpan={displayColumns.length + (showRowNums ? 1 : 0) + (onRowSelect ? 1 : 0) + (detailRow ? 1 : 0)}
                                                            style={{ textAlign: "center", height: 36 }}>
                                                            {detailRow}
                                                        </TableCell>
                                                    </TableRow>
                                            }
                                        </React.Fragment>
                                        )}
                            </TableBody>
                        </Table>
                    </Box>
                    {
                        !disablePaging &&
                        <TablePagination
                            component="div"
                            count={total}
                            rowsPerPageOptions={rowsPerPageOptions || [10, 25, 50, 100]}
                            rowsPerPage={table.rowsPerPage}
                            labelRowsPerPage="Строк на странице"
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
                            page={table.page}
                            backIconButtonProps={{
                                'aria-label': 'Пред. страница',
                            }}
                            nextIconButtonProps={{
                                'aria-label': 'След. страница',
                            }}
                            onPageChange={(event, page) => {
                                dispatch({ type: SET_PAGE, page });
                            }}
                            onRowsPerPageChange={event => {
                                dispatch({ type: SET_ROWS_PER_PAGE, rowsPerPage: event.target.value });

                            }}
                        />
                    }
                </TableContext>
            </Paper>
            <Menu
                anchorReference="anchorPosition"
                anchorPosition={
                    contextOptions !== null
                        ? { top: contextOptions.position.y, left: contextOptions.position.x }
                        : undefined
                }
                open={contextOptions !== null}
                onClose={() => setContextOptions(null)}
                disableAutoFocus
                disableAutoFocusItem
                transitionDuration={0}
            >
                {
                    contextOptions && contextOptions.context.map((o, i) => <MenuItem
                        key={"cm-" + i}
                        onClick={() => {
                            if (o.prevContext) {
                                setContextOptions({ ...contextOptions, context: o.prevContext });
                            } else if (o.options) {
                                setContextOptions({ ...contextOptions, context: [...o.options, { name: "<", prevContext: contextOptions.context }] });
                            } else {
                                setContextOptions(null);
                                o.action(contextOptions.id, contextOptions.row);
                            }
                        }}
                    >
                        {o.name}
                    </MenuItem>)
                }
            </Menu>
        </>
    );
})

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

export default NerisTable;

const contextShape = {
    name: PropTypes.any,
    action: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.object)
}

NerisTable.propTypes = {
    showLoader: PropTypes.func,
    stopLoader: PropTypes.func,
    onSearchChanged: PropTypes.func,
    onFilterChanged: PropTypes.func,
    onDownload: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    onSortingChanged: PropTypes.func,
    data: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    downloadName: PropTypes.string,
    filterList: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
    search: PropTypes.string,
    title: PropTypes.string,
    mimeType: PropTypes.string,
    searchTooltip: PropTypes.string,
    filterTooltip: PropTypes.string,
    resetSearchTooltip: PropTypes.string,
    downloadTooltip: PropTypes.string,
    viewColumnTooltip: PropTypes.string,
    showColNums: PropTypes.bool,
    stickyHeader: PropTypes.bool,
    disablePaging: PropTypes.bool,
    showRowNums: PropTypes.bool,
    multiFilter: PropTypes.bool,
    disableSearch: PropTypes.bool,
    downloadWithFilters: PropTypes.bool,
    disableToken: PropTypes.bool,
    overflow: PropTypes.bool,
    sort: PropTypes.arrayOf(PropTypes.shape({
        columnn: PropTypes.string,
        dir: PropTypes.string
    })),
    rowCount: PropTypes.number,
    filters: PropTypes.arrayOf(PropTypes.shape({
        columnn: PropTypes.string,
        value: PropTypes.arrayOf(PropTypes.string),
        inToolbar: PropTypes.bool,
    })),
    columns: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        label: PropTypes.string,
        options: PropTypes.shape({
            display: PropTypes.bool,
            type: PropTypes.oneOf(['array']),
            filterType: PropTypes.oneOf(['and', 'or']),
            sort: PropTypes.bool,
            trasformData: PropTypes.func,
            customHeadRender: PropTypes.func,
            customBodyRender: PropTypes.func,
            tdStyle: PropTypes.object
        })
    })),
    context: PropTypes.arrayOf(PropTypes.shape(contextShape)),
    stripedRows: PropTypes.bool,
    tooltipElement: PropTypes.instanceOf(React.Component),
    detailRow: PropTypes.oneOfType([PropTypes.bool, PropTypes.instanceOf(React.Component)]),
    childField: PropTypes.string,
    enableColumnsHide: PropTypes.bool
};