const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const stripe = require("stripe")(STRIPE_SECRET_KEY);

const response = {
  headers: {
    "content-type": "application/json; charset=utf8",
    "cache-control":
      "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
    "Access-Control-Allow-Origin": "*",
  },
};

const getErrorResponse = (name) => ({
  ...response,
  statusCode: 500,
  body: JSON.stringify({
    errors: [{ name }],
  }),
});

// This function matches the prices with the products because the
// Stripe API provides prices separately from the product info
const getProductsWithPrices = (products, prices) =>
  products.data.map((product) => ({
    prices: prices.data.filter((price) => price.product === product.id),
    ...product,
  }));

exports.handler = async function products(req) {
  if (!STRIPE_SECRET_KEY) {
    return getErrorResponse("Missing Stripe Key");
  }

  try {
    const products = await stripe.products.list({ limit: 100 });
    const prices = await stripe.prices.list({ limit: 100 });
    const productsWithPrices = getProductsWithPrices(products, prices);

    return {
      ...response,
      statusCode: 200,
      body: JSON.stringify(productsWithPrices),
    };
  } catch (error) {
    return getErrorResponse(error.message);
  }
};
