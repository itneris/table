import { useContext } from "react";
import { TableColumnsContext, type TableColumnsContextType } from "./TableColumnsProvider";

export default function useColumns<T>() {
    const columns = useContext(TableColumnsContext);
    return columns as TableColumnsContextType<T>;
}