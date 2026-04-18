const toRadians = (degrees) => (Number(degrees) * Math.PI) / 180;

const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const earthRadiusKm = 6371;

  const dLat = toRadians(Number(lat2) - Number(lat1));
  const dLon = toRadians(Number(lon2) - Number(lon1));

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((earthRadiusKm * c).toFixed(3));
};

module.exports = {
  calculateDistanceKm,
};
