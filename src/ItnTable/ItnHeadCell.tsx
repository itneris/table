import { HelpOutline } from '@mui/icons-material';
import { Badge, TableCell, TableSortLabel, Tooltip } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { ColumnSettings } from '../types/ColumnProps';
import { SortProperties } from '../props/SortProperties';
import { useTableContext } from '../context/TableContext';
import { useTableStateContext } from '../context/TableStateContext';

function ItnHeadCell<T>(props: { column: ColumnSettings<T> }) {
    const tableCtx = useTableContext<T>();
    const tableState = useTableStateContext<T>();

    const { column } = props;

    const sortIndex = useMemo(() => {
        return column.disableSorting ? -1 : 
            (tableState.sorting ?? [])
                .map(_ => _.column)
                .indexOf(column.name);
    }, [tableState.sorting, column]);

    const currentSorting = useMemo(() => {
        return (tableState.sorting ?? [])
            .find(_ => _.column === column.name);
    }, [tableState.sorting, column.name]);

    const columnRender = useMemo(() => {
        return column.label;
    }, [column]);

    const sortByColumn = useCallback(() => {
        let sort = [...(tableState.sorting ?? [])];
        let sortState = {
            column: column.name,
            ascending: sortIndex === -1 || currentSorting?.ascending === false
        } as SortProperties;

        if (!tableCtx.ctrlIsClicked) {
            sort = [sortState];
        } else if (sortIndex === -1) {
            sort.push(sortState);
        } else {
            sort = sort.map(s => s.column === column.label ? sortState : s);
        }

        tableState.onStateChanged(old => ({ ...old, sorting: sort }));
    }, [tableState.sorting, tableState.onStateChanged, tableCtx.ctrlIsClicked, sortIndex, currentSorting]);

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
                invisible={(tableState.sorting ?? []).length < 2 || sortIndex === -1 || column.disableSorting}
            >
                <TableSortLabel
                    active={!!currentSorting}
                    direction={currentSorting?.ascending ? "asc" : "desc"}
                    onClick={sortByColumn}
                    hidden={column.disableSorting}
                    disabled={column.disableSorting}
                >
                    {columnRender}
                    {
                        column.tooltip &&
                        <Tooltip
                            title={column.tooltip}
                        >
                            <HelpOutline
                                sx={(theme) => ({
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