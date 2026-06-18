import type { Page, Route } from '@playwright/test'
import { actionResponse, mockCrudResource, mockRoute, paginatedResponse } from './mockApi'

export interface IMockContract {
  id: number
  idNo: string
  status: string
  contractedAt: string
  createdAt: string
  branch: { id: number, name: string, status: string }
  customer: { id: number, titleName: string, firstName: string, lastName: string }
  loanType: { id: number, name: string }
  contractLoanType: { id: number, name: string }
  contractLoanPurpose: { id: number, name: string }
  howDidFindUs: { id: number, name: string }
  sellMan: { id: number, title: string, firstName: string, lastName: string, phoneNumber: string }
  borrowers: unknown[]
  guarantors: unknown[]
  amount: number
  loanAmount: number
  firstInstallmentDate: string
  finalInstallmentDate: string
  finalInstallment: number
  periodCount: number
  installmentCount: number
  interestType: string
  annualInterestRate: number
  lateFee: number
  perMonthPayment: number
  lastPeriodPayment: number
  interestAmount: number
  monthlyInstallment: number
  totalInterest: number
  outstanding: { principal: number, interest: number, total: number }
  startDate: string
  endDate: string
}

export function makeContractFixture (overrides: Partial<IMockContract> = {}): IMockContract {
  return {
    id: 555,
    idNo: 'CT-555',
    status: 'ACTIVE',
    contractedAt: '2024-01-01',
    createdAt: '2024-01-01',
    branch: { id: 1, name: 'Mock Branch', status: 'ACTIVE' },
    customer: { id: 1, titleName: 'นาย', firstName: 'Mock', lastName: 'Customer' },
    loanType: { id: 1, name: 'Mock Loan Type' },
    contractLoanType: { id: 1, name: 'Mock Loan Type' },
    contractLoanPurpose: { id: 1, name: 'Mock Loan Purpose' },
    howDidFindUs: { id: 1, name: 'Mock Source' },
    sellMan: { id: 1, title: 'นาย', firstName: 'Mock', lastName: 'Sell', phoneNumber: '0800000000' },
    borrowers: [],
    guarantors: [],
    amount: 10000,
    loanAmount: 10000,
    firstInstallmentDate: '2024-02-01',
    finalInstallmentDate: '2025-01-01',
    finalInstallment: 1000,
    periodCount: 12,
    installmentCount: 12,
    interestType: 'FLAT',
    annualInterestRate: 15,
    lateFee: 0,
    perMonthPayment: 1000,
    lastPeriodPayment: 1000,
    interestAmount: 1500,
    monthlyInstallment: 1000,
    totalInterest: 1500,
    outstanding: { principal: 10000, interest: 1500, total: 11500 },
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    ...overrides
  }
}

export async function mockContractListAndDetail (
  page: Page,
  opts?: { contractId?: number, overrides?: Partial<IMockContract> }
): Promise<{ contract: IMockContract }> {
  const contract = makeContractFixture({ id: opts?.contractId ?? 555, ...opts?.overrides })

  await mockRoute(page, '**/api/v1/management/pre-contract**', {
    method: 'GET',
    body: paginatedResponse([contract])
  })

  await mockCrudResource<IMockContract>({
    page,
    basePath: '/api/v1/management/contract',
    detailPath: '/api/v1/management/contract/:id',
    supportsUpdate: false,
    supportsDelete: false,
    seed: [contract],
    buildCreated: (body: Record<string, unknown>, id: number): IMockContract => makeContractFixture({ id, ...body })
  })

  await page.route('**/api/v1/management/contract/cancelled/**', async (route: Route): Promise<void> => {
    contract.status = 'CANCELLED'
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(actionResponse(true)) })
  })

  return { contract }
}
