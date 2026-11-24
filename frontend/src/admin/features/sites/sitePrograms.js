// "Internado", "Servicio social" o "Internado y servicio social": para qué programas ofrece cupos la sede.
export function siteProgramsLabel(site) {
  if (!site) return '—';
  if (site.for_internship && site.for_social_service) return 'Internado y servicio social';
  if (site.for_internship) return 'Internado';
  if (site.for_social_service) return 'Servicio social';
  return '—';
}
