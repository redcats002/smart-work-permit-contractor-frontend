import { EmployeeRoleEnum, type TEmployeeRole } from '@/enums/modules/employee/EmployeeRole.enum'

export type TPermissionModule
  = | 'dashboard'
    | 'news'
    | 'tasks'
    | 'contracts'
    | 'assets'
    | 'customers'
    | 'finance_docs'
    | 'storage'
    | 'audit_logs'
    | 'reports'
    | 'settings'

export type TPermissionAction
  = | 'read'
    | 'create'
    | 'update'
    | 'delete'
    | 'filter'
    | 'upload'
    | 'asset_detail'
    | 'pay'
    | 'invoice'
    | 'receipt'
    | 'expense'
    | 'revenue'
    | 'contact_log'
    | 'doc_log'
    | 'upload_doc'
    | 'change_status'
    | 'create_contract'
    | 'move_doc'
    | 'export'
    | 'read_asset_valuation'
    | 'read_collection'
    | 'employee'
    | 'warehouse'
    | 'branch'
    | 'channel'
    | 'contract_config'
    | 'finance_config'
    | 'finance_main'

export const RolePermissions: Record<TEmployeeRole, Partial<Record<TPermissionModule, TPermissionAction[]>>> = {
  [EmployeeRoleEnum.SUPER_ADMIN]: {
    dashboard: ['read', 'filter'],
    news: ['read', 'create', 'update', 'delete'],
    tasks: ['read_asset_valuation', 'read_collection'],
    contracts: ['read', 'create', 'upload', 'asset_detail', 'pay', 'invoice', 'receipt', 'expense', 'revenue', 'contact_log', 'doc_log'],
    assets: ['read', 'upload_doc', 'change_status'],
    customers: ['read', 'create', 'update', 'delete', 'upload_doc', 'create_contract'],
    finance_docs: ['read', 'invoice', 'receipt', 'expense'],
    storage: ['read', 'move_doc'],
    audit_logs: ['read'],
    reports: ['read', 'export'],
    settings: ['employee', 'warehouse', 'branch', 'channel', 'contract_config', 'finance_config', 'finance_main']
  },
  [EmployeeRoleEnum.ADMIN]: {
    dashboard: ['read', 'filter'],
    news: ['read', 'create', 'update', 'delete'],
    tasks: ['read_asset_valuation', 'read_collection'],
    contracts: ['read', 'create', 'upload', 'asset_detail', 'pay', 'invoice', 'receipt', 'expense', 'revenue', 'contact_log', 'doc_log'],
    assets: ['read', 'upload_doc', 'change_status'],
    customers: ['read', 'create', 'upload_doc', 'create_contract'],
    finance_docs: ['read', 'invoice', 'receipt', 'expense'],
    storage: ['read', 'move_doc'],
    reports: ['read', 'export'],
    settings: ['warehouse', 'branch', 'channel']
  },
  [EmployeeRoleEnum.SUPERVISOR]: {
    dashboard: ['read', 'filter'],
    news: ['read'],
    tasks: ['read_asset_valuation', 'read_collection'],
    contracts: ['read', 'create', 'upload', 'asset_detail', 'pay', 'invoice', 'receipt', 'expense', 'revenue', 'contact_log', 'doc_log'],
    assets: ['read', 'upload_doc'],
    customers: ['read', 'create', 'upload_doc', 'create_contract'],
    finance_docs: ['read', 'invoice', 'receipt', 'expense'],
    storage: ['read', 'move_doc'],
    reports: ['read', 'export'],
    settings: []
  },
  [EmployeeRoleEnum.STAFF]: {
    dashboard: ['read', 'filter'],
    news: ['read'],
    tasks: ['read_collection'],
    contracts: ['read', 'create', 'upload', 'asset_detail', 'pay', 'invoice', 'receipt', 'expense', 'revenue', 'contact_log', 'doc_log'],
    assets: ['read', 'upload_doc'],
    customers: ['read', 'create', 'upload_doc', 'create_contract'],
    finance_docs: ['read', 'invoice', 'receipt', 'expense'],
    storage: ['read', 'move_doc'],
    reports: ['read', 'export'],
    settings: []
  }
}
