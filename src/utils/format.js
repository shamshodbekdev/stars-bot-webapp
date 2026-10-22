export function formatSom(amount) {
  if (!amount) return "0 so'm";
  const num = Math.floor(Number(amount));
  return num.toLocaleString('uz-UZ').replace(/,/g, ' ') + " so'm";
}

export function formatNumber(num) {
  if (!num) return '0';
  return Number(num).toLocaleString('uz-UZ').replace(/,/g, ' ');
}

export function formatDate(date) {
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleDateString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatUsername(username) {
  if (!username) return '—';
  return `@${username.replace(/^@/, '')}`;
}
