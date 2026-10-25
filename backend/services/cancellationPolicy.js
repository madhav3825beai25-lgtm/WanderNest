const VERSION = 'WN-2026-01';
function dayNumber(value) {
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) throw new Error('Invalid check-in date');
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d).filter(x=>x.type!=='literal').map(x=>[x.type,Number(x.value)]));
  return Math.floor(Date.UTC(p.year,p.month-1,p.day)/86400000);
}
function policy(checkIn, amountPaise=0) {
  if (!Number.isSafeInteger(amountPaise)||amountPaise<0) throw new Error('Invalid amount');
  const days = dayNumber(checkIn)-dayNumber(new Date());
  const eligible=days>=0;
  const percent=days>=7?100:days>=3?50:0;
  return {version:VERSION,eligible,daysBeforeCheckIn:days,refundPercentage:eligible?percent:0,refundAmountPaise:eligible?Math.floor(amountPaise*percent/100):0};
}
module.exports={policy};
