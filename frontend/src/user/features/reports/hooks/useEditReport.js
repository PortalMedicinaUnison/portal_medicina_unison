import { useState } from 'react';
import { updateReportRequest, uploadEvidenceRequest } from '../../../../services/reportService';

export default function useEditReport() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateReport = async (reportId, data, studentId) => {
    if (!reportId || !studentId) {
      setError('Datos requeridos no proporcionados');
      return false;
    }

    setLoading(true);
    setError('');

    try {
      // Preparar los datos para enviar al backend
      const reportData = {
        internship_id: data.internshipId ? parseInt(data.internshipId) : undefined,
        site_id: data.siteId ? parseInt(data.siteId) : undefined,
        date_report: data.dateReport || undefined,
        report_type: data.reportType ? parseInt(data.reportType) : undefined,
        other_type: data.reportType === '4' ? data.otherType : undefined,
        description: data.description || undefined,
        anonymity: data.anonymity,
        is_active: data.is_active
      };

      // Eliminar propiedades indefinidas
      Object.keys(reportData).forEach(key => {
        if (reportData[key] === undefined) {
          delete reportData[key];
        }
      });

      await updateReportRequest(reportId, reportData, studentId);
      
      // Si hay archivos seleccionados, subirlos
      if (data.selectedFiles && data.selectedFiles.length > 0) {
        for (const file of data.selectedFiles) {
          await uploadEvidenceRequest(reportId, file, studentId);
        }
      }
      
      setSuccess(true);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Error al actualizar el reporte:', err);
      setError('Error al actualizar el reporte. Por favor, intente nuevamente.');
      setLoading(false);
      return false;
    }
  };

  const resetForm = () => {
    setError('');
    setSuccess(false);
    setLoading(false);
  };

  return { updateReport, error, success, loading, resetForm };
}
