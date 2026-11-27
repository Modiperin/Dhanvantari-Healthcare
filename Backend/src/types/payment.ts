export interface PaymentType {
  payId: string // UUID or short ID
  name: string
  amount: number // Price per unit
  unit: number // Quantity
  discount: number // Absolute discount (not %)
  tax: number // Absolute tax (not %)
  total: number // Calculated: (amount * unit) - discount + tax
  dueAmount: number
  type: string // "advance", "final", etc.
  paymentMode: string // "cash", "card", "upi"
  status: string // "active", "cancelled", etc.
  invoiceId?: string // Optional, for payments linked to invoices used for settlements
}

export type PaymodesType = {
  type: string // "cash", "card", "upi","cheque"
  amount: number // Amount paid
}
