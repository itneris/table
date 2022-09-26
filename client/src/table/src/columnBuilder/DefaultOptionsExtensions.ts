import { LooseObject } from "../base/LooseObject";
import { ColumnOptionsBuilder } from "./ColumnOptionsBuilder";

declare module "./ColumnOptionsBuilder" {
	interface ColumnOptionsBuilder<T extends LooseObject> {
		WithName(displayName: string, bold?: boolean): ColumnOptionsBuilder<T>;
		WithDateFormat(dateFormat: string): ColumnOptionsBuilder<T>;
		WithBodyRenderer(renderer: (value: any, row: T) => React.ReactNode): ColumnOptionsBuilder<T>;
		WithDefaultSort(ascending?: boolean, order?: number): ColumnOptionsBuilder<T>;
		WithNullValue(value: string): ColumnOptionsBuilder<T>;
		WithWidth(width: number): ColumnOptionsBuilder<T>;
		WithDefaultFilters(filtrs: string[]): ColumnOptionsBuilder<T>;
		WithTime(): ColumnOptionsBuilder<T>;
		DisableSort(): ColumnOptionsBuilder<T>;
		Hide(hidden?: boolean): ColumnOptionsBuilder<T>;
	}
}

/**
 * Defines a display name for current column and bold higlight.
 * @param {string} displayName
 * @param {bool} bold default false
 * */
ColumnOptionsBuilder.prototype.WithName = function<T extends LooseObject>(displayName: string, bold: boolean = false) {
	return this
		.SetColumnProp("displayName", displayName)
		.SetColumnProp("bold", bold) as ColumnOptionsBuilder<T>;
}

/**
 * Defines date column format
 * @param {string} dateFormat
 * */
ColumnOptionsBuilder.prototype.WithDateFormat = function<T extends LooseObject>(dateFormat: string) {
	return this
		.SetColumnProp("dateFormat", dateFormat) as ColumnOptionsBuilder<T>;
}

/**
 * Defines custom body rendered for column
 * @param {(any, T) => React.ReactNode} renderer
 * */
ColumnOptionsBuilder.prototype.WithBodyRenderer = function<T extends LooseObject>(renderer: (value: any, row: T) => React.ReactNode) {
	return this
		.SetColumnProp("bodyRenderer", renderer) as ColumnOptionsBuilder<T>;
}

/**
 * Renders DateTime column width time
 * */
ColumnOptionsBuilder.prototype.WithTime = function <T extends LooseObject>() {
	return this
		.SetColumnProp("dateWithTime", true) as ColumnOptionsBuilder<T>;
}

/**
 * Renders DateTime column width time
 * * */
ColumnOptionsBuilder.prototype.WithTime = function <T extends LooseObject>() {
	return this
		.SetColumnProp("dateWithTime", true) as ColumnOptionsBuilder<T>;
}

/**
 * Set default sort for the column
 * @param {boolean} ascending sort should be ascending
 * @param {number} order order of column in multisort
 * */
ColumnOptionsBuilder.prototype.WithDefaultSort = function <T extends LooseObject>(ascending: boolean = true, order: number = 1) {
	return this
		.SetColumnProp("sortOrder", order)
		.SetColumnProp("sortAscending", ascending) as ColumnOptionsBuilder<T>;
}

/**
 * Disables sort for the column
 * */
ColumnOptionsBuilder.prototype.DisableSort = function <T extends LooseObject>() {
	return this
		.SetColumnProp("disableSort", true) as ColumnOptionsBuilder<T>;
}

/**
 * Hides column for display
 * @param {boolean} hidden is column hidden, default true
 * */
ColumnOptionsBuilder.prototype.Hide = function <T extends LooseObject>(hidden: boolean = true) {
	return this
		.SetColumnProp("display", !hidden) as ColumnOptionsBuilder<T>;
}

/**
 * Replaces null value for column
 * @param {string} value string to render insted of null or empty valye
 * */
ColumnOptionsBuilder.prototype.WithNullValue = function <T extends LooseObject>(value: string) {
	return this
		.SetColumnProp("nullValue", false) as ColumnOptionsBuilder<T>;
}

/**
 * Define percent width for column for strict table layout
 * @param {number} width width in pecent
 * */
ColumnOptionsBuilder.prototype.WithWidth = function <T extends LooseObject>(width: number) {
	return this
		.SetColumnProp("width", width) as ColumnOptionsBuilder<T>;
}

/**
 * Sets the default fitlering for the column
 * @param {string[]} filters array of values in default filtering
 * */
ColumnOptionsBuilder.prototype.WithDefaultFilters = function <T extends LooseObject>(filters: string[]) {
	return this
		.SetColumnProp("filters", filters) as ColumnOptionsBuilder<T>;
}