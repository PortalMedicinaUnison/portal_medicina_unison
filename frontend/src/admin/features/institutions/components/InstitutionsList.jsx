import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useGetInstitutions from '../hooks/useGetInstitutions';
import useDeleteInstitution from '../hooks/useDeleteInstitution';
import DropdownMenu from '../../../../utils/ui/DropdownMenu';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';


function InstitutionsList() {
  const navigate = useNavigate();
  const { institutions, loading: listLoading, error: listError, refetch } = useGetInstitutions();
  const { deleteInstitution, loading: deleting, success: deleteSuccess, error: deleteError } = useDeleteInstitution();

  const [search, setSearch] = useState('');

  const searchQuery = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    return institutions.filter((institution) => {
      if (!searchQuery) return true;
      return (
        String(institution.institution_id).includes(searchQuery) ||
        (institution.name && institution.name.toLowerCase().includes(searchQuery))
      );
    });
  }, [institutions, searchQuery]);

  const handleViewButton = (id) => {
    navigate(adminAbs(ROUTES.ADMIN.INSTITUTION_DETAIL(id)));
  };

  const handleEditButton = (id) => {
    navigate(adminAbs(ROUTES.ADMIN.INSTITUTION_EDIT(id)));
  };

  const handleDeleteButton = async (id) => {
    const userConfirmation = window.confirm('Esta institución se eliminará. ¿Deseas continuar?');
    if (!userConfirmation) return;
    await deleteInstitution(id);
    await refetch();
  };

  if (listLoading) return <LoadingSpinner />;
  if (listError) return <p>Error es: {String(listError)}</p>;

  return (
    <div className="table-container">
      <div className="table-container-actions">
          <input
            type="text"
            className="form-input--sm mr-auto"
            placeholder="Buscar institución"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar institución"
          />
      </div>

      <div className="table-container-body">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.institution_id}>
                <td>{item.name}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="text-right">
                  <DropdownMenu actions={
                    [
                      { label: 'Ver', onClick: () => handleViewButton(item.institution_id) },
                      { label: 'Editar', onClick: () => handleEditButton(item.institution_id) },
                      { label: 'Eliminar', onClick: () => handleDeleteButton(item.institution_id), className: 'text-red-600' },
                    ]
                  } />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InstitutionsList;
