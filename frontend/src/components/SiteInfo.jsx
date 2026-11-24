// Sede o plaza asignada al alumno: nombre, institución, dirección y municipio, con enlace al mapa.
// (Los datos del jefe y del subjefe de enseñanza no se muestran.)
function SiteInfo({ site, emptyText }) {
  if (!site) return <span className="italic text-gray-500">{emptyText}</span>;
  const place = [site.address, site.city, 'Sonora'].filter(Boolean).join(', ');
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.name}, ${place}`)}`;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-medium text-gray-900">{site.name}</span>
      {site.institution?.name && <span className="text-sm text-gray-600">{site.institution.name}</span>}
      <span className="text-sm text-gray-600">{place}</span>
      <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="mt-1 text-sm text-indigo-700 underline">
        Ver en el mapa
      </a>
    </div>
  );
}

export default SiteInfo;
