import { TablePagination } from '@mui/material';
import React, { useCallback, useContext } from 'react';
import { TableContext } from './Table';
import { SET_PAGE, SET_ROWS_PER_PAGE } from './tableReducer';

function ItnTablePagination() {
    const tableCtx = useContext(TableContext)!;

    const hanlePageChange = useCallback((page: number) => {
        tableCtx.dispatch({ type: SET_PAGE, page });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const hanlePageSizeChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const pageSize = parseInt(event.target.value, 10);
        tableCtx.dispatch({ type: SET_ROWS_PER_PAGE, pageSize });
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
            backIconButtonProps={{ 'aria-label': tableCtx.prevPageText }}
            nextIconButtonProps={{ 'aria-label': tableCtx.nextPageText }}
            onPageChange={(event, page) => hanlePageChange(page)}
            onRowsPerPageChange={hanlePageSizeChange}
        />
    );
}

export default ItnTablePagination;