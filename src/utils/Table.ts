export function getTableIndex (index: number, pagination: { page?: number, limit?: number }): number {
  return (pagination.limit || 1) * ((pagination.page || 1) - 1) + index + 1
}
