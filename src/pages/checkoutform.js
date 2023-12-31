// CheckoutForm.tsx

import { useState } from 'react';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);
export default function CheckoutForm(props) {
    const [error, setError] = useState(undefined);
    const [disabled, setDisabled] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    function handleCardInputChange(event) {
        // Listen for changes in card input
        // and display errors, if any, to the user
        // Also control the disabled state of the submit button
        // if the input field is empty
        setDisabled(event?.empty);
        setError(event?.error?.message ?? '');
    }

    async function handleCheckoutFormSubmit(event) {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet.
            return;
        }

        // Call the subscribe endpoint and create a Stripe subscription 
        // object. Returns the subscription ID and client secret
        const subscriptionResponse = await fetch(
            '/api/subscribe',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customerId: props.customerId, priceId: props.priceId })
            }
        )
        const subscription = await subscriptionResponse.json();
        const stripePayload = await stripe.confirmCardPayment(
            subscription.clientSecret, // returned by subscribe endpoint
            {
                payment_method: {
                    card: elements.getElement(CardElement)
                }
            }
        )

        if (stripePayload.error) {
            setError(stripePayload.error.message);
        }
    }

    return (

        <form onSubmit={handleCheckoutFormSubmit}>
            <CardElement onChange={handleCardInputChange} />
            <button
                disabled={!stripe && disabled}
                type='submit'
            >
                Pay Now
            </button>
        </form>

    );
}
