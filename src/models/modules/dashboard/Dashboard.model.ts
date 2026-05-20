export interface IDashboardSummaryCard {
  key: string
  title: string
  amount: string
  icon: string
  iconClass: string
  cardClass: string
}

export interface IDashboardDonutRow {
  label: string
  value: string
  unit: string
  percent: string
}

export interface IDashboardDonutData {
  title: string
  centerValue: string
  centerUnit: string
  rows: IDashboardDonutRow[]
}
