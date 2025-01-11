"use client"

import { UseStripeElements } from "@/hooks/payment"
import { Elements } from "@stripe/react-stripe-js"

interface StripeElementProps {
  children: React.ReactNode
}

export const StripeElements = ({ children }: StripeElementProps) => {
  const { StripePromise } = UseStripeElements()
  const promise = StripePromise()

  return promise && <Elements stripe={promise}>{children}</Elements>
}
