import { ColumnDescription } from "../base/ColumnDescription";
import { LooseObject } from "../base/LooseObject";
import { IColumnBuilder, IColumnBuilderInitial } from "./Syntax";

export class ColumnOptionsBuilder<T, TProperty> implements IColumnBuilderInitial<T,TProperty>
{
	private _column: ColumnDescription<T>;

	constructor(column: ColumnDescription<T>) {
		this._column = column
	}

	SetColumnProp(name: string, value: any): IColumnBuilder<T, TProperty> 
	{
		(this._column as LooseObject)[name] = value;
		return this;
	}
}