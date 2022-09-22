import { ColumnDescription } from "../base/ColumnDescription";
import { LooseObject } from "../base/LooseObject";
import { ColumnOptionsBuilder } from "./ColumnOptionsBuilder";

export abstract class AbstractColumnBuilder<T extends LooseObject> {
	private _columns: Array<ColumnDescription> = [];

	public ColumnFor(model: (type: T) => any): ColumnOptionsBuilder<T> {
		const key = model.toString().split(".")[1]
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

	public Build(): Array<ColumnDescription> 
	{
		return this._columns;
	}
}