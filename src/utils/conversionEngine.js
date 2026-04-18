const PANEER_LITRES_PER_KG = 10;
const GHEE_LITRES_PER_KG = 25;

const normalizeSupportedProducts = (supportedProducts) => {
  if (Array.isArray(supportedProducts)) {
    return supportedProducts.map((item) => String(item).toLowerCase());
  }
  if (supportedProducts && Array.isArray(supportedProducts.products)) {
    return supportedProducts.products.map((item) => String(item).toLowerCase());
  }
  return [];
};

const computeOutputs = ({ inputMilkLitres, supportedProducts }) => {
  const qty = Number(inputMilkLitres);
  const products = normalizeSupportedProducts(supportedProducts);

  const paneerOutputKg = products.includes("paneer")
    ? Number((qty / PANEER_LITRES_PER_KG).toFixed(3))
    : 0;
  const gheeOutputKg = products.includes("ghee")
    ? Number((qty / GHEE_LITRES_PER_KG).toFixed(3))
    : 0;

  return {
    input_milk_litres: Number(qty.toFixed(2)),
    paneer_output_kg: paneerOutputKg,
    ghee_output_kg: gheeOutputKg,
    conversion_rules: {
      paneer: "10L milk -> 1kg paneer",
      ghee: "25L milk -> 1kg ghee",
    },
  };
};

module.exports = {
  PANEER_LITRES_PER_KG,
  GHEE_LITRES_PER_KG,
  computeOutputs,
};
