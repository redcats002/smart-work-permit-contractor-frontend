// import type { StockFormValues } from '@/pages/stock/pages/create/schema/stock.schema'
import type { DocumentMovementFormValues } from '@/pages/stock/pages/create/schema/document-movement'
import type { IBasePaginationRequest } from '../Request.model'

export interface IActionStockPayload extends ICreateStockPayload, IUpdateStockPayload {}
export interface ICreateStockPayload extends DocumentMovementFormValues {}
export interface IUpdateStockPayload extends ICreateStockPayload {}

export interface IGetStockList extends IBasePaginationRequest {}
export interface IGetStockContractList extends IBasePaginationRequest {}
export interface IGetStockPaymentHistoryList extends IBasePaginationRequest {}
export interface IGetStockContactHistoryList extends IBasePaginationRequest {}
export interface IGetStockEstateList extends IBasePaginationRequest {}
