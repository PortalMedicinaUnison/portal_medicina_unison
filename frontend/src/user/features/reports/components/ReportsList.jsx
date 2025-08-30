import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllReportsRequest } from '../../../../services/reportService';
import { ROUTES, userAbs } from '../../../../config.js';

function ReportsList() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    // TODO: Obtener studentId del contexto de autenticación
    const studentId = 1; // Temporal - debe venir del contexto de usuario

    const getReports = async () => {
        if (!studentId) return;
        
        setLoading(true);
        try {
            const response = await getAllReportsRequest(studentId);
            setReports(response.data || []);
            console.log("Reports loaded successfully", response.data);
        } catch (error) {
            console.error("Error loading reports", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        getReports();
    }, [studentId]);
    
    const handleViewButton = (reportId) => {
        navigate(userAbs(ROUTES.USER.REPORT_INFO(reportId)));
    };
    
    const handleEditButton = (reportId) => {
        navigate(userAbs(ROUTES.USER.REPORT_EDIT(reportId)));
    };

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
            return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Inactivo</span>;
        }
        if (isOpen) {
            return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Abierto</span>;
        }
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Cerrado</span>;
    };

    const filteredReports = reports.filter((report) => {
        const matchesSearch = search.toLowerCase() === '' || 
            report.description.toLowerCase().includes(search.toLowerCase()) ||
            String(report.report_id).includes(search) ||
            getReportTypeLabel(report.report_type).toLowerCase().includes(search.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'active' && report.is_active) ||
            (statusFilter === 'inactive' && !report.is_active);
        
        const matchesType = typeFilter === 'all' || 
            String(report.report_type) === typeFilter;
        
        return matchesSearch && matchesStatus && matchesType;
    });

    if (loading) {
        return (
            <div className="table-container">
                <div className="text-center py-8">
                    <span className="text-gray-500">Cargando reportes...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="table-container">
            <div className="table-container-actions">
                <div className="flex gap-4 items-center">
                    <input 
                        className='form-input--sm'
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='Buscar reporte'
                    />
                    
                    <select 
                        className='form-input--sm'
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Todos los estados</option>
                        <option value="active">Activos</option>
                        <option value="inactive">Inactivos</option>
                    </select>
                    
                    <select 
                        className='form-input--sm'
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="all">Todos los tipos</option>
                        <option value="1">Incidentes</option>
                        <option value="2">Sugerencias</option>
                        <option value="3">Quejas</option>
                        <option value="4">Otros</option>
                    </select>
                </div>
            </div>

            <div className='table-container-body'>
                <table className='table'>
                    <thead className="text-xs text-gray-700 bg-gray-50">
                        <tr>
                            <th>ID</th>
                            <th>Tipo</th>
                            <th>Descripción</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Anónimo</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {filteredReports.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center py-8 text-gray-500">
                                    {reports.length === 0 ? 'No hay reportes disponibles' : 'No se encontraron reportes con los filtros aplicados'}
                                </td>
                            </tr>
                        ) : (
                            filteredReports.map((report) => (
                                <tr key={report.report_id}>
                                    <td>{report.report_id}</td>
                                    <td>
                                        <span className="font-medium">
                                            {getReportTypeLabel(report.report_type)}
                                        </span>
                                        {report.other_type && (
                                            <div className="text-xs text-gray-500">
                                                {report.other_type}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div className="max-w-xs truncate" title={report.description}>
                                            {report.description}
                                        </div>
                                    </td>
                                    <td>{new Date(report.date_report).toLocaleDateString()}</td>
                                    <td>{getStatusBadge(report.is_active, report.is_open)}</td>
                                    <td>
                                        {report.anonymity ? (
                                            <span className="text-green-600">✓</span>
                                        ) : (
                                            <span className="text-gray-400">✗</span>
                                        )}
                                    </td>
                                    <td>
                                        <button 
                                            className='item-link' 
                                            onClick={() => handleViewButton(report.report_id)}
                                        >
                                            Ver
                                        </button>
                                    </td>
                                    <td>
                                        <button 
                                            className='item-link' 
                                            onClick={() => handleEditButton(report.report_id)}
                                            disabled={!report.is_active}
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ReportsList;
