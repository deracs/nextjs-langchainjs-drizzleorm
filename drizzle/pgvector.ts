import util from "util"
import {
  AnyColumn,
  Assume,
  ColumnBaseConfig,
  ColumnBuilderConfig,
  ColumnConfig,
  ColumnHKTBase,
  sql,
} from "drizzle-orm"
import {
  AnyPgTable,
  PgColumn,
  PgColumnBuilder,
  PgColumnBuilderHKT,
  PgColumnHKT,
} from "drizzle-orm/pg-core"

// TODO: https://github.com/drizzle-team/drizzle-orm/blob/1f8ff173a08b562cc64e41970c55f0dba0ac56f6/drizzle-orm/src/column.ts#L97
export class PgVectorBuilder<
  TData extends string = string
> extends PgColumnBuilder<
  PgColumnBuilderHKT,
  ColumnBuilderConfig<{
    data: TData
    driverParam: string
  }>
> {
  constructor(name: string, dimensions: number | undefined) {
    super(name)
    this.config.dimensions = dimensions
  }

  build<TTableName extends string>(
    table: AnyPgTable<{ name: TTableName }>
  ): PgVector<TTableName, TData> {
    return new PgVector(table, this.config)
  }
}

class PgVector<
  TTableName extends string,
  TData extends string
> extends PgColumn<
  PgColumnHKT,
  ColumnConfig<{ tableName: TTableName; data: TData; driverParam: string }>
> {
  dimensions: number | undefined

  constructor(
    table: AnyPgTable<{ name: TTableName }>,
    builder: PgVectorBuilder<TData>["config"]
  ) {
    super(table, builder)
    this.dimensions = builder.dimensions
  }

  getSQLType(): string {
    const dimensions = this.dimensions
    if (dimensions === undefined) {
      return "vector"
    }
    return util.format("vector(%d)", dimensions)
  }

  override mapFromDriverValue(value: TData | string): TData {
    return fromSql(value)
  }

  override mapToDriverValue(value: TData): string {
    return toSql(value)
  }
}

export function vector<T extends string = string>(
  name: string,
  config: { dimensions: number | undefined }
): PgVectorBuilder<T> {
  return new PgVectorBuilder(name, config && config.dimensions)
}

export function l2Distance(column: any, value: any): any {
  return sql`${column} <-> ${toSql(value)}`
}

export function maxInnerProduct(column: any, value: any): any {
  return sql`${column} <#> ${toSql(value)}`
}

export function cosineDistance(column: any, value: any): any {
  return sql`${column} <=> ${toSql(value)}`
}

function fromSql(value: any) {
  return value
    .substring(1, value.length - 1)
    .split(",")
    .map((v: string) => parseFloat(v))
}

function toSql(value: any) {
  return JSON.stringify(value)
}
