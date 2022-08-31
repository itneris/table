import { ColumnOptionsBuilder } from "./ColumnOptionsBuilder";
import { IColumnBuilder } from "./Syntax";

declare module "./ColumnOptionsBuilder" {
	interface ColumnOptionsBuilder<T, TProperty> {
		WithName(displayName: string, bold: boolean): IColumnBuilder<T, TProperty>;
		WithDateFormat(dateFormat: string): IColumnBuilder<T, TProperty>;
	}
}

/**
 * Defines a display name for current column and bold higlight.
 * @param {string} displayName
 * @param {bool} bold default false
 * */
ColumnOptionsBuilder.prototype.WithName = function (displayName: string, bold: boolean = false) {
	return this
		.SetColumnProp("displayName", displayName)
		.SetColumnProp("bold", bold);
}

/**
 * Defines date column format
 * @param {string} dateFormat
 * */
ColumnOptionsBuilder.prototype.WithDateFormat = function (dateFormat: string) {
	return this
		.SetColumnProp("displayName", dateFormat);
}


/*

	/// <summary>
	/// Defines date column format
	/// </summary>
	/// <typeparam name="T">Type of object being validated</typeparam>
	/// <typeparam name="TProperty">Type of property being validated</typeparam>
	/// <param name="columnBuilder">The column builder on which the rule should be defined</param>
	/// <returns></returns>
	public static IColumnBuilder<T, TProperty> WithDateFormat<T, TProperty>(this IColumnBuilder<T, TProperty> columnBuilder, string dateFormat)
	{
		return columnBuilder.SetColumnProp("DateFormat", dateFormat);
	}

	/// <summary>
	/// Defines need time for date column
	/// </summary>
	/// <typeparam name="T">Type of object being validated</typeparam>
	/// <typeparam name="TProperty">Type of property being validated</typeparam>
	/// <param name="columnBuilder">The column builder on which the rule should be defined</param>
	/// <returns></returns>
	public static IColumnBuilder<T, TProperty> WithDateTime<T, TProperty>(this IColumnBuilder<T, TProperty> columnBuilder)
	{
		return columnBuilder.SetColumnProp("DateWithTime", true);
	}

	/// <summary>
	/// Defines initial sort for column
	/// </summary>
	/// <typeparam name="T">Type of object being validated</typeparam>
	/// <typeparam name="TProperty">Type of property being validated</typeparam>
	/// <param name="columnBuilder">The column builder on which the rule should be defined</param>
	/// <returns></returns>
	public static IColumnBuilder<T, TProperty> WithDefaultSort<T, TProperty>(this IColumnBuilder<T, TProperty> columnBuilder, bool ascending = true, int order = 1)
	{
		return columnBuilder
			.SetColumnProp("SortOrder", order)
			.SetColumnProp("SortAscending", ascending);
	}

	/// <summary>
	/// Defines custom body render for column
	/// </summary>
	/// <typeparam name="T">Type of object being validated</typeparam>
	/// <typeparam name="TProperty">Type of property being validated</typeparam>
	/// <param name="columnBuilder">The column builder on which the rule should be defined</param>
	/// <returns></returns>
	public static IColumnBuilder<T, TProperty> WithBodyRenderer<T, TProperty>(this IColumnBuilder<T, TProperty> columnBuilder, Func<object, T, RenderFragment> renderer)
	{
		return columnBuilder.SetColumnProp("BodyRenderer", renderer);
	}

	/// <summary>
	/// Disables sorting for column
	/// </summary>
	/// <typeparam name="T">Type of object being validated</typeparam>
	/// <typeparam name="TProperty">Type of property being validated</typeparam>
	/// <param name="columnBuilder">The column builder on which the rule should be defined</param>
	/// <returns></returns>
	public static IColumnBuilder<T, TProperty> DisableSort<T, TProperty>(this IColumnBuilder<T, TProperty> columnBuilder)
	{
		return columnBuilder.SetColumnProp("DisableSort", true);
	}

	/// <summary>
	/// Prevent column from display
	/// </summary>
	/// <typeparam name="T">Type of object being validated</typeparam>
	/// <typeparam name="TProperty">Type of property being validated</typeparam>
	/// <param name="columnBuilder">The column builder on which the rule should be defined</param>
	/// <returns></returns>
	public static IColumnBuilder<T, TProperty> Hide<T, TProperty>(this IColumnBuilder<T, TProperty> columnBuilder)
	{
		return columnBuilder.SetColumnProp("Display", false);
	}

	/// <summary>
	/// Replace null value in cell
	/// </summary>
	/// <typeparam name="T">Type of object being validated</typeparam>
	/// <typeparam name="TProperty">Type of property being validated</typeparam>
	/// <param name="columnBuilder">The column builder on which the rule should be defined</param>
	/// <returns></returns>
	public static IColumnBuilder<T, TProperty> WithNullValue<T, TProperty>(this IColumnBuilder<T, TProperty> columnBuilder, string value)
	{
		return columnBuilder.SetColumnProp("NullValue", value);
	}

	/// <summary>
	/// Define percent width for column
	/// </summary>
	/// <typeparam name="T">Type of object being validated</typeparam>
	/// <typeparam name="TProperty">Type of property being validated</typeparam>
	/// <param name="columnBuilder">The column builder on which the rule should be defined</param>
	/// <returns></returns>
	public static IColumnBuilder<T, TProperty> WithWidth<T, TProperty>(this IColumnBuilder<T, TProperty> columnBuilder, int width)
	{
		return columnBuilder.SetColumnProp("Width", width);
	}

	/// <summary>
	/// Set default fitlering for column
	/// </summary>
	/// <typeparam name="T">Type of object being validated</typeparam>
	/// <typeparam name="TProperty">Type of property being validated</typeparam>
	/// <param name="columnBuilder">The column builder on which the rule should be defined</param>
	/// <returns></returns>
	public static IColumnBuilder<T, TProperty> WithDefaultFilters<T, TProperty>(this IColumnBuilder<T, TProperty> columnBuilder, params string?[] filters)
	{
		return columnBuilder.SetColumnProp("Filters", filters);
	}
}*/
