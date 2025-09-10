import { useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import useCreateAnnouncement from '../hooks/useCreateAnnouncement';
import useGetAnnouncements from '../hooks/useGetAnnouncements';
import { ROUTES, adminAbs } from '../../../../config.js';

function AnnouncementForm() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        announcement_type: 0,
        created_by: user?.id || 1,
    })
    
    const getUser = async () => {
        try {
            const response = await fetch('/api/user/');
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user", error);
        }
    }
    
    const { createAnnouncement, error, success } = useCreateAnnouncement();
    const { announcements, loading: announcementsLoading, error: announcementsError } = useGetAnnouncements();
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Copiamos formData y convertimos announcement_type a número
        const payload = {
            ...formData,
            announcement_type: Number(formData.announcement_type)
        };

        const isCreated = await createAnnouncement(payload);
        if (isCreated) {
            console.log('Anuncio registrado exitosamente');

            setFormData({
                title: '',
                description: '',
                announcement_type: 0,
                created_by: user?.id || 1,
            });

            navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENTS_LIST));
        }
    };
    
    return (
        <form className="component-container" onSubmit={handleSubmit}>

            {success && (
                <div className="alert-success-text">
                    Anuncio registrado exitosamente.
                </div>
            )}

            {error && (
                <div className="alert-footer-text">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="info-container">
                
                <div className="item-container">
                    <dl className="item-list">
                        <div className="item-row">
                            <dt className="item-header">Título</dt>
                            <dd className="item-text">
                                <input
                                    className="form-input--half"
                                    name="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Título del anuncio"
                                    required
                                />
                            </dd>
                        </div>

                        <div className="item-row">
                            <dt className="item-header">Contenido</dt>
                            <dd className="item-text">
                                <textarea
                                    className="form-input--half"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Contenido del anuncio"
                                    rows="4"
                                    required
                                />
                            </dd>
                        </div>
                        <div className="item-row">
                            <dt className="item-header">Tipo de anuncio</dt>
                            <dd className="item-text">
                                <select
                                    className="form-input--half"
                                    name="announcement_type"
                                    value={formData.announcement_type}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value={0}>Seleccione un tipo</option>
                                    <option value={1}>General</option>
                                    <option value={2}>Internship</option>
                                </select>
                            </dd>
                        </div>

                    </dl>
                </div>

                <div className="button-group">
                    <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={() => navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENTS_LIST))}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="btn-primary"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </form>
    );
}

export default AnnouncementForm;
