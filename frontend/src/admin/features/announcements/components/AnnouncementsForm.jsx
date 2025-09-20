// AnnouncementsForm.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useCreateAnnouncement from '../hooks/useCreateAnnouncement';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';


const form = {
    title: '',
    description: '',
    announcement_type: 0,
    is_visible: true,
};

function AnnouncementForm() {
    const navigate = useNavigate();
    const { createAnnouncement, loading: saving, success: saved, error: saveError, reset } = useCreateAnnouncement();

    const [formData, setFormData] = useState(form);
    const [validationError, setValidationError] = useState('');

// ---------------------- HANDLERS ----------------------

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (validationError) return setValidationError('');
            
    }, [validationError]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            ...formData,
            announcement_type: Number(formData.announcement_type),
        };

        if (data.announcement_type === 0) {
            setValidationError('Seleccione un tipo de anuncio válido.');
            return;
        }

        setValidationError('');
        
        await createAnnouncement(data);
    };
// ---------------------- EFFECTS ----------------------

    useEffect(() => {
        if (saved) {
            const redirectTimeout = setTimeout(() => {
                setFormData(form);
                reset();
                navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENTS_LIST));
            }, 1500);
            return () => clearTimeout(redirectTimeout);
        }
    }, [saved, navigate, reset]);

// ---------------------- LOADING & ERROR STATES ----------------------

    
// ---------------------- RENDER ----------------------

    return (
        <form className="component-container" onSubmit={handleSubmit}>
            {saved && (
                <div className="alert-success">
                    Anuncio registrado exitosamente.
                </div>
            )}

            {(validationError || saveError) && (

                <div className="alert-error">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">
                        {validationError || saveError}
                    </span>
                </div>
            )}

            <div className="info-container">
                <div className="item-container">
                    <dl className="item-list">
                        <div className="item-row">
                            <dt className="item-header">Título</dt>
                            <dd className="item-text">
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="form-input--half"
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
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className="form-input--half"
                                    placeholder="Descripción"
                                    disabled={saving}
                                    required
                                />
                            </dd>
                        </div>
                        <div className="item-row">
                            <dt className="item-header">Ambito</dt>
                            <dd className="item-text">
                                <select
                                    name="announcement_type"
                                    value={formData.announcement_type}
                                    onChange={handleChange}
                                    className="form-input--half"
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
                                    type="checkbox"
                                    name="is_visible"
                                    checked={formData.is_visible}
                                    onChange={handleChange}
                                    className="form-checkbox"
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
                        disabled={saving}
                    >
                        {saving ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default AnnouncementForm;