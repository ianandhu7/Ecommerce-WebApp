import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';

// Load Stripe outside of component render to avoid recreating Stripe object
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ amount, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL where the customer should be redirected after the PaymentIntent is confirmed.
                // We'll handle success in the same component for now or redirect to success page
                return_url: window.location.origin + "/checkout",
            },
            redirect: "if_required", // Prevent redirect if not needed (e.g. for card payments that don't require 3DS)
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
                toast.error(error.message);
            } else {
                setMessage("An unexpected error occurred.");
                toast.error("An unexpected error occurred.");
            }
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            toast.success("Payment Successful!");
            onSuccess(paymentIntent);
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement id="payment-element" />
            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                <span id="button-text">
                    {isLoading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
                </span>
            </button>
            {message && <div id="payment-message" className="text-red-500 text-sm text-center">{message}</div>}
        </form>
    );
};

const StripePayment = ({ amount, onSuccess }) => {
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        axios.post("http://localhost:5002/api/payment/stripe/create-intent", {
            amount: amount
        })
            .then((res) => setClientSecret(res.data.clientSecret))
            .catch((err) => {
                console.error("Error creating payment intent:", err);
                toast.error("Failed to initialize Stripe payment");
            });
    }, [amount]);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="w-full">
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm amount={amount} onSuccess={onSuccess} />
                </Elements>
            )}
        </div>
    );
};

export default StripePayment;
