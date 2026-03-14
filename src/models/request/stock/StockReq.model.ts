// import type { StockFormValues } from '@/pages/stock/pages/create/schema/stock.schema'
import type { StockDocsFormValues } from '@/pages/stock/pages/create/schema/stockDocs.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IActionStockPayload extends ICreateStockDocsPayload, IUpdateStockPayload {}
export interface ICreateStockDocsPayload extends StockDocsFormValues {}
export interface IUpdateStockPayload extends ICreateStockDocsPayload {}

export interface IGetStockList extends IBasePaginationRequest {}
export interface IGetStockContractList extends IBasePaginationRequest {}
export interface IGetStockPaymentHistoryList extends IBasePaginationRequest {}
export interface IGetStockContactHistoryList extends IBasePaginationRequest {}
export interface IGetStockEstateList extends IBasePaginationRequest {}
