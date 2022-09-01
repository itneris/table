import { TableRow } from '@mui/material';
import React, { useContext, useMemo } from 'react';
import { ITableContext } from '../props/ITableContext';
import ItnHeadCell from './ItnHeadCell';
import { TableContext } from './Table';

function ItnTableHeader<T>() {
    const tableCtxBase = useContext(TableContext)!;
    const tableCtx = tableCtxBase as ITableContext<T>;

    const displayColumns = useMemo(() => tableCtx.columns.filter(c => c.display && !c.systemHide), [tableCtx.columns])

    return (
        <TableRow>
            {
                displayColumns.map((c, i) => <ItnHeadCell key={"hd2" + i} column={c} />)
            }
        </TableRow>
    );
}

export default ItnTableHeader;