import { ColumnDescription } from "../base/ColumnDescription";
import { IColumnBuilder, IColumnBuilderInitial } from "./Syntax";

export class ColumnOptionsBuilder<T> implements IColumnBuilderInitial<T>
{
	private _column: ColumnDescription<T>;

	constructor(column: ColumnDescription<T>) {
		this._column = column
	}

	SetColumnProp(name: keyof ColumnDescription<T>, value: any): IColumnBuilder<T>
	{
		(this._column as any)[name] = value;
		return this;
	}
}