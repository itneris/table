import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Box, IconButton, TextField, Tooltip } from "@mui/material";
import { Clear, Search } from '@mui/icons-material';
import { useTableContext } from '../context/TableContext';
import { ItnTableGlobalContext } from '../providers/ItnTableProvider';
import { useTableStateContext } from '../context/TableStateContext';

const SEARCH_TIMEOUT = 400;

function TableSearchInner<T>(props: { setShowSearch: (show: boolean) => void }, ref: React.Ref<HTMLDivElement>) {
    let timer = useRef<NodeJS.Timeout | null>(null);

    const tableCtx = useTableContext<T>();
    const tableState = useTableStateContext<T>();
    const { locale } = useContext(ItnTableGlobalContext);

    const { setShowSearch } = props;

    const [currentSearch, setCurrentSearch] = useState<string>("");

    useEffect(() => {
        setCurrentSearch(tableState.searching);
    }, [tableState.searching]);

    const resetSearch = useCallback(() => {
        setShowSearch(tableCtx.title === null);
        tableState.onStateChanged(old => ({ ...old, searching: "", page: 0 }));
    }, [setShowSearch, tableState.onStateChanged]); 

    const handleSearchKeyUp = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "onSearchingChange") {
            resetSearch();
        }
    }, [resetSearch]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const searchVal = e.currentTarget.value;
        setCurrentSearch(searchVal);
        if (timer.current) {
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
            tableState.onStateChanged(old => ({ ...old, searching: searchVal, page: 0 }));
        }, SEARCH_TIMEOUT);        
    }, [tableState.onStateChanged]);

    return (       
        <Box display="flex" alignItems='center'>
            <TextField
                variant="standard"
                ref={ref}
                value={currentSearch}
                onKeyUp={handleSearchKeyUp}
                onChange={handleSearchChange}
                slotProps={{
                    input: {
                        startAdornment: <Search sx={{ opacity: 0.54, mr: 2 }} />
                    }
                }}
                size="small"
                autoComplete="off"
                name="t-search"
                //TODO ADD SEARCH INPUT PROPS
                //{...props.searchProps}
            />
            {
                tableCtx.title &&
                <Tooltip title={locale.search.resetText}>
                    <IconButton onClick={() => resetSearch()}>
                        <Clear />
                    </IconButton>
                </Tooltip>
            }
        </Box>
    );
};

const TableSearch = React.forwardRef(TableSearchInner);
export default TableSearch;