import Stripe from 'stripe'

// Use your account's default API version unless you have a specific need
// to pin it. This avoids mismatches between SDK and API versions.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
})
