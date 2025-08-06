import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../api';
import { ROUTES, adminAbs } from '../../../../config.js';


function SitesList() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('available');
    const [sites, setSites] = useState([]);
    const navigate = useNavigate();


    const getSites = async () => {
        try {
            const response = await api.get("/sites/");
            setSites(response.data);
            console.log("Sites loaded successfully", response.data);
        } catch (error) {
            console.error("Error loading sites", error);
        }
    };
    
    useEffect(() => {
        getSites();
    }, []);
    
    const handleViewButton = (siteId) => {
        navigate(adminAbs(ROUTES.ADMIN.SITE_INFO(siteId)));
    };
    
    const handleEditButton = (siteId) => {
        console.log('Edit site:', siteId);
    };
    
    const handleDeleteButton = (siteId) => {
        const deleteSite = async () => {
            try {
                const response = await api.delete(`/sites/${siteId}`);
                await getSites();
            } catch (error) {
                console.error("Delete failed", error);
            }
        };

        const userConfirmed = confirm('Este sitio se eliminará. ¿Deseas continuar?');
        if (userConfirmed) {
            deleteSite();
        }
    };

    return (
        <div className="table-container">
            <div className="table-container-actions">
                <input className='form-input--sm'
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Buscar sitio'
                />
            
                <select id="status" 
                    className='btn-tertiary' 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}>
                        
                        <option value="all">Todos</option>
                        <option value="available">Disponible</option>
                        <option value="unavailable">No disponible</option>
                </select>
            </div>

            <div className='table-container-body'>
            <table className='table'>
                <thead className="text-xs text-gray-700 bg-gray-50 ">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Institución</th>
                        <th>Ciudad</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                
                <tbody>
                    {sites.filter((item) => {
                        return (search.toLowerCase() === '' 
                            || item.name.toLowerCase().includes(search.toLowerCase())
                            || item.institution_name.toLowerCase().includes(search.toLowerCase())
                            || String(item.id).includes(search))
                            && (statusFilter == 'all' ? item : (statusFilter == 'available') ? item.is_available : !item.is_available);
                    }).map((item) => (
                        <tr key={item.site_id}>
                            <td>{item.site_id}</td>
                            <td>{item.name}</td>
                            <td>{item.institution_name}</td>
                            <td>{item.city}</td>
                            <td>
                                <button className='item-link' onClick={e => handleViewButton(item.site_id)}>
                                    Ver
                                </button>
                            </td>
                            <td>
                                <button className='item-link' onClick={e => handleEditButton(item.site_id)}>
                                    Editar
                                </button>
                            </td>
                            {(statusFilter != 'unavailable') && (
                                <td>
                                    <button className='table-action' onClick={e => handleDeleteButton(item.site_id)}>
                                        Borrar
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
}

export default SitesList;