import { useState } from 'react';
import { cleanFormData } from '../../../../utils/utils';
import { createReportRequest } from '../../../../services/reportService';

export default function useCreateReport() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const createReport = async (formData, studentId) => {  
    if (!studentId) {
      setError('ID de estudiante requerido');
      return false;
    }

    const cleanedData = cleanFormData(formData);
    
    if (!cleanedData.description || cleanedData.description.trim().length < 10) {
      setError('La descripción debe tener al menos 10 caracteres');
      return false;
    }

    if (!cleanedData.internshipId) {
      setError('Debe seleccionar una pasantía');
      return false;
    }

    if (!cleanedData.siteId) {
      setError('Debe seleccionar un sitio');
      return false;
    }

    if (!cleanedData.dateReport) {
      setError('Debe seleccionar una fecha');
      return false;
    }

    if (!cleanedData.reportType) {
      setError('Debe seleccionar un tipo de reporte');
      return false;
    }

    const reportType = parseInt(cleanedData.reportType, 10);
    if (reportType === 4 && (!cleanedData.otherType || cleanedData.otherType.trim().length < 3)) {
      setError('Debe especificar el tipo de reporte cuando selecciona "Otro"');
      return false;
    }
    
    setError('');
    setLoading(true);
    
    const report = {
      internship_id: parseInt(cleanedData.internshipId, 10),
      site_id: parseInt(cleanedData.siteId, 10),
      date_report: cleanedData.dateReport,
      report_type: parseInt(cleanedData.reportType, 10),
      other_type: cleanedData.otherType,
      description: cleanedData.description,
      evidence: cleanedData.evidence,
      anonymity: cleanedData.anonymity || false,
    };

    try {
      const response = await createReportRequest(report, studentId);
      setSuccess(true);
      setLoading(false);
      return response.data; // Devuelve los datos del reporte creado
    } catch (err) {
      setError('Error al registrar el reporte. Por favor, intenta nuevamente.');
      setLoading(false);
      return false;
    }
  };

  const resetForm = () => {
    setError('');
    setSuccess(false);
    setLoading(false);
  };

  return { createReport, error, success, loading, resetForm };
}
