require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function getPrices() {
  try {
    console.log('\nFetching prices for products...\n');

    const productIds = [
      'prod_T8zMXxZWHbbkdX', // 1本
      'prod_T8zN6icwxBBrPE', // 2本
      'prod_T8zNsJHzOmg3l9'  // 3本
    ];

    for (const productId of productIds) {
      console.log(`\nProduct: ${productId}`);

      // Get product details
      const product = await stripe.products.retrieve(productId);
      console.log(`  Name: ${product.name}`);
      console.log(`  Default Price: ${product.default_price || 'NOT SET'}`);

      // List all prices for this product
      const prices = await stripe.prices.list({
        product: productId,
        active: true,
        limit: 10
      });

      console.log(`  Active Prices: ${prices.data.length}`);
      prices.data.forEach(price => {
        console.log(`    - ${price.id}: ${price.unit_amount / 100} ${price.currency.toUpperCase()}`);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getPrices();