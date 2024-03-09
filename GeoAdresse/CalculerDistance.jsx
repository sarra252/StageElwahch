const CalculerDistance = (latitude1, longitude1, latitude2, longitude2) => {
  const R = 6371; // Rayon de la Terre en kilomètres
  console.log(`${latitude1},${longitude1}, ${latitude2}, ${longitude2}`);
  const dLat = deg2rad(latitude2 - latitude1);
  const dLon = deg2rad(longitude2 - longitude1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(latitude1)) *
      Math.cos(deg2rad(latitude2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // Distance en kilomètres
  console.log("distance", d);
  return d;
};
export default CalculerDistance;

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
