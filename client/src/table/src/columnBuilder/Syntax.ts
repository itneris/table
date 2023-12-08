import { ColumnDescription } from "../base/ColumnDescription";

export interface IColumnBuilderInitial<T> extends IColumnBuilder<T> {

}

export interface IColumnBuilder<T> {
    SetColumnProp(name: keyof ColumnDescription<T>, value: any): IColumnBuilder<T>;
}