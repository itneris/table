import React, { useContext, useRef, useState } from 'react';
import { Box, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { TableContext } from './Table';
import { Search } from '@mui/icons-material';
import TableSearch from './TableSearch';
import TablePanelFilterValue from './TablePanelFilterValue';
import { IFocusable } from '../base/IFocusable';
import TableColumnsHide from './TableColumnsHide';
import TableFilters from './TableFilters';

const TableToolbar = () => {
    const searchInputRef = useRef<IFocusable|null>(null);
    const tableCtx = useContext(TableContext)!;
    const [showSearch, setShowSearch] = useState<boolean>(tableCtx.title != null ? tableCtx.searching !== "" : true);

    return (
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {
                //Depend on settings show title or search input. Or if any filters just filter panel
                !showSearch ?
                    <Typography variant="h6">
                        {tableCtx.title}
                    </Typography> :
                    !tableCtx.disableSearch ?
                        <TableSearch setShowSearch={setShowSearch} ref={searchInputRef} /> :
                        tableCtx.filters.length ?
                            null :
                            <div></div>
            }
            {
                //Show panel with current filtering
                (!tableCtx.title && tableCtx.disableSearch && (tableCtx.filtering ?? []).length > 0) &&
                    <Box display="flex" flexWrap="wrap">
                        {
                            (tableCtx.filtering ?? []).map(f => <TablePanelFilterValue key={"col-" + f.column} filter={f} />)
                        }
                    </Box>
            }
            <Box display="flex">
                {tableCtx.toolbarAdornment}
                {
                    (!tableCtx.disableSearch && tableCtx.title) &&
                    <Tooltip title={tableCtx.searchTooltipText}>
                        <IconButton onClick={() => { setShowSearch(true); searchInputRef.current?.focus() }}>
                            <Search color={showSearch ? "primary" : undefined} />
                        </IconButton>
                    </Tooltip>
                }
                {/*TODO DOWNLOAD BUTTON*/ }
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