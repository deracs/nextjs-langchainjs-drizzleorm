import util from "util"
import {
  sql,
  type Assume,
  type ColumnBaseConfig,
  type ColumnBuilderBaseConfig,
  type ColumnBuilderHKTBase,
  type ColumnHKTBase,
  type MakeColumnConfig,
} from "drizzle-orm"
import { AnyPgTable, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core"

interface PgVectorBuilderHKT extends ColumnBuilderHKTBase {
  _type: PgVectorBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>
  _columnHKT: PgVectorHKT
}

interface PgVectorHKT extends ColumnHKTBase {
  _type: PgVector<Assume<this["config"], ColumnBaseConfig>>
}

export type PgVectorBuilderInitial<TName extends string> = PgVectorBuilder<{
  name: TName
  data: unknown
  driverParam: unknown
  notNull: false
  hasDefault: false
  dimensions?: number
}>

interface PgVectorBuilderBaseConfig extends ColumnBuilderBaseConfig {
  dimensions?: number
  default: undefined // make 'default' required
  primaryKey: boolean
}

interface PgVectorBaseConfig extends ColumnBaseConfig {
  dimensions?: number
  default: undefined // make 'default' required
  primaryKey: boolean
}

export type PgVectorBuilderConfig = PgVectorBuilderBaseConfig &
  ColumnBuilderBaseConfig
export type PgVectorConfig = PgVectorBaseConfig & ColumnBaseConfig

class PgVectorBuilder<
  T extends ColumnBuilderBaseConfig
> extends PgColumnBuilder<PgVectorBuilderHKT, T> {
  constructor(name: string, protected config: PgVectorConfig) {
    super(name)
  }

  build<TTableName extends string>(
    table: AnyPgTable<{ name: TTableName }>
  ): PgVector<MakeColumnConfig<T, TTableName>> {
    return new PgVector<MakeColumnConfig<T, TTableName>>(table, this.config)
  }
}

class PgVector<T extends ColumnBaseConfig> extends PgColumn<PgVectorHKT, T> {
  dimensions: number | undefined

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

  override mapFromDriverValue(value: T["data"] | string): T["data"] {
    return fromSql(value)
  }

  override mapToDriverValue(value: T["data"]): string {
    return toSql(value)
  }
}

export function vector<TName extends string>(
  name: TName,
  config: PgVectorConfig
): PgVectorBuilderInitial<TName> {
  return new PgVectorBuilder(name, config)
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
