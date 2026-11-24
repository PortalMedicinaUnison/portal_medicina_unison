// Fila del formulario de sede: para qué programas ofrece cupos (al menos uno).
function SiteProgramsField({ forInternship, forSocialService, onChange, disabled }) {
  return (
    <div className="item-row">
      <dt className="item-header">Ofrece cupos para *</dt>
      <dd className="item-text">
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="forInternship" className="h-4 w-4" checked={forInternship} onChange={onChange} disabled={disabled} />
            Internado
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="forSocialService" className="h-4 w-4" checked={forSocialService} onChange={onChange} disabled={disabled} />
            Servicio social
          </label>
        </div>
        <p className="mt-1 text-xs text-gray-500">Al capturar los cupos de una promoción solo aparecen las sedes de su programa.</p>
      </dd>
    </div>
  );
}

export default SiteProgramsField;
