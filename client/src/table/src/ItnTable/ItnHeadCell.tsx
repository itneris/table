import { HelpOutline } from '@mui/icons-material';
import { Badge, TableCell, TableSortLabel, Tooltip } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { ColumnDescription } from '../base/ColumnDescription';
import { SortProperties } from '../props/SortProperties';
import { SET_SORT } from './tableReducer';
import { useTableContext } from '../context/TableContext';
import saveState from '../utils/saveState';

function ItnHeadCell<T>(props: { column: ColumnDescription<T> }) {
    const tableCtx = useTableContext<T>();

    const sortIndex = useMemo(() => {
        return (tableCtx.sorting ?? []).map(_ => _.column).indexOf(props.column.property);
    }, [tableCtx.sorting]); // eslint-disable-line react-hooks/exhaustive-deps

    const currentSorting = useMemo(() => {
        return (tableCtx.sorting ?? []).find(_ => _.column === props.column.property) ?? null;
    }, [tableCtx.sorting]) // eslint-disable-line react-hooks/exhaustive-deps

    const columnRender = useMemo(() => {
        return props.column.displayName;
    }, [props.column]);

    const sortByColumn = useCallback(() => {
        let sort = [...(tableCtx.sorting ?? [])];
        let sortState = {
            column: props.column.property,
            ascending: sortIndex === -1 || currentSorting?.ascending === false
        } as SortProperties;

        if (!tableCtx.ctrlIsClicked) {
            sort = [sortState];
        } else if (sortIndex === -1) {
            sort.push(sortState);
        } else {
            sort = sort.map(s => s.column === props.column.property ? sortState : s);
        }

        tableCtx.dispatch({ type: SET_SORT, sorting: sort });
        tableCtx.onSortingChange && tableCtx.onSortingChange(sort);
        saveState(tableCtx.saveState, (state) => {
            state.sorting = sort;
            return state;
        });
    }, [tableCtx.sorting, tableCtx.ctrlIsClicked, sortIndex, currentSorting]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <TableCell
            align="left"
            style={{
                //padding: small ? "6px 4px 6px 20px" : "16px 4px 16px 20px",
                //display: (options.section && !sections[options.section].expanded) ? "none" : null,
                //zIndex: 1,
                //...(options.customHeadStyle || {}),
            }}
            //rowSpan={options.rowSpan}
            //colSpan={options.colSpan}
        >
            <Badge
                badgeContent={sortIndex + 1}
                invisible={(tableCtx.sorting ?? []).length < 2 || sortIndex === -1 || props.column.disableSort}
            >
                <TableSortLabel
                    active={currentSorting != null}
                    direction={currentSorting?.ascending ? "asc" : "desc"}
                    onClick={sortByColumn}
                    hidden={props.column.disableSort}
                    disabled={props.column.disableSort}
                >
                    {columnRender}
                    {
                        props.column.tooltip &&
                        <Tooltip
                            title={props.column.tooltip}
                        >
                            <HelpOutline
                                sx={theme => ({
                                    pl: 1,
                                    cursor: "pointer",
                                    color: "gray",
                                    ":hover": {
                                        color: theme.palette.secondary.main
                                    }
                                })}
                            />
                        </Tooltip>
                    }
                </TableSortLabel>
            </Badge>
        </TableCell>
    );
}

export default ItnHeadCell;