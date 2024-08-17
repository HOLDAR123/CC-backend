export interface ReportsQueryInterface {
  id?: number | string
  date_from?: string,
  date_to?: string,
  slice?: string[],
  page?: number
  limit?: number
}
