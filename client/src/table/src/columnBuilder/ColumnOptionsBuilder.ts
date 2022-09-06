import { ColumnDescription } from "../base/ColumnDescription";
import { LooseObject } from "../base/LooseObject";
import { IColumnBuilder, IColumnBuilderInitial } from "./Syntax";

export class ColumnOptionsBuilder<T extends LooseObject> implements IColumnBuilderInitial<T>
{
	private _column: ColumnDescription;

	constructor(column: ColumnDescription) {
		this._column = column
	}

	SetColumnProp(name: string, value: any): IColumnBuilder<T>
	{
		(this._column as LooseObject)[name] = value;
		return this;
	}
}