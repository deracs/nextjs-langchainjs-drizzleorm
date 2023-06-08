import util from "util"
import {
  Assume,
  ColumnBaseConfig,
  ColumnBuilderBaseConfig,
  ColumnBuilderHKTBase,
  ColumnHKTBase,
  MakeColumnConfig,
  sql,
} from "drizzle-orm"
import { AnyPgTable, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core"

export interface PgVectorBuilderHKT extends ColumnBuilderHKTBase {
  _type: PgVectorBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>
  _columnHKT: PgVectorHKT
}

export interface PgVectorHKT extends ColumnHKTBase {
  _type: PgVector<Assume<this["config"], ColumnBaseConfig>>
}

export type PgVectorBuilderInitial<TName extends string> = PgVectorBuilder<{
  name: TName
  data: number[]
  driverParam: string
  notNull: false
  hasDefault: false
}>

export class PgVectorBuilder<
  T extends ColumnBuilderBaseConfig
> extends PgColumnBuilder<
  PgVectorBuilderHKT,
  T,
  {
    dimensions: number | undefined
  }
> {
  constructor(name: string, dimensions?: number) {
    super(name)
    this.config.dimensions = dimensions
  }

  /** @internal */
  override build<TTableName extends string>(
    table: AnyPgTable<{ name: TTableName }>
  ): PgVector<MakeColumnConfig<T, TTableName>> {
    return new PgVector<MakeColumnConfig<T, TTableName>>(table, this.config)
  }
}

class PgVector<T extends ColumnBaseConfig> extends PgColumn<PgVectorHKT, T> {
  readonly dimensions: number | undefined

  constructor(
    table: AnyPgTable<{ name: T["tableName"] }>,
    config: PgVectorBuilder<T>["config"]
  ) {
    super(table, config)
    this.dimensions = config.dimensions
  }

  getSQLType(): string {
    const dimensions = this.dimensions
    if (dimensions === undefined) {
      return "vector"
    }
    return util.format("vector(%d)", dimensions)
  }

  override mapFromDriverValue(value: string): number[] {
    return fromSql(value)
  }

  override mapToDriverValue(value: number[]): string {
    return toSql(value)
  }
}

export function vector<TName extends string>(
  name: TName,
  config?: { dimensions?: number }
): PgVectorBuilderInitial<TName> {
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

function fromSql(value: string) {
  return value
    .substring(1, value.length - 1)
    .split(",")
    .map((v: string) => parseFloat(v))
}

function toSql(value: number[]) {
  return JSON.stringify(value)
}
