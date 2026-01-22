const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config({ path: '../.env' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order
exports.createPaymentOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        console.log('=== Creating Razorpay Order ===');
        console.log('Amount received:', amount);
        console.log('Amount in paise:', amount * 100);

        const options = {
            amount: Math.round(amount * 100), // Amount in paise
            currency: 'INR',
            receipt: 'receipt_' + Date.now()
        };

        const order = await razorpay.orders.create(options);
        console.log('Razorpay order created successfully:', order.id);
        res.json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error.message);
        res.status(500).json({ message: 'Payment order creation failed', error: error.message });
    }
};

// Create Stripe Payment Intent
exports.createStripePaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body;

        console.log('=== Creating Stripe Payment Intent ===');
        console.log('Amount received:', amount);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Amount in cents
            currency: 'usd', // Using USD for Stripe
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating Stripe Payment Intent:', error);
        res.status(500).json({ message: 'Stripe payment intent creation failed', error: error.message });
    }
};

// Verify Razorpay Payment
exports.verifyPayment = (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            res.json({ message: "Payment verified successfully" });
        } else {
            console.error('Signature mismatch!');
            res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).send(error);
    }
};
