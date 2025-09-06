import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAdminReport } from '../hooks/useAdminReport';
import { addAdminCommentRequest, updateReportAdminRequest } from '../../../../services/reportService';
import { ROUTES, adminAbs } from '../../../../config';

function ReportInfo() {
    const { reportId } = useParams();
    const navigate = useNavigate();
    const { report, loading, error, refetch } = useAdminReport(parseInt(reportId));
    const [adminComment, setAdminComment] = useState('');
    const [closeReport, setCloseReport] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentError, setCommentError] = useState('');

    const getReportTypeLabel = (type) => {
        const types = {
            1: 'Incidente',
            2: 'Sugerencia', 
            3: 'Queja',
            4: 'Otro'
        };
        return types[type] || 'Desconocido';
    };

    const getStatusText = (isActive, isOpen) => {
        if (!isActive) {
            return "Inactivo";
        }
        if (isOpen) {
            return "Abierto";
        }
        return "Cerrado";
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleAddComment = async () => {
        // Si se está intentando cerrar el reporte
        if (closeReport) {
            // Verificar si hay un comentario nuevo o si ya existe un comentario previo
            const hasNewComment = adminComment.trim() !== '';
            const hasExistingComment = report.admin_comment && report.admin_comment !== "Aun no hay comentarios";
            
            // Si no hay comentario nuevo ni comentario previo, mostrar error
            if (!hasNewComment && !hasExistingComment) {
                setCommentError('No puedes cerrar un reporte sin un comentario');
                return;
            }
        }
        
        // Si no hay comentario nuevo y no se cambia el estado, no hacer nada
        if (!adminComment.trim() && !closeReport) {
            return;
        }

        // Si hay un comentario nuevo, procesarlo
        if (adminComment.trim()) {
            setCommentLoading(true);
            setCommentError('');

            try {
                // Enviamos el comentario
                await addAdminCommentRequest(reportId, adminComment, closeReport);
                
                setAdminComment('');
                setCloseReport(false);
                refetch(); // Recargar el reporte para mostrar el nuevo comentario
            } catch (error) {
                setCommentError('Error al guardar los cambios. Por favor, intente nuevamente.');
            } finally {
                setCommentLoading(false);
            }
        } else if (closeReport) {
            // Si solo se está cerrando el reporte y ya hay un comentario previo
            // (Ya validamos que existe un comentario en la primera condición)
            setCommentLoading(true);
            setCommentError('');

            try {
                // Solo actualizamos el estado del reporte
                await updateReportAdminRequest(reportId, { is_open: false });
                
                setCloseReport(false);
                refetch(); // Recargar el reporte para mostrar el cambio
            } catch (error) {
                setCommentError('Error al cerrar el reporte. Por favor, intente nuevamente.');
            } finally {
                setCommentLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <span className="text-gray-500">Cargando información del reporte...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">
                    <h3>Error al cargar el reporte</h3>
                    <p>{error}</p>
                    <button 
                        className="btn-primary" 
                        onClick={() => navigate(adminAbs(ROUTES.ADMIN.REPORT_LIST))}
                    >
                        Volver a la lista
                    </button>
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="text-center py-8">
                <span className="text-gray-500">Reporte no encontrado</span>
            </div>
        );
    }

    return (
        <div className="info-container">
            <div className="item-container">
                <dl className="item-list">
                    <div className="item-row">
                        <dt className="item-header">ID del reporte</dt>
                        <dd className="item-text">{report.report_id}</dd>
                    </div>

                    <div className="item-row">
                        <dt className="item-header">Estudiante</dt>
                        <dd className="item-text">
                            {report.anonymity ? "Anónimo" : report.student_id}
                        </dd>
                    </div>

                    <div className="item-row">
                        <dt className="item-header">Estado</dt>
                        <dd className="item-text">
                            {getStatusText(report.is_active, report.is_open)}
                        </dd>
                    </div>

                    <div className="item-row">
                        <dt className="item-header">Tipo de reporte</dt>
                        <dd className="item-text">
                            <span className="font-medium">
                                {getReportTypeLabel(report.report_type)}
                            </span>
                            {report.other_type && (
                                <div className="text-sm text-gray-600 mt-1">
                                    Tipo personalizado: {report.other_type}
                                </div>
                            )}
                        </dd>
                    </div>

                    <div className="item-row">
                        <dt className="item-header">Fecha del reporte</dt>
                        <dd className="item-text">{formatDate(report.date_report)}</dd>
                    </div>

                    <div className="item-row">
                        <dt className="item-header">Pasantía</dt>
                        <dd className="item-text">{report.internship_id}</dd>
                    </div>

                    <div className="item-row">
                        <dt className="item-header">Sitio de práctica</dt>
                        <dd className="item-text">{report.site_id}</dd>
                    </div>

                    <div className="item-row">
                        <dt className="item-header">Descripción</dt>
                        <dd className="item-text">
                            <div className="whitespace-pre-wrap max-w-2xl">
                                {report.description}
                            </div>
                        </dd>
                    </div>

                    {report.evidence && (
                        <div className="item-row">
                            <dt className="item-header">Evidencia</dt>
                            <dd className="item-text">
                                <a 
                                    href={report.evidence} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline break-all"
                                >
                                    {report.evidence}
                                </a>
                            </dd>
                        </div>
                    )}

                    <div className="item-row">
                        <dt className="item-header">Reporte anónimo</dt>
                        <dd className="item-text">
                            {report.anonymity ? "Sí" : "No"}
                        </dd>
                    </div>

                    <div className="item-row">
                        <dt className="item-header">Comentario del administrador</dt>
                        <dd className="item-text">
                            <div className="whitespace-pre-wrap">
                                {report.admin_comment || "Sin comentarios"}
                            </div>
                        </dd>
                    </div>

                    <div className="item-row">
                        <dt className="item-header">Fecha de creación</dt>
                        <dd className="item-text">{formatDateTime(report.created_at)}</dd>
                    </div>

                    <div className="item-row">
                        <dt className="item-header">Última actualización</dt>
                        <dd className="item-text">{formatDateTime(report.updated_at)}</dd>
                    </div>
                </dl>
            </div>

            {report.is_open && (
                <div className="mt-8">
                    <h3 className="text-lg font-medium mb-2">Agregar comentario</h3>
                    <div className="mb-4">
                        <textarea 
                            className="form-input--half"
                            value={adminComment}
                            onChange={(e) => setAdminComment(e.target.value)}
                            placeholder="Escriba su comentario aquí..."
                            rows={4}
                        ></textarea>
                        {commentError && (
                            <p className="text-red-500 text-sm mt-1">{commentError}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={closeReport}
                                onChange={(e) => setCloseReport(e.target.checked)}
                                className="mr-2"
                            />
                            <span>Cerrar reporte</span>
                        </label>
                    </div>
                    <button 
                        className="btn-primary"
                        onClick={handleAddComment}
                        disabled={commentLoading}
                    >
                        {commentLoading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            )}

            <div className="info-actions mt-16">
                <div className="flex gap-4">
                    <button 
                        type="button" 
                        className='item-link'
                        onClick={() => navigate(adminAbs(ROUTES.ADMIN.REPORT_LIST))}
                    >
                        Volver a la lista
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReportInfo;
