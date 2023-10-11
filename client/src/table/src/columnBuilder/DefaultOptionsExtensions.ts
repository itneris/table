import { LooseObject } from "../base/LooseObject";
import { ColumnFilteringProperties } from "../props/ColumnFilteringProperties";
import { ColumnOptionsBuilder } from "./ColumnOptionsBuilder";

declare module "./ColumnOptionsBuilder" {
	interface ColumnOptionsBuilder<T extends LooseObject> {
		/**
		 * Defines a display name for current column and bold higlight.
		 * @param {string} displayName
		 * @param {bool} bold default false
		 * */
		WithName(displayName: string, bold?: boolean): ColumnOptionsBuilder<T>;
		/**
		 * Defines date column format
		 * @param {string} dateFormat
		 * */
		WithDateFormat(dateFormat: string): ColumnOptionsBuilder<T>;
		/**
		 * Defines custom body rendered for column
		 * @param {(any, T) => React.ReactNode} renderer
		 * */
		WithBodyRenderer(renderer: (value: any, row: T) => React.ReactNode): ColumnOptionsBuilder<T>;
		/**
		 * Set default sort for the column
		 * @param {boolean} ascending sort should be ascending
		 * @param {number} order order of column in multisort
		 * */
		WithDefaultSort(ascending?: boolean, order?: number): ColumnOptionsBuilder<T>;
		/**
		 * Replaces null value for column
		 * @param {string} value string to render insted of null or empty valye
		 * */
		WithNullValue(value: string): ColumnOptionsBuilder<T>;
		/**
		 * Define percent width for column for strict table layout
		 * @param {number} width width in pecent
		 * */
		WithWidth(width: number): ColumnOptionsBuilder<T>;
		/**
		 * Sets the default fitlering for the column
		 * @param {ColumnFilteringProperties} filtering filter for column
		 * */
		WithDefaultFilters(filtering: ColumnFilteringProperties): ColumnOptionsBuilder<T>;
		/**
		 * Renders DateTime column with time
		 * */
		WithTime(): ColumnOptionsBuilder<T>;
		/**
		 * Disables sort for the column
		 * */
		DisableSort(): ColumnOptionsBuilder<T>;
		/**
		 * Hides column for display
		 * @param {boolean} hidden is column hidden, default true
		 * */
		Hide(hidden?: boolean): ColumnOptionsBuilder<T>;
		/**
		 * With tooltip
		 * @param {string} text tooltip label
		 * */
		WithTooltip(text: string): ColumnOptionsBuilder<T>;
	}
}

ColumnOptionsBuilder.prototype.WithTooltip = function <T extends LooseObject>(text: string) {
	return this
		.SetColumnProp("tooltip", text) as ColumnOptionsBuilder<T>;
}

ColumnOptionsBuilder.prototype.WithName = function<T extends LooseObject>(displayName: string, bold: boolean = false) {
	return this
		.SetColumnProp("displayName", displayName)
		.SetColumnProp("bold", bold) as ColumnOptionsBuilder<T>;
}

ColumnOptionsBuilder.prototype.WithDateFormat = function<T extends LooseObject>(dateFormat: string) {
	return this
		.SetColumnProp("dateFormat", dateFormat) as ColumnOptionsBuilder<T>;
}

ColumnOptionsBuilder.prototype.WithBodyRenderer = function<T extends LooseObject>(renderer: (value: any, row: T) => React.ReactNode) {
	return this
		.SetColumnProp("bodyRenderer", renderer) as ColumnOptionsBuilder<T>;
}

ColumnOptionsBuilder.prototype.WithTime = function <T extends LooseObject>() {
	return this
		.SetColumnProp("dateWithTime", true) as ColumnOptionsBuilder<T>;
}

ColumnOptionsBuilder.prototype.WithDefaultSort = function <T extends LooseObject>(ascending: boolean = true, order: number = 1) {
	return this
		.SetColumnProp("sortOrder", order)
		.SetColumnProp("sortAscending", ascending) as ColumnOptionsBuilder<T>;
}


ColumnOptionsBuilder.prototype.DisableSort = function <T extends LooseObject>() {
	return this
		.SetColumnProp("disableSort", true) as ColumnOptionsBuilder<T>;
}


ColumnOptionsBuilder.prototype.Hide = function <T extends LooseObject>(hidden: boolean = true) {
	return this
		.SetColumnProp("display", !hidden) as ColumnOptionsBuilder<T>;
}


ColumnOptionsBuilder.prototype.WithNullValue = function <T extends LooseObject>(value: string) {
	return this
		.SetColumnProp("nullValue", false) as ColumnOptionsBuilder<T>;
}

ColumnOptionsBuilder.prototype.WithWidth = function <T extends LooseObject>(width: number) {
	return this
		.SetColumnProp("width", width) as ColumnOptionsBuilder<T>;
}

ColumnOptionsBuilder.prototype.WithDefaultFilters = function <T extends LooseObject>(filtering: ColumnFilteringProperties) {
	return this
		.SetColumnProp("filtering", filtering) as ColumnOptionsBuilder<T>;
}