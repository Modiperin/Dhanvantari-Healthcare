import { PaymentType } from 'types/payment'
import * as paymentQueries from 'db/queries/payments'
import * as commonQueries from 'db/queries/common'
import mongoDB from 'db'
import { DynamicObjectType } from 'types'

export const generatePaymentLogs = (
  oldPayments: PaymentType[],
  newPayments: PaymentType[],
  visitId: string,
  paymentId: string,
  updatedBy: string
) => {
  const logs: DynamicObjectType[] = []

  const oldMap = new Map(oldPayments.map((p) => [p.payId, p]))
  const newMap = new Map(newPayments.map((p) => [p.payId, p]))

  for (const [payId, newPayment] of newMap) {
    const oldPayment = oldMap.get(payId)

    if (!oldPayment) {
      // New payment added
      logs.push({
        paymentId,
        visitId,
        payId,
        changeType: 'added',
        newData: newPayment,
        timestamp: new Date(),
        updatedBy
      })
      continue
    }

    // Compare fields for updates
    for (const key in newPayment) {
      const typedKey = key as keyof PaymentType
      if (
        newPayment[typedKey] !== oldPayment[typedKey] &&
        !(newPayment[typedKey] == null && oldPayment[typedKey] == null)
      ) {
        logs.push({
          paymentId,
          visitId,
          payId,
          field: typedKey,
          oldValue: oldPayment[typedKey],
          newValue: newPayment[typedKey],
          changeType: 'updated',
          timestamp: new Date(),
          updatedBy
        })
      }
    }

    oldMap.delete(payId) // remove handled
  }

  // Deleted payments
  for (const [payId, oldPayment] of oldMap) {
    logs.push({
      paymentId,
      visitId,
      payId,
      changeType: 'deleted',
      oldData: oldPayment,
      timestamp: new Date(),
      updatedBy
    })
  }

  return logs
}

export const duesSettlement = async (
  oldPayments: PaymentType[],
  newPayments: PaymentType[],
  currentUserId: string,
  invoiceId: string
) => {
  const oldInvoices: string[] = []
  const settlementPayments: { [key: string]: DynamicObjectType } = {}

  let paymentIds: string[] = []
  let settlementLogs: DynamicObjectType[] = []

  oldPayments.forEach((p) => {
    if (p.invoiceId) {
      oldInvoices.push(p.invoiceId)
    }
  })

  newPayments.forEach((p) => {
    if (p.invoiceId && !oldInvoices.includes(p.invoiceId)) {
      settlementPayments[p.invoiceId] = p
    }
  })

  if (Object.keys(settlementPayments).length) {
    const previosDuePayments = await commonQueries.findDocuments(
      paymentQueries.getCollection,
      mongoDB,
      {
        invoiceId: { $in: Object.keys(settlementPayments) }
      }
    )
    if (previosDuePayments.length) {
      paymentIds = previosDuePayments.map((p) => {
        const paymentId = p._id
        settlementLogs.push({
          paymentId,
          visitId: p.visitId,
          paidFrom: invoiceId,
          settlementAmount: settlementPayments[p.invoiceId].total,
          changeType: 'settlement',
          oldData: p,
          timestamp: new Date(),
          updatedBy: currentUserId
        })
        return paymentId
      })
    }
  }

  return { paymentIds, settlementLogs }
}
