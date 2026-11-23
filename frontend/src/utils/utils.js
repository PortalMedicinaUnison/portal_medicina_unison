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


// Fecha sin hora ('YYYY-MM-DD', p. ej. expiration_date o date_report) → texto,
// sin el desplazamiento de zona horaria que provoca `new Date('YYYY-MM-DD')`.
export function formatDate(value, { locale = 'es-MX', dateStyle = 'medium' } = {}) {
  if (!value) return '—';
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (!match) return formatDateTime(value, { locale, dateStyle, timeStyle: undefined });
  const [, year, month, day] = match;
  return new Intl.DateTimeFormat(locale, { dateStyle, timeZone: 'UTC' })
    .format(new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))));
}

// Hoy como 'YYYY-MM-DD' en la hora local del navegador (para comparar con fechas sin hora).
export function todayISO() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
