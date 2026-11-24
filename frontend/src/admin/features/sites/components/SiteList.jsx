import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config.js';
import useDeleteSite from '../hooks/useDeleteSite.js';
import useGetInstitutions from "../../institutions/hooks/useGetInstitutions.js";
import DropdownMenu from '../../../../utils/ui/DropdownMenu.jsx';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner.jsx';
import DataLoadError from '../../../../utils/ui/DataLoadError.jsx';
import Modal from '../../../../utils/ui/Modal.jsx';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent.jsx';
import { PROGRAMS, PROGRAM_LABELS, SONORA_MUNICIPALITIES } from "../../../../utils/constants.js";
import { normalizeText } from '../../../../utils/utils.js';
import { siteProgramsLabel } from '../sitePrograms.js';

const SERVES = {
  [PROGRAMS.INTERNSHIP]: (site) => site.for_internship,
  [PROGRAMS.SOCIAL_SERVICE]: (site) => site.for_social_service,
};


function SiteList({ sites, fetching, fetchError, refetch }) {
  const navigate = useNavigate();
  const { deleteSite, loading: deleting, success: deleted,  error: deleteError, reset } = useDeleteSite();
  const { institutions, loading: fetchingInstitutions, error: institutionsError } = useGetInstitutions();

  const [item, setItem] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- FILTERS AND SEARCH ----------------------

  const [search, setSearch] = useState('');
  const [institutionFilter, setInstitutionFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [programFilter, setProgramFilter] = useState('');

  const searchQuery = normalizeText(search.trim());
  const filtered = useMemo(() => {
    return sites.filter((site) => {
      if (institutionFilter !== '' && site.institution_id !== Number(institutionFilter)) return false;
      if (cityFilter !== '' && site.city !== cityFilter) return false;
      if (programFilter !== '' && !SERVES[programFilter](site)) return false;
      if (!searchQuery) return true;

      const name = normalizeText(site.name);
      const teachingHeadName = normalizeText(site.teaching_head_name);
      const institutionName = normalizeText(site.institution?.name);
      return name.includes(searchQuery) || teachingHeadName.includes(searchQuery) || institutionName.includes(searchQuery);
    });
  }, [sites, searchQuery, institutionFilter, cityFilter, programFilter]);

// ---------------------- HANDLERS ----------------------

  const handleViewButton = (id) => navigate(adminAbs(ROUTES.ADMIN.SITE_DETAIL(id)));
  const handleEditButton = (id) => navigate(adminAbs(ROUTES.ADMIN.SITE_EDIT(id)));
  const handleDeleteButton = (id) => {
    setItem(id)
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (item == null) return
    await deleteSite(item);
  };

  const handleCloseConfirm = () => {
    setShowConfirmDelete(false);
    setItem(null);
  }

  const handleCloseError = () => {
    setShowErrorDialog(false);
    reset();
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (deleted) {
      setShowConfirmDelete(false);
      setItem(null);
      refetch();
      reset();
    }
  }, [deleted, refetch, reset]);

  useEffect(() => {
    if (deleteError) {
      setShowConfirmDelete(false);
      setShowErrorDialog(true);
    }
  }, [deleteError]);

  // ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner />;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar la sede"
        message="Intenta recargar la página."
        details={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

  if (!sites) {
    return (
      <DataLoadError
        title="404"
        titleClassName="text-5xl"
        message="No se encontraron sedes."
        onRetry={refetch}
        retryLabel='Recargar'
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }


  // ---------------------- RENDER ----------------------
  return (
    <div className="table-container">
      <div className="table-container-actions">
        <input
          type="text"
          className="form-input--sm mr-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por razón social, institución o jefe"
          aria-label="Buscar por razón social, institución o jefe"
        />
        <select
          className="btn-tertiary--light"
          value={institutionFilter}
          onChange={(e) => setInstitutionFilter(e.target.value)}
          aria-label="Filtrar por institución"
          disabled={fetchingInstitutions || Boolean(institutionsError)}
        >
        <option value="">Institución</option>
        {institutions.map(institution => (
          <option key={institution.institution_id} value={institution.institution_id}>
            {institution.name}
          </option>
        ))}
        </select>
        <select
          className="btn-tertiary--light"
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
          aria-label="Filtrar por programa"
        >
          <option value="">Programa</option>
          {Object.entries(PROGRAM_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select
          className="btn-tertiary--light"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          aria-label="Filtrar por ciudad"
        >
          <option value="">Municipio</option>
          {SONORA_MUNICIPALITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              <th className='w-3/12'>Razón social</th>
              <th className='w-2/12'>Institución</th>
              <th className='w-2/12'>Ciudad</th>
              <th className='w-2/12'>Programas</th>
              <th className='w-2/12'>Jefe de enseñanza</th>
              <th className='w-1/12'></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                {search || institutionFilter || cityFilter || programFilter 
                  ? 'No se encontraron sedes que coincidan con los filtros.' 
                  : 'No hay sedes disponibles.'
                  }
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
              <tr key={item.site_id}>
                <td className="!whitespace-normal text-left">{item.name}</td>
                <td className="!whitespace-normal text-left">{item.institution?.name ?? '—'}</td>
                <td className="!whitespace-normal">{item.city}</td>
                <td className="!whitespace-normal">{siteProgramsLabel(item)}</td>
                <td className="!whitespace-normal text-left">{item.teaching_head_name}</td>
                <td className="relative overflow-visible text-right">
                  <DropdownMenu
                    actions={[
                      { label: 'Ver', onClick: () => handleViewButton(item.site_id) },
                      { label: 'Editar', onClick: () => handleEditButton(item.site_id) },
                      { label: 'Eliminar', onClick: () => handleDeleteButton(item.site_id), className: 'text-red-600' },
                    ]}
                    disabled={deleting}
                  />
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={showConfirmDelete} onClose={handleCloseConfirm}>
        <ConfirmDialogContent
          title="Confirmar eliminación"
          message="Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar?"
          onConfirm={handleConfirmDelete}
          primaryLabel="Eliminar"
          secondaryLabel="Cancelar"
          onCancel={handleCloseConfirm}
          danger
        />
      </Modal>

      <Modal open={showErrorDialog} onClose={handleCloseError}>
        <ConfirmDialogContent
          title="Ops... Ha ocurrido un error"
          message={deleteError || 'Ocurrió un problema al eliminar el registro.'}
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>
    </div>
  );
}

export default SiteList;