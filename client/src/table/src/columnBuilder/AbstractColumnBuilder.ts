import { ColumnDescription } from "../base/ColumnDescription";
import { ColumnOptionsBuilder } from "./ColumnOptionsBuilder";

export abstract class AbstractColumnBuilder<T> {
	private _columns: Array<ColumnDescription<T>> = [];

	public ColumnFor(model: string | ((type: T) => any)): ColumnOptionsBuilder<T> {
		const key = typeof model === "string" ?
			model :
			model.toString().split(".")[1]
				.replace("}", "")
				.replace("\n", "")
				.replace("\r", "")
				.replace(";", "")
				.replace(/\s/g, "");
		const column = new ColumnDescription();
		column.order = this._columns.length;
		column.property = key;
		this._columns.push(column);
		return new ColumnOptionsBuilder<T>(column);
	}  

	public Build(): Array<ColumnDescription<T>> 
	{
		return this._columns;
	}
}