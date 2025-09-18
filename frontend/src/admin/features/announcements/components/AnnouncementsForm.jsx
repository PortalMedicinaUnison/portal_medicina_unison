import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import { useUser } from '../../../../contexts/UserContext';
import useCreateAnnouncement from '../hooks/useCreateAnnouncement';


function AnnouncementForm() {
    const navigate = useNavigate();
    const { user, loading: userLoading, error: userError } = useUser();
    const { createAnnouncement, loading: saving, error: saveError, success } = useCreateAnnouncement();

    const form = {
        title: '',
        description: '',
        announcement_type: 0,
        is_visible: true,
    }

    const [formData, setFormData] = useState(form);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) return;
        
        try {
            await createAnnouncement({
                ...formData,
                created_by: user.user_id,
        });
            setFormData(form);
            navigate(adminAbs(ROUTES.ADMIN.PROMOTION_LIST));
        } catch (err) {   
            console.error('Error creating announcement:', err);
        }
    };
    
    return (
        <form className="component-container" onSubmit={handleSubmit}>
            {success && (
                <div className="alert-success-text">
                    Anuncio registrado exitosamente.
                </div>
            )}

            {(saveError || userError) && (
                <div className="alert-footer-text">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{saveError || userError}</span>
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
                                    disabled={saving}
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
                                    disabled={saving}
                                    required
                                />
                            </dd>
                        </div>
                        <div className="item-row">
                            <dt className="item-header">Alcance del anuncio</dt>
                            <dd className="item-text">
                                <select
                                    className="form-input--half"
                                    name="announcement_type"
                                    value={formData.announcement_type}
                                    onChange={handleChange}
                                    disabled={saving}
                                    required
                                >
                                    <option value={0}>Seleccione un tipo</option>
                                    <option value={1}>General</option>
                                    <option value={2}>Internship</option>
                                </select>
                            </dd>
                        </div>
                        <div className="item-row">
                            <dt className="item-header">Visible</dt>
                            <dd className="item-text">
                                <input
                                    className="form-checkbox"
                                    name="is_visible"
                                    type="checkbox"
                                    checked={formData.is_visible}
                                    onChange={handleChange}
                                    disabled={saving}
                                />
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="button-group">
                    <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={() => navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENTS_LIST))}
                        disabled={saving}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="btn-primary"
                    >
                        {saving ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default AnnouncementForm;
