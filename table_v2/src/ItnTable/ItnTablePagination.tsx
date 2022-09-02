import { TablePagination } from '@mui/material';
import React, { useCallback, useContext } from 'react';
import { TableContext } from './Table';
import { SET_PAGE, SET_ROWS_PER_PAGE } from './tableReducer';

function ItnTablePagination(props: { total: number }) {
    const tableCtx = useContext(TableContext)!;

    //TODO RowsPerPageOptions
    //TODO Русские текстовки
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
            rowsPerPageOptions={/*rowsPerPageOptions || */[10, 25, 50, 100]}
            rowsPerPage={tableCtx.pageSize}
            labelRowsPerPage="Строк на странице"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
            page={tableCtx.page}
            backIconButtonProps={{ 'aria-label': 'Пред. страница' }}
            nextIconButtonProps={{ 'aria-label': 'След. страница' }}
            onPageChange={(event, page) => hanlePageChange(page)}
            onRowsPerPageChange={hanlePageSizeChange}
        />
    );
}

export default ItnTablePagination;