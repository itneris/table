import { ColumnDescription } from "../base/ColumnDescription";
import { ColumnOptionsBuilder } from "./ColumnOptionsBuilder";
import { IColumnBuilderInitial } from "./Syntax";

export abstract class AbstractColumnBuilder<T> {
	private _columns: Array<ColumnDescription<T>> = [];

	public ColumnFor<TProperty>(model: () => TProperty): IColumnBuilderInitial<T, TProperty> {
		const key = model.toString().split(".")[1];
		const column: ColumnDescription<T> = new ColumnDescription<T>();
		column.order = this._columns.length;
		column.property = key;
		this._columns.push(column);
		return new ColumnOptionsBuilder<T, TProperty>(column);
	}  

	public Build(): Array<ColumnDescription<T>> 
	{
		return this._columns;
	}
}