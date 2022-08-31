export interface IColumnBuilderInitial<T, out TProperty> extends IColumnBuilder<T, TProperty> {

}

export interface IColumnBuilder<T, out TProperty> {
    SetColumnProp(name: string, value: any): IColumnBuilder<T, TProperty>;
}