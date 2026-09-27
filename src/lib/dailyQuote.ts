import records from '../data/daily-quotes.json';

// The dated personal collection is verified against the Quotes Markdown export.
export const dailyQuotes = records;

export function quoteForDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const part = (type: string) => Number(parts.find((item) => item.type === type)!.value);
  const day = Math.floor(Date.UTC(part('year'), part('month') - 1, part('day')) / 86_400_000);
  return dailyQuotes[((day % dailyQuotes.length) + dailyQuotes.length) % dailyQuotes.length];
}

export function quoteDate(date: string) {
  return date ? new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(`${date}T00:00:00Z`)) : '';
}
