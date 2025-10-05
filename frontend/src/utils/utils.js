export function cleanFormData(data = {}, fields = null) {
  const cleanedData = {};
  Object.keys(data).forEach((key) => {
    if (fields != null && !fields.includes(key)) {
      return;
    }
    if (typeof data[key] === 'string') {
        cleanedData[key] = data[key].trim();
    } else {
      cleanedData[key] = data[key];
    }
  });
  return cleanedData;
}

export function formatDateTime(value, {
  locale = 'es-MX',
  timeZone = 'America/Hermosillo',
  dateStyle = 'medium',            // 'short' | 'medium' | 'long' | 'full'
  timeStyle = 'short',             // 'short' | 'medium' | 'long' | 'full'
  hour12 = false
} = {}) {
  if (!value) return '—';
  // Acepta Date o string ISO (idealmente con Z o +offset)
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(+d)) return String(value); // fallback
  return new Intl.DateTimeFormat(locale, { dateStyle, timeStyle, hour12, timeZone }).format(d);
}
