import React, {  useContext, useRef, useState } from 'react';
import { Box, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { useTableContext } from '../context/TableContext';
import { Search } from '@mui/icons-material';
import TableSearch from './TableSearch';
import TablePanelFilterValue from './TablePanelFilterValue';
import TableColumnsHide from './TableColumnsHide';
import TableFilters from './TableFilters';
import { ItnTableGlobalContext } from '../providers/ItnTableProvider';
import { useTableStateContext } from '../context/TableStateContext';

const TableToolbar = <T,>() => {
    const searchInputRef = useRef<HTMLDivElement>(null);

    const tableCtx = useTableContext<T>();
    const tableState = useTableStateContext<T>();
    const { locale } = useContext(ItnTableGlobalContext);

    const [showSearch, setShowSearch] = useState<boolean>(tableCtx.title != null ? tableState.searching !== "" : true);

    return (
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {
                //Depend on settings show title or search input. Or if any filters just filter panel
                !showSearch &&
                <Typography variant="h6">
                    {tableCtx.title}
                </Typography>
            }
            {
                (showSearch && !tableCtx.disableSearch) &&
                <TableSearch setShowSearch={setShowSearch} ref={searchInputRef} />   
            }
            {
                (showSearch && tableCtx.disableSearch && tableCtx.filters.length === 0) &&
                <Box />
            }
            {
                //Show panel with current filtering
                (!tableCtx.title && tableCtx.disableSearch && (tableState.filtering ?? []).length > 0) &&
                    <Box display="flex" flexWrap="wrap">
                        {
                            (tableState.filtering ?? []).map(f => <TablePanelFilterValue key={"col-" + f.column} filter={f} />)
                        }
                    </Box>
            }
            <Box display="flex">
                {tableCtx.toolbarAdornment}
                {
                    (!tableCtx.disableSearch && tableCtx.title) &&
                    <Tooltip title={locale.search.searchText}>
                        <IconButton onClick={() => { setShowSearch(true); searchInputRef.current?.focus() }}>
                            <Search color={showSearch ? "primary" : undefined} />
                        </IconButton>
                    </Tooltip>
                }
                {
                    tableCtx.enableHideColumns &&
                    <TableColumnsHide />
                }
                {
                    tableCtx.filters.filter(f => !f.inToolbar).length > 0 &&
                    <TableFilters />
                }
            </Box>
        </Toolbar> 
    );
};

export default TableToolbar;