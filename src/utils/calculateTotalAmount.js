const QUALITY_BONUS_PER_LITRE = 2;
const FAT_BONUS_THRESHOLD = 4;

const calculateTotalAmount = (quantityLitres, pricePerLitre, fatPercentage) => {
  const baseAmount = Number(quantityLitres) * Number(pricePerLitre);
  const bonusAmount =
    Number(fatPercentage) > FAT_BONUS_THRESHOLD
      ? Number(quantityLitres) * QUALITY_BONUS_PER_LITRE
      : 0;

  return Number((baseAmount + bonusAmount).toFixed(2));
};

module.exports = {
  calculateTotalAmount,
  QUALITY_BONUS_PER_LITRE,
  FAT_BONUS_THRESHOLD,
};
