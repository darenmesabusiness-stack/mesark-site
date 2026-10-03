/** User-confirmed policy: tickets only; higher credit tier replaces the lower one. */
export function moderatorRewards(credits: number, deductions = 0) {
  const tickets = Math.max(0, Math.floor(credits) - Math.floor(deductions));
  return {
    tickets, storeCredit: tickets > 100 ? 125 : tickets > 60 ? 50 : 0,
    toaaDays: tickets > 400 ? 28 : 0,
    target: 45, minimum: 30, inactivityReview: tickets < 30, targetMet: tickets >= 45,
  };
}
export function monthBounds(month: string) {
  if (!/^20\d\d-(0[1-9]|1[0-2])$/.test(month)) return null;
  const start = `${month}-01T00:00:00.000Z`, date = new Date(start);
  date.setUTCMonth(date.getUTCMonth() + 1);
  return { start, end: date.toISOString() };
}
export const currentRewardMonth = () => new Date().toISOString().slice(0,7);
