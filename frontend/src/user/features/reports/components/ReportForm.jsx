import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useCreateReport from "../hooks/useCreateReport";
import useGetInternships from "../hooks/useGetInternships";
import useGetSites from "../hooks/useGetSites";
import { ROUTES, userAbs } from "../../../../config";
import { uploadEvidenceRequest } from "../../../../services/reportService";

function ReportForm() {
  const navigate = useNavigate();
  // TODO: Obtener studentId del contexto de autenticación
  const studentId = 1; // Temporal - debe venir del contexto de usuario

  const [formData, setFormData] = useState({
    internshipId: '',
    siteId: '',
    dateReport: '',
    reportType: '',
    otherType: '',
    description: '',
    evidence: '',
    anonymity: false,
  });
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  const { createReport, error, success, loading, resetForm } = useCreateReport();
  const { internships, loading: internshipsLoading, error: internshipsError } = useGetInternships(studentId);
  const { sites, loading: sitesLoading, error: sitesError } = useGetSites();

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
    
    // Crear el reporte primero
    const createdReport = await createReport(formData, studentId);
    console.log("Respuesta de createReport:", createdReport);
    
    if (createdReport) {
      // Si hay archivos seleccionados, subirlos
      if (selectedFiles.length > 0) {
        try {
          // Obtener el ID del reporte recién creado
          const reportId = createdReport.report_id;
          console.log("ID del reporte creado:", reportId);
          
          // Subir cada archivo
          for (const file of selectedFiles) {
            console.log("Subiendo archivo:", file.name);
            await uploadEvidenceRequest(reportId, file, studentId);
            console.log("Archivo subido correctamente:", file.name);
          }
        } catch (error) {
          console.error('Error al subir archivos:', error);
          // Continuar con la redirección aunque falle la subida de archivos
        }
      }
      
      resetForm();
      setFormData({
        internshipId: '',
        siteId: '',
        dateReport: '',
        reportType: '',
        otherType: '',
        description: '',
        evidence: '',
        anonymity: false,
      });
      setSelectedFiles([]);
      
      // Redirigir a la página de "Mis reportes"
      navigate(userAbs(ROUTES.USER.REPORTS_LIST));
    }
  };

  const reportTypes = [
    { value: 1, label: 'Incidente' },
    { value: 2, label: 'Sugerencia' },
    { value: 3, label: 'Queja' },
    { value: 4, label: 'Otro' },
  ];

  return (
    <form className="component-container" onSubmit={handleSubmit}>
      {success && (
        <div className="alert-success-text">
          Reporte registrado exitosamente.
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
                  {reportTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
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
          </dl>
        </div>

        <div className="button-group">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => navigate(userAbs(ROUTES.USER.REPORTS_LIST))}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default ReportForm;
