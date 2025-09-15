import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../api';
import { ROUTES, adminAbs } from '../../../../config.js';

function AnnouncementsList() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('available');
    const [announcements, setAnnouncements] = useState([]);
    const navigate = useNavigate();

    const getAnnouncements = async () => {
        try {
            const response = await api.get("/announcements/");
            setAnnouncements(response.data);
            console.log("Announcements loaded successfully", response.data);
        } catch (error) {
            console.error("Error loading announcements", error);
        }
    };
    
    useEffect(() => {
        getAnnouncements();
    }, []);
    
    const handleViewButton = (announcementId) => {
        navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENT_DETAIL(announcementId)));
    };
    
    const handleEditButton = (announcementId) => {
        console.log('Edit announcement:', announcementId);
    };
    
    const handleDeleteButton = (announcementId) => {
        const deleteAnnouncement = async () => {
            try {
                // Se usa 'announcement_id' para la URL
                await api.delete(`/announcements/${announcementId}`);
                await getAnnouncements();
            } catch (error) {
                console.error("Delete failed", error);
            }
        };

        const userConfirmed = confirm('Este anuncio se eliminará. ¿Deseas continuar?');
        if (userConfirmed) {
            deleteAnnouncement();
        }
    };

    // Función para mostrar el tipo de anuncio de forma legible
    const getAnnouncementTypeName = (typeEnum) => {
        return typeEnum === 1 ? 'General' : 'Pasantía';
    };

    return (
        <div className="table-container">
            <div className="table-container-actions">
                <input className='form-input--sm'
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Buscar por título o descripción'
                />
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Descripción</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {announcements.filter((announcement) => {
    					return (announcement.title.toLowerCase().includes(search.toLowerCase()) ||
                            announcement.description.toLowerCase().includes(search.toLowerCase()))
                            })
                        .map((announcement) => (
                            <tr key={announcement.announcement_id}>
                                <td>{announcement.title}</td>
                                <td>{announcement.description}</td>
 <td>{getAnnouncementTypeName(announcement.announcement_type)}</td>
                               <td>
                                <button className='item-link' onClick={e => handleViewButton(announcement.announcement_id)}>
                                    Ver
                                </button>
                            </td>
                            <td>
                                <button className='item-link' onClick={e => handleEditButton(announcement.announcement_id)}>
                                    Editar
                                </button>
                            </td>
                            {(statusFilter != 'unavailable') && (
                                <td>
                                    <button className='table-action' onClick={e => handleDeleteButton(announcement.announcement_id)}>
                                        Borrar
                                    </button>
                                </td>
                            )}
                        </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}

export default AnnouncementsList;
