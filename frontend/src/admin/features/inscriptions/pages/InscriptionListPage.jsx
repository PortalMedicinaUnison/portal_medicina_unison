import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import { formatFullName, normalizeText, promotionLabel } from '../../../../utils/utils';
import { INSCRIPTION_PROGRAMS, documentsState, formatAverage, inscriptionStatus, statusFilterOptions } from '../programs';
import usePromotionPicker from '../hooks/usePromotionPicker';
import useInscriptions from '../hooks/useInscriptions';
import AssignStudentsDialog from '../components/AssignStudentsDialog';
import DocumentsStatus from '../components/DocumentsStatus';

const sortKey = (student) => normalizeText([student?.last_name, student?.second_last_name, student?.first_name].filter(Boolean).join(' '));

/**
 * Inscripciones de un programa por promoción: estatus (asignación + internado/servicio social),
 * documentos y sede en una sola tabla, con asignación en bloque y acceso a los resultados del acto.
 */
function InscriptionListPage({ program }) {
  const config = INSCRIPTION_PROGRAMS[program];
  const navigate = useNavigate();
  const { promotions, promotion, promotionId, selectPromotion, loading: loadingPromotions, error: promotionsError } = usePromotionPicker(program);
  const { inscriptions, loading, error, reload } = useInscriptions(program, promotionId);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [documents, setDocuments] = useState('');
  const [site, setSite] = useState('');
  const [assignKey, setAssignKey] = useState(0);
  const [assignOpen, setAssignOpen] = useState(false);

  const record = (application) => application[config.recordKey];

  const siteOptions = useMemo(() => {
    const map = new Map();
    inscriptions.forEach((a) => {
      const s = record(a)?.site;
      if (s) map.set(String(s.site_id), s.name);
    });
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inscriptions]);

  const rows = useMemo(() => {
    const term = normalizeText(search.trim());
    return inscriptions
      .filter((a) => !term || normalizeText(`${formatFullName(a.student)} ${a.academic_id} ${a.student?.email ?? ''}`).includes(term))
      .filter((a) => !status || inscriptionStatus(a, config).key === status)
      .filter((a) => !documents || documentsState(a.inscription_progress) === documents)
      .filter((a) => {
        if (!site) return true;
        const current = record(a)?.site_id;
        return site === 'none' ? current == null : String(current) === site;
      })
      .sort((a, b) => sortKey(a.student).localeCompare(sortKey(b.student)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inscriptions, search, status, documents, site, config]);

  const actions = promotion && (
    <div className="flex flex-wrap gap-3">
      <Link to={`${config.plazaResultsPath}?promotion_id=${promotion.promotion_id}`} className="btn-secondary">
        Resultados del acto
      </Link>
      <button
        type="button"
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => { setAssignKey((k) => k + 1); setAssignOpen(true); }}
        disabled={promotion.is_finished}
        title={promotion.is_finished ? 'La promoción está finalizada' : undefined}
      >
        Asignar alumnos
      </button>
    </div>
  );

  return (
    <Layout>
      <PageLayout title={`Inscripciones · ${config.name}`} actions={actions}>
        {loadingPromotions && <LoadingSpinner />}
        {!loadingPromotions && promotionsError && <DataLoadError title="No se pudieron cargar las promociones" message={promotionsError} />}
        {!loadingPromotions && !promotionsError && promotions.length === 0 && (
          <p className="text-sm text-gray-600">Aún no hay promociones de {config.name.toLowerCase()}. Créalas en Promociones.</p>
        )}

        {promotion && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="form-label" htmlFor="inscriptions-promotion">Promoción</label>
                <select id="inscriptions-promotion" className="form-input" value={promotionId ?? ''}
                  onChange={(e) => selectPromotion(Number(e.target.value))}>
                  {promotions.map((p) => (
                    <option key={p.promotion_id} value={p.promotion_id}>
                      {promotionLabel(p)}{p.is_finished ? ' (finalizada)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-56 flex-1">
                <label className="form-label" htmlFor="inscriptions-search">Buscar</label>
                <input id="inscriptions-search" type="search" className="form-input_full" placeholder="Nombre, expediente o correo"
                  value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div>
                <label className="form-label" htmlFor="inscriptions-status">Estatus</label>
                <select id="inscriptions-status" className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="">Todos</option>
                  {statusFilterOptions(config).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="inscriptions-documents">Documentos</label>
                <select id="inscriptions-documents" className="form-input" value={documents} onChange={(e) => setDocuments(e.target.value)}>
                  <option value="">Todos</option>
                  <option value="missing">Faltan por subir</option>
                  <option value="review">Por revisar</option>
                  <option value="complete">Completos</option>
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="inscriptions-site">{config.placeLabel}</label>
                <select id="inscriptions-site" className="form-input" value={site} onChange={(e) => setSite(e.target.value)}>
                  <option value="">Todas</option>
                  <option value="none">Sin {config.placeLabel.toLowerCase()}</option>
                  {siteOptions.map(([value, name]) => <option key={value} value={value}>{name}</option>)}
                </select>
              </div>
            </div>

            {loading && <LoadingSpinner />}
            {!loading && error && <DataLoadError title="No se pudieron cargar las inscripciones" message={error} onRetry={reload} />}
            {!loading && !error && (
              <div className="table-container">
                <p className="mb-2 text-xs text-gray-500">{rows.length} de {inscriptions.length} inscripciones</p>
                <table className="table">
                  <thead>
                    <tr>
                      <th className="w-28">Expediente</th>
                      <th className="text-left">Alumno</th>
                      <th className="w-28">Promedio</th>
                      <th className="w-32">Estatus</th>
                      <th className="w-40">Documentos</th>
                      <th>{config.placeLabel}</th>
                      <th className="w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 && (
                      <tr><td colSpan={7} className="py-6 text-center text-gray-500">
                        {inscriptions.length === 0 ? 'Nadie está asignado a esta promoción todavía.' : 'Ninguna inscripción coincide con los filtros.'}
                      </td></tr>
                    )}
                    {rows.map((a) => (
                      <tr key={a.application_id} className="cursor-pointer hover:bg-gray-50" onClick={() => navigate(config.detailPath(a.application_id))}>
                        <td className="font-mono">{a.academic_id}</td>
                        <td className="text-left">{formatFullName(a.student) || 'Sin datos del alumno'}</td>
                        <td>{formatAverage(a.average)}</td>
                        <td>{inscriptionStatus(a, config).label}</td>
                        <td><DocumentsStatus progress={a.inscription_progress} /></td>
                        <td>{record(a)?.site?.name ?? <span className="text-gray-400">—</span>}</td>
                        <td className="text-right">
                          <Link to={config.detailPath(a.application_id)} className="btn-tertiary text-sm" onClick={(e) => e.stopPropagation()}>Ver</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {assignOpen && promotion && (
          <AssignStudentsDialog
            key={assignKey}
            config={config}
            promotion={promotion}
            onClose={() => setAssignOpen(false)}
            onAssigned={reload}
          />
        )}
      </PageLayout>
    </Layout>
  );
}

export default InscriptionListPage;
