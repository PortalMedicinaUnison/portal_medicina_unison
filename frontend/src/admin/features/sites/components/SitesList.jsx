import { useState, useEffect } from 'react';
import api from '../../../../api';

function SitesList() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('available');
    const [sites, setSites] = useState([]);

    const getSites = async () => {
        try {
            const response = await api.get("/sites/");
            setSites(response.data);
        } catch (error) {
            console.error("Error loading sites", error);
        }
    };
    
    useEffect(() => {
        getSites();
    }, []);
    
    
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

        const userConfirmed = confirm('Este sitio se marcará como no disponible. ¿Deseas continuar?');
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
                        <th>Ciudad</th>
                        <th>Dirección</th>
                        <th>Capacidad</th>
                        <th>Responsable</th>
                        <th>Estado</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                
                <tbody>
                    {sites.filter((item) => {
                        return (search.toLowerCase() === '' 
                            || item.name.toLowerCase().includes(search.toLowerCase())
                            || item.city.toLowerCase().includes(search.toLowerCase())
                            || item.address.toLowerCase().includes(search.toLowerCase())
                            || item.teaching_head_name.toLowerCase().includes(search.toLowerCase())
                            || String(item.id).includes(search))
                            && (statusFilter == 'all' ? item : (statusFilter == 'available') ? item.is_available : !item.is_available);
                    }).map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.city}</td>
                            <td>{item.address}</td>
                            <td>{item.capacity}</td>
                            <td>{item.teaching_head_name}</td>
                            <td>{(item.is_available) ? 'Disponible' : 'No disponible'}</td>
                            <td><button className='item-link' onClick={e => handleEditButton(item.id)}>Editar</button></td>
                            {(statusFilter != 'unavailable') && (<td><button className='table-action' onClick={e => handleDeleteButton(item.id)}>Borrar</button></td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
}

export default SitesList;