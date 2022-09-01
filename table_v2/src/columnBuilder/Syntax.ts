import { LooseObject } from "../base/LooseObject";

export interface IColumnBuilderInitial<T extends LooseObject> extends IColumnBuilder<T> {

}

export interface IColumnBuilder<T extends LooseObject> {
    SetColumnProp(name: string, value: any): IColumnBuilder<T>;
}