// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// // import getAllReportsAdminRequest } from '../../../../services/reportService';
// import { ROUTES, adminAbs } from '../../../../config';

// function ReportsList() {
//     const [search, setSearch] = useState('');
//     const [statusFilter, setStatusFilter] = useState('all');
//     const [typeFilter, setTypeFilter] = useState('all');
//     const [reports, setReports] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const getReports = async () => {
//         setLoading(true);
//         try {
//             const response = await getAllReportsAdminRequest();
//             setReports(response.data || []);
//         } catch (error) {
//             console.error("Error loading reports", error);
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     useEffect(() => {
//         getReports();
//     }, []);
    
//     const handleViewButton = (reportId) => {
//         navigate(adminAbs(ROUTES.ADMIN.REPORT_DETAIL(reportId)));
//     };
    
//     const getReportTypeLabel = (type) => {
//         const types = {
//             1: 'Incidente',
//             2: 'Sugerencia', 
//             3: 'Queja',
//             4: 'Otro'
//         };
//         return types[type] || 'Desconocido';
//     };

//     const getStatusText = (isActive, isOpen) => {
//         if (!isActive) {
//             return "Inactivo";
//         }
//         if (isOpen) {
//             return "Abierto";
//         }
//         return "Cerrado";
//     };

//     const filteredReports = reports.filter((report) => {
//         // Solo mostrar reportes activos (restricción para administradores)
//         if (!report.is_active) return false;
        
//         const matchesSearch = search.toLowerCase() === '' || 
//             report.description?.toLowerCase().includes(search.toLowerCase()) ||
//             String(report.report_id).includes(search) ||
//             getReportTypeLabel(report.report_type).toLowerCase().includes(search.toLowerCase());
        
//         const matchesStatus = statusFilter === 'all' || 
//             (statusFilter === 'open' && report.is_open) ||
//             (statusFilter === 'closed' && !report.is_open);
        
//         const matchesType = typeFilter === 'all' || 
//             String(report.report_type) === typeFilter;
        
//         return matchesSearch && matchesStatus && matchesType;
//     });

//     if (loading) {
//         return (
//             <div className="table-container">
//                 <div className="text-center py-8">
//                     <span className="text-gray-500">Cargando reportes...</span>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="table-container">
//             <div className="table-container-actions">
//                 <div className="flex gap-4 items-center">
//                     <input 
//                         className='form-input--sm'
//                         type="text"
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         placeholder='Buscar reporte'
//                     />
                    
                    
//                     <select 
//                         className='form-input--sm'
//                         value={statusFilter}
//                         onChange={(e) => setStatusFilter(e.target.value)}
//                     >
//                         <option value="all">Todos los estados</option>
//                         <option value="open">Abiertos</option>
//                         <option value="closed">Cerrados</option>
//                     </select>
                    
//                     <select 
//                         className='form-input--sm'
//                         value={typeFilter}
//                         onChange={(e) => setTypeFilter(e.target.value)}
//                     >
//                         <option value="all">Todos los tipos</option>
//                         <option value="1">Incidentes</option>
//                         <option value="2">Sugerencias</option>
//                         <option value="3">Quejas</option>
//                         <option value="4">Otros</option>
//                     </select>
//                 </div>
//             </div>

//             <div className='table-container-body'>
//                 <table className='table'>
//                     <thead className="text-xs text-gray-700 bg-gray-50">
//                         <tr>
//                             <th>ID</th>
//                             <th>Estudiante</th>
//                             <th>Tipo</th>
//                             <th>Descripción</th>
//                             <th>Fecha</th>
//                             <th>Estado</th>
//                             <th></th>
//                         </tr>
//                     </thead>
                    
//                     <tbody>
//                         {filteredReports.length === 0 ? (
//                             <tr>
//                                 <td colSpan="7" className="text-center py-8 text-gray-500">
//                                     {reports.length === 0 ? 'No hay reportes disponibles' : 'No se encontraron reportes con los filtros aplicados'}
//                                 </td>
//                             </tr>
//                         ) : (
//                             filteredReports.map((report) => (
//                                 <tr key={report.report_id}>
//                                     <td>{report.report_id}</td>
//                                     <td>{report.student_id}</td>
//                                     <td>
//                                         <span className="font-medium">
//                                             {getReportTypeLabel(report.report_type)}
//                                         </span>
//                                         {report.other_type && (
//                                             <div className="text-xs text-gray-500">
//                                                 {report.other_type}
//                                             </div>
//                                         )}
//                                     </td>
//                                     <td>
//                                         <div className="w-40 max-w-40 truncate" title={report.description}>
//                                             {report.description}
//                                         </div>
//                                     </td>
//                                     <td>{new Date(report.date_report).toLocaleDateString()}</td>
//                                     <td>{getStatusText(report.is_active, report.is_open)}</td>
//                                     <td>
//                                         <button 
//                                             className='item-link' 
//                                             onClick={() => handleViewButton(report.report_id)}
//                                         >
//                                             Ver
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// export default ReportsList;
