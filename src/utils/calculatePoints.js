export function calculatePoints(amount) {
  const wholeDollars = Math.floor(amount);
  let points = 0;

  if (wholeDollars > 50) {
    points += Math.min(wholeDollars, 100) - 50;
  }

  if (wholeDollars > 100) {
    points += (wholeDollars - 100) * 2;
  }

  return points;
}
