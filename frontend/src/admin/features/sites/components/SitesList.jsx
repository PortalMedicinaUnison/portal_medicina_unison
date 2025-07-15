import { useState, useEffect } from 'react';
import api from '../../../../api';

function SitesList() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('active');
    const [sites, setSites] = useState([]);

    const getSites = async () => {
        try {
            const response = await api.get("/sites/");
            setSites(response.data);
        } catch (error) {
            console.error("Edit failed", error);
        }
    };
    
    useEffect(() => {
        getSites();
    }, []);
    
    
    const handleEditButton = (e) => {
        // getSites();
        console.log(statusFilter);
    };
    
    const handleDeleteButton = (siteId) => {
        const deleteUser = async () => {
            try {
                const response = await api.delete(`/sites/${siteId}`);
                await getSites();
            } catch (error) {
                console.error("Delete failed", error);
            }
        };

        const userConfirmed = confirm('El estado de este usuario se establecerá como inactivo. ¿Deseas continuar?');
        if (userConfirmed) {
            deleteUser();
        }
    };

    return (
        <div className="table-container">
            <div className="table-container-actions">
                <input className='form-input--sm'
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Buscar usuario'
                />
            

                <select id="status" 
                    className='btn-tertiary' 
                    onChange={(e) => setStatusFilter(e.target.value)}>
                        
                        <option value="all">Todos</option>
                        <option value="active" selected>Activo</option>
                        <option value="inactive">Inactivo</option>
                </select>
            </div>

            <div className='table-container-body'>
            <table className='table'>
                <thead class="text-xs text-gray-700 bg-gray-50 ">
                    <tr>
                        <th>Expediente</th>
                        <th>Nombre</th>
                        <th>Apellido(s)</th>
                        <th>Correo</th>
                        <th>Estatus</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                
                <tbody>
                    {sites.filter((item) => {
                        return (search.toLowerCase() === '' 
                            || item.last_name.toLowerCase().includes(search.toLowerCase())
                            || item.second_last_name.toLowerCase().includes(search.toLowerCase())
                            || item.first_name.toLowerCase().includes(search.toLowerCase())
                            || String(item.academic_id).includes(search))
                            // && (statusFilter == 'all');
                            && (statusFilter == 'all' ? item : (statusFilter == 'active') ? item.is_active : !item.is_active);
                    }).map((item) => (
                        <tr>
                            <td>{item.academic_id}</td>
                            <td>{item.first_name}</td>
                            <td>{item.last_name} {item.second_last_name}</td>
                            <td>{item.email}</td>
                            <td>{(item.is_active) ? 'Activo' : 'Inactivo'}</td>
                            <td><button className='item-link' onClick={e => handleEditButton(item.user_id)}>Editar</button></td>
                            {(statusFilter != 'inactive') && (<td><button className='table-action' onClick={e => handleDeleteButton(item.user_id)}>Borrar</button></td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
}

export default SitesList;
