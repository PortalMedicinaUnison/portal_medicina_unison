import { useParams, useNavigate } from 'react-router-dom';
import { useReport } from '../hooks/useReport';
import { ROUTES, userAbs } from '../../../../config';

function ReportInfo() {
    const { reportId } = useParams();
    const navigate = useNavigate();
    // TODO: Obtener studentId del contexto de autenticación
    const studentId = 1; // Temporal - debe venir del contexto de usuario
    
    const { report, loading, error, refetch } = useReport(parseInt(reportId), studentId);

    const getReportTypeLabel = (type) => {
        const types = {
            1: 'Incidente',
            2: 'Sugerencia', 
            3: 'Queja',
            4: 'Otro'
        };
        return types[type] || 'Desconocido';
    };

    const getStatusBadge = (isActive, isOpen) => {
        if (!isActive) {
            return <span className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full">Inactivo</span>;
        }
        if (isOpen) {
            return <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">Abierto</span>;
        }
        return <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">Cerrado</span>;
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
                        onClick={() => navigate(userAbs(ROUTES.USER.REPORTS_LIST))}
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
                        <dt className="item-header">Estado</dt>
                        <dd className="item-text">
                            {getStatusBadge(report.is_active, report.is_open)}
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
                            {report.anonymity ? (
                                <span className="text-green-600 font-medium">✓ Sí</span>
                            ) : (
                                <span className="text-gray-600">✗ No</span>
                            )}
                        </dd>
                    </div>

                    {report.admin_comment && (
                        <div className="item-row">
                            <dt className="item-header">Comentario del administrador</dt>
                            <dd className="item-text">
                                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                    <div className="whitespace-pre-wrap">
                                        {report.admin_comment}
                                    </div>
                                </div>
                            </dd>
                        </div>
                    )}

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

            <div className="info-actions mt-16">
                <div className="flex gap-4">
                    <button 
                        type="button" 
                        className='item-link'
                        onClick={() => navigate(userAbs(ROUTES.USER.REPORTS_LIST))}
                    >
                        Volver a la lista
                    </button>
                    
                    {report.is_active && (
                        <button 
                            type="button" 
                            className='item-link'
                            onClick={() => navigate(userAbs(ROUTES.USER.REPORT_EDIT(report.report_id)))}
                        >
                            Editar reporte
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReportInfo;
