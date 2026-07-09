const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent for in-app purchases
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, userId, itemId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId,
        itemId
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle subscription creation
router.post('/create-subscription', async (req, res) => {
  try {
    const { userId, tier, paymentMethodId } = req.body;

    // Create or retrieve customer
    const customer = await stripe.customers.create({
      metadata: { userId }
    });

    // Subscription prices (monthly)
    const prices = {
      basic: 4.99,
      pro: 9.99,
      elite: 19.99
    };

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price_data: {
        currency: 'usd',
        product_data: { name: `${tier} Tier` },
        recurring: { interval: 'month' },
        unit_amount: Math.round(prices[tier] * 100)
      }}],
      payment_method: paymentMethodId,
      expand: ['latest_invoice.payment_intent']
    });

    res.json({ subscriptionId: subscription.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook for payment events
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object);
        // Update user earnings
        break;
      case 'customer.subscription.updated':
        console.log('Subscription updated:', event.data.object);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;