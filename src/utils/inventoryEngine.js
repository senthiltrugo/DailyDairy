const normalizeMovementType = (movementType) => String(movementType || "").toUpperCase();

const parsePositiveQuantity = (quantity) => {
  const parsed = Number(quantity);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return Number(parsed.toFixed(3));
};

const computeNextQuantity = ({ currentQuantity, movementType, quantity }) => {
  const normalizedType = normalizeMovementType(movementType);
  if (!["INCREASE", "REDUCE"].includes(normalizedType)) {
    return {
      ok: false,
      error: "movement_type must be either INCREASE or REDUCE",
    };
  }

  const parsedQuantity = parsePositiveQuantity(quantity);
  if (parsedQuantity === null) {
    return {
      ok: false,
      error: "quantity must be greater than 0",
    };
  }

  const current = Number(currentQuantity || 0);
  const next =
    normalizedType === "INCREASE"
      ? current + parsedQuantity
      : current - parsedQuantity;

  if (next < 0) {
    return {
      ok: false,
      error: "insufficient stock for requested reduction",
    };
  }

  return {
    ok: true,
    movementType: normalizedType,
    quantity: parsedQuantity,
    previousQuantity: Number(current.toFixed(3)),
    nextQuantity: Number(next.toFixed(3)),
  };
};

module.exports = {
  normalizeMovementType,
  parsePositiveQuantity,
  computeNextQuantity,
};
