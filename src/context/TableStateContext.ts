import React, { useContext } from "react";
import { ITableStateContext } from "./ITableStateContext";
import once from "../utils/once";


export const createTableStateContext = once(<T,>() => React.createContext({} as ITableStateContext<T>));
export const useTableStateContext = <T,>() => useContext(createTableStateContext<T>());