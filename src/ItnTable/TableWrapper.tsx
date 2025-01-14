import { ITableProperties } from '../props/ITableProperties';
import TableColumnsProvider from '../providers/TableColumnsProvider/TableColumnsProvider';
import ItnTable from './Table';

function ItnTableWrapper<T>(props: ITableProperties<T>) {
    return (
        <TableColumnsProvider>
            <ItnTable {...props} />
        </TableColumnsProvider>
    );
};

export default ItnTableWrapper;