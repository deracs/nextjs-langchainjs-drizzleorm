import { db } from "@/db"
import { sql } from "drizzle-orm"
import { SqlTable } from "langchain/dist/util/sql_utils"

export async function getTables() {
  const tables = await db.execute(sql`SELECT 
      t.table_name, 
      c.* 
    FROM 
      information_schema.tables t 
        JOIN information_schema.columns c 
          ON t.table_name = c.table_name 
    WHERE 
      t.table_schema = 'public' 
        AND c.table_schema = 'public' 
    ORDER BY 
      t.table_name,
      c.ordinal_position;`)
  return formatToSqlTable(tables)
}

export const formatToSqlTable = (
  rawResultsTableAndColumn: Array<any>
): Array<SqlTable> => {
  const sqlTable: Array<SqlTable> = []
  for (const oneResult of rawResultsTableAndColumn) {
    const sqlColumn = {
      columnName: oneResult.column_name,
      dataType: oneResult.data_type,
      isNullable: oneResult.is_nullable === "YES",
    }
    const currentTable = sqlTable.find(
      (oneTable) => oneTable.tableName === oneResult.table_name
    )
    if (currentTable) {
      currentTable.columns.push(sqlColumn)
    } else {
      const newTable = {
        tableName: oneResult.table_name,
        columns: [sqlColumn],
      }
      sqlTable.push(newTable)
    }
  }

  return sqlTable
}
export const generateTableInfoFromTables = async (
  tables: any[],
  schema = "public",
  nbSampleRow = 10
) => {
  let globalString = ""

  const client = db

  for (const currentTable of tables) {
    let sqlCreateTableQuery = `CREATE TABLE "${schema}"."${currentTable.tableName}" (\n`
    for (const [key, currentColumn] of currentTable.columns.entries()) {
      if (key > 0) {
        sqlCreateTableQuery += ", "
      }
      sqlCreateTableQuery += `${currentColumn.columnName} ${
        currentColumn.dataType
      } ${currentColumn.isNullable ? "" : "NOT NULL"}`
    }
    sqlCreateTableQuery += ") \n"

    const sqlSelectInfoQuery = `SELECT * FROM "${schema}"."${currentTable.tableName}" LIMIT ${nbSampleRow};`
    let sample = ""
    try {
      const result = await client.execute(sql.raw(sqlSelectInfoQuery))
      sample = formatSqlResponseToSimpleTableString(result)
    } catch (error) {
      console.log(error)
    }
    const columnNamesConcatString = `${currentTable.columns.reduce(
      (completeString: any, column: any) =>
        `${completeString} ${column.columnName}`,
      ""
    )}\n`

    globalString = globalString.concat(
      sqlCreateTableQuery +
        sqlSelectInfoQuery +
        columnNamesConcatString +
        sample
    )
  }

  return globalString
}

export const formatSqlResponseToSimpleTableString = (
  rawResult: unknown
): string => {
  if (!rawResult || !Array.isArray(rawResult) || rawResult.length === 0) {
    return ""
  }

  let globalString = ""
  for (const oneRow of rawResult) {
    globalString += `${Object.values(oneRow).reduce(
      (completeString, columnValue) => `${completeString} ${columnValue}`,
      ""
    )}\n`
  }

  return globalString
}
