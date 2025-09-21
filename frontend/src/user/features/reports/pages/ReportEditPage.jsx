import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReport } from '../hooks/useReport';
import useEditReport from '../hooks/useEditReport';
import useGetInternships from '../hooks/useGetInternships';
import useGetSites from '../hooks/useGetSites';
import { ROUTES, userAbs } from '../../../../config';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';

function ReportEditPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  // TODO: Obtener studentId del contexto de autenticación
  const studentId = 1; // Temporal - debe venir del contexto de usuario
  
  const { report, loading: reportLoading, error: reportError } = useReport(parseInt(reportId), studentId);
  const { updateReport, loading, error, success } = useEditReport();
  const { internships, loading: internshipsLoading, error: internshipsError } = useGetInternships(studentId);
  const { sites, loading: sitesLoading, error: sitesError } = useGetSites();
  
  const [formData, setFormData] = useState({
    internshipId: '',
    siteId: '',
    dateReport: '',
    reportType: '',
    otherType: '',
    description: '',
    anonymity: false,
    is_active: true
  });
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (report) {
      setFormData({
        internshipId: report.internship_id?.toString() || '',
        siteId: report.site_id?.toString() || '',
        dateReport: report.date_report ? new Date(report.date_report).toISOString().split('T')[0] : '',
        reportType: report.report_type?.toString() || '',
        otherType: report.other_type || '',
        description: report.description || '',
        anonymity: report.anonymity || false,
        is_active: report.is_active
      });
    }
  }, [report]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileError('');
    
    // Validar tamaño total (máximo 50MB)
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    const maxSize = 50 * 1024 * 1024; // 50MB en bytes
    
    if (totalSize > maxSize) {
      setFileError(`Los archivos seleccionados superan el límite de 50MB (${(totalSize / (1024 * 1024)).toFixed(2)}MB)`);
      setSelectedFiles([]);
      return;
    }
    
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar archivos si hay seleccionados
    if (selectedFiles.length > 0) {
      const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
      const maxSize = 50 * 1024 * 1024; // 50MB en bytes
      
      if (totalSize > maxSize) {
        setFileError(`Los archivos seleccionados superan el límite de 50MB (${(totalSize / (1024 * 1024)).toFixed(2)}MB)`);
        return;
      }
    }
    
    // Incluir los archivos seleccionados en los datos del formulario
    const updatedFormData = {
      ...formData,
      selectedFiles
    };
    
    const isUpdated = await updateReport(reportId, updatedFormData, studentId);
    if (isUpdated) {
      // Agregar timestamp para forzar la recarga del componente
      const timestamp = Date.now();
      navigate(`${userAbs(ROUTES.USER.REPORT_INFO(reportId))}?t=${timestamp}`);
    }
  };

  const handleCancel = () => {
    navigate(userAbs(ROUTES.USER.REPORT_INFO(reportId)));
  };

  if (reportLoading) {
    return (
      <Layout>
        <PageLayout title="Editando reporte">
          <div className="text-center py-8">
            <span className="text-gray-500">Cargando información del reporte...</span>
          </div>
        </PageLayout>
      </Layout>
    );
  }

  if (reportError || !report || !report.is_open) {
    return (
      <Layout>
        <PageLayout title="Editando reporte">
          <div className="error-container">
            <div className="error-message">
              <h3>Error al cargar el reporte</h3>
              <p>
                {reportError || 
                 (!report ? "No se encontró el reporte" : 
                  !report.is_open ? "No puedes editar un reporte cerrado" : "Error desconocido")}
              </p>
              <button 
                className="btn-primary" 
                onClick={() => navigate(userAbs(ROUTES.USER.REPORTS_LIST))}
              >
                Volver a la lista
              </button>
            </div>
          </div>
        </PageLayout>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageLayout title={`Editar Reporte #${report.report_id}`}>
        <form className="component-container" onSubmit={handleSubmit}>
          {success && (
            <div className="alert-success-text">
              Reporte actualizado exitosamente.
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
                  <dt className="item-header">Pasantía</dt>
                  <dd className="item-text">
                    <select
                      className="form-input--half"
                      name="internshipId"
                      value={formData.internshipId}
                      onChange={handleChange}
                      required
                      disabled={internshipsLoading}
                    >
                      <option value="">
                        {internshipsLoading ? 'Cargando pasantías...' : 'Seleccionar pasantía'}
                      </option>
                      {internships.map(internship => (
                        <option key={internship.internship_id} value={internship.internship_id}>
                          {internship.internship_id} - {internship.site_id}
                        </option>
                      ))}
                    </select>
                    {internshipsError && (
                      <span className="text-red-500 text-sm">{internshipsError}</span>
                    )}
                  </dd>
                </div>

                <div className="item-row">
                  <dt className="item-header">Sitio de práctica</dt>
                  <dd className="item-text">
                    <select
                      className="form-input--half"
                      name="siteId"
                      value={formData.siteId}
                      onChange={handleChange}
                      required
                      disabled={sitesLoading}
                    >
                      <option value="">
                        {sitesLoading ? 'Cargando sitios...' : 'Seleccionar sitio'}
                      </option>
                      {sites.map(site => (
                        <option key={site.site_id} value={site.site_id}>
                          {site.name} - {site.city}
                        </option>
                      ))}
                    </select>
                    {sitesError && (
                      <span className="text-red-500 text-sm">{sitesError}</span>
                    )}
                  </dd>
                </div>

                <div className="item-row">
                  <dt className="item-header">Fecha del reporte</dt>
                  <dd className="item-text">
                    <input
                      className="form-input--half"
                      name="dateReport"
                      type="date"
                      value={formData.dateReport}
                      onChange={handleChange}
                      required
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </dd>
                </div>

                <div className="item-row">
                  <dt className="item-header">Tipo de reporte</dt>
                  <dd className="item-text">
                    <select
                      className="form-input--half"
                      name="reportType"
                      value={formData.reportType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="1">Incidente</option>
                      <option value="2">Sugerencia</option>
                      <option value="3">Queja</option>
                      <option value="4">Otro</option>
                    </select>
                  </dd>
                </div>

                {formData.reportType === '4' && (
                  <div className="item-row">
                    <dt className="item-header">Tipo personalizado</dt>
                    <dd className="item-text">
                      <input
                        className="form-input--half"
                        name="otherType"
                        type="text"
                        value={formData.otherType}
                        onChange={handleChange}
                        placeholder="Especifique el tipo de reporte"
                        maxLength={50}
                      />
                    </dd>
                  </div>
                )}

                <div className="item-row">
                  <dt className="item-header">Descripción</dt>
                  <dd className="item-text">
                    <textarea
                      className="form-input--half"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describa detalladamente el incidente, sugerencia o queja..."
                      rows={6}
                      required
                      minLength={10}
                      maxLength={1000}
                    />
                    <span className="text-sm text-gray-500">
                      {formData.description.length}/1000 caracteres
                    </span>
                  </dd>
                </div>

                <div className="item-row">
                  <dt className="item-header">Evidencia (opcional)</dt>
                  <dd className="item-text">
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        multiple
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                      />
                      <button
                        type="button"
                        className="btn-secondary w-fit"
                        onClick={() => fileInputRef.current.click()}
                      >
                        Seleccionar archivos
                      </button>
                      
                      {selectedFiles.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium">Archivos seleccionados:</p>
                          <ul className="list-disc pl-5">
                            {selectedFiles.map((file, index) => (
                              <li key={index} className="text-sm">
                                {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                              </li>
                            ))}
                          </ul>
                          <p className="text-sm text-gray-500 mt-1">
                            Total: {(selectedFiles.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      )}
                      
                      {fileError && (
                        <p className="text-red-500 text-sm mt-1">{fileError}</p>
                      )}
                      
                      {report && report.evidence && (
                        <div className="mt-2">
                          <p className="font-medium">Evidencia actual:</p>
                          <a 
                            href={`http://localhost:8000/${report.evidence}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <span className="mr-2">Ver evidencia</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  </dd>
                </div>
                
                <div className="item-row">
                  <dt className="item-header">Reporte anónimo</dt>
                  <dd className="item-text">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="anonymity"
                        checked={formData.anonymity}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span>Mantener anonimato</span>
                    </label>
                  </dd>
                </div>

                <div className="item-row">
                  <dt className="item-header">Estado del reporte</dt>
                  <dd className="item-text">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span>Activo</span>
                    </label>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="info-actions mt-16">
              <div className="flex gap-4">
                <button 
                  type="button" 
                  className='item-link'
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className='item-link'
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </PageLayout>
    </Layout>
  );
}

export default ReportEditPage;
