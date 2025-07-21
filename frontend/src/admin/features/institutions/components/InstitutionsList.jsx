import { useState, useEffect } from 'react';
import api from '../../../../api';

function InstitutionsList() {
    const [search, setSearch] = useState('');
    const [institutions, setInstitutions] = useState([]);

    const getInstitutions = async () => {
        try {
            const response = await api.get("/institutions/");
            setInstitutions(response.data);
        } catch (error) {
            console.error("Error loading institutions", error);
        }
    };
    
    useEffect(() => {
        getInstitutions();
    }, []);
    
    
    const handleEditButton = (institutionId) => {
        // Navigate to edit page or open edit modal
        console.log('Edit institution:', institutionId);
        // You might want to navigate or open a modal here
    };
    
    const handleDeleteButton = (institutionId) => {
        const deleteInstitution = async () => {
            try {
                const response = await api.delete(`/institutions/${institutionId}`);
                await getInstitutions();
            } catch (error) {
                console.error("Delete failed", error);
            }
        };

        const userConfirmed = confirm('Esta institución será eliminada. ¿Deseas continuar?');
        if (userConfirmed) {
            deleteInstitution();
        }
    };

    return (
        <div className="table-container">
            <div className="table-container-actions">
                <input className='form-input--sm'
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Buscar institución'
                />
            </div>

            <div className='table-container-body'>
            <table className='table'>
                <thead className="text-xs text-gray-700 bg-gray-50 ">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                
                <tbody>
                    {institutions.filter((item) => {
                        return (search.toLowerCase() === '' 
                            || item.name.toLowerCase().includes(search.toLowerCase())
                            || String(item.id).includes(search));
                    }).map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td><button className='item-link' onClick={e => handleEditButton(item.id)}>Editar</button></td>
                            <td><button className='table-action' onClick={e => handleDeleteButton(item.id)}>Borrar</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
}

export default InstitutionsList;