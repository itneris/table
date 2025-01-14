import { ReactNode, createContext, useCallback, useMemo, useState } from "react";
import { ColumnSettings } from "src/types/ColumnProps";

export type TableColumnsContextType<T> = {
    columnsSettings: ColumnSettings<T>[],
    registerColumn: (column: ColumnSettings<T>) => void,
    changeVisibility: (name: string, display: boolean) => void
}

export const TableColumnsContext = createContext<TableColumnsContextType<unknown>>({
    columnsSettings: [],
    registerColumn: () => {},
    changeVisibility: () => {}
});

const TableColumnsProvider = (props: { children: ReactNode}) => {
    const { children } = props;

    const [columnsSettings, setColumnsSettings] = useState<ColumnSettings<unknown>[]>([]);


    const registerColumn = useCallback((column: ColumnSettings<unknown>) => {
        setColumnsSettings(prev => {
            if (prev.find(p => p.name === column.name)) {
                return prev;
            }
            
            return  [...prev, column];
        });
    }, []);

    const changeVisibility = useCallback((name: string, display: boolean) => {
        setColumnsSettings(prev => prev.map(column => {
            if (column.name === name) {
                return {
                    ...column,
                    display
                };
            }

            return column;
        }));
    }, []);

    const contextValue = useMemo(() => {
        return {
            columnsSettings,
            registerColumn,
            changeVisibility
        };
    }, [columnsSettings, registerColumn, changeVisibility]);

    return (
        <TableColumnsContext.Provider 
            value={contextValue}
        >
            {children}
        </TableColumnsContext.Provider>
    );
};

export default TableColumnsProvider;