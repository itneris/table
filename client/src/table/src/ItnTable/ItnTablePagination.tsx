import { TablePagination } from '@mui/material';
import React, { useCallback } from 'react';
import { SET_PAGE, SET_ROWS_PER_PAGE } from './tableReducer';
import { useTableContext } from '../context/TableContext';
import saveState from '../utils/saveState';

function ItnTablePagination<T>() {
    const tableCtx = useTableContext<T>();

    const hanlePageChange = useCallback((page: number) => {
        tableCtx.dispatch({ type: SET_PAGE, page });
        saveState(tableCtx.saveState, (state) => {
            state.page = page;
            return state;
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const hanlePageSizeChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const pageSize = parseInt(event.target.value, 10);
        tableCtx.dispatch({ type: SET_ROWS_PER_PAGE, pageSize });
        saveState(tableCtx.saveState, (state) => {
            state.pageSize = pageSize;
            return state;
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <TablePagination
            component="div"
            count={tableCtx.total}
            rowsPerPageOptions={tableCtx.pageSizeOptions}
            rowsPerPage={tableCtx.pageSize}
            labelRowsPerPage={tableCtx.pageSizeOptionsText}
            labelDisplayedRows={tableCtx.pageLabelText}
            page={tableCtx.page}
            slotProps={{
                actions: {
                    nextButton: { 'aria-label': tableCtx.nextPageText },
                    previousButton: { 'aria-label': tableCtx.prevPageText }
                }
            }}
            onPageChange={(event, page) => hanlePageChange(page)}
            onRowsPerPageChange={hanlePageSizeChange}
        />
    );
}

export default ItnTablePagination;