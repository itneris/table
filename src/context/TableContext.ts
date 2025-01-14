import React, { useContext } from "react";
import { ITableContext } from "./ITableContext";
import once from "../utils/once";

export const createTableContext = once(<T,>() => React.createContext({} as ITableContext<T>));
export const useTableContext = <T,>() => useContext(createTableContext<T>());