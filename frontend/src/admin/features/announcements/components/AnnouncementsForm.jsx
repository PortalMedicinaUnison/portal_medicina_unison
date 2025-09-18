import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useCreateAnnouncement from '../hooks/useCreateAnnouncement';

function AnnouncementForm() {
    const navigate = useNavigate();
    const { createAnnouncement, loading, error, success } = useCreateAnnouncement();

    form = {
        title: '',
        description: '',
        announcement_type: 0,
        created_by: '',
    }

    const [formData, setFormData] = useState(formData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createAnnouncement(formData);
            setFormData(form);
            navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENTS_LIST));
        } catch (error) {   
            console.error('Error creating announcement:', error);
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
                                    placeholder="Título"
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
                                    placeholder="Descripción"
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
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="btn-primary"
                    >
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default AnnouncementForm;
