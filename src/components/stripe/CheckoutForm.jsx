import React from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { HandCard } from 'iconoir-react'
import { Button } from '@/components'

export default function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()

  const [email, setEmail] = React.useState('')
  const [message, setMessage] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    )

    console.log('checkout console log')

    if (!clientSecret) {
      return
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Payment succeeded!')
          break
        case 'processing':
          setMessage('Your payment is processing.')
          break
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.')
          break
        default:
          setMessage('Something went wrong.')
          break
      }
    })
  }, [stripe])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        receipt_email: email,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pages/confirm-order/order-complete`,
      },
    })

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message)
    } else {
      setMessage('An unexpected error occurred.')
    }

    setIsLoading(false)
  }

  const paymentElementOptions = {
    layout: 'tabs',
  }

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="flex flex-col items-center h-[42rem] md:h-[40rem] md:my-8 rounded-3xl md:bg-quaternaryGrey md:m-8 p-8 md:shadow-lg"
    >
      <HandCard className="text-primaryPink" height={125} width={125} />
      <h1 className="text-3xl pb-5">PAYMENT</h1>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <Button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        type="submit"
        optionalClassNames="w-full m-6"
        text={'Pay now'}
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : 'Pay now'}
        </span>
      </Button>
      {message ? (
        <div id="payment-message" className="text-red-500">
          {message}
        </div>
      ) : null}
    </form>
  )
}