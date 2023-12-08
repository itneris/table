import React, { useContext } from "react";
import { ITableContext } from "./ITableContext";

function once<TFunction extends (...args: any[]) => any>(fn: TFunction): TFunction {
    let haveResult = false;
    let result: any = null;

    return (function (this: any, ...args: any[]) {
        if (!haveResult) {
            haveResult = true;
            result = fn.apply(this, args);
        }

        return result;
    }) as any;
}

export const createTableContext = once(<T,>() => React.createContext({} as ITableContext<T>));
export const useTableContext = <T,>() => useContext(createTableContext<T>());