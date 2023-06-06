export type TableActions<T> = {
  create: (data: any) => Promise<any>
  update: (data: any) => Promise<any>
  delete: (data: any) => Promise<any>
  deleteMany: (data: any) => Promise<any>
  favourite: (data: any) => Promise<any>
}
