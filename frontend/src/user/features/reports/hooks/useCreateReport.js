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

    setLoading(true);
    setError('');
    
    const cleanedData = cleanFormData(formData);
    
    // Validaciones básicas
    if (!cleanedData.description || cleanedData.description.trim().length < 10) {
      setError('La descripción debe tener al menos 10 caracteres');
      setLoading(false);
      return false;
    }

    if (!cleanedData.internshipId) {
      setError('Debe seleccionar una pasantía');
      setLoading(false);
      return false;
    }

    if (!cleanedData.siteId) {
      setError('Debe seleccionar un sitio');
      setLoading(false);
      return false;
    }

    if (!cleanedData.dateReport) {
      setError('Debe seleccionar una fecha');
      setLoading(false);
      return false;
    }

    if (!cleanedData.reportType) {
      setError('Debe seleccionar un tipo de reporte');
      setLoading(false);
      return false;
    }

    // Validación para tipo personalizado
    const reportType = parseInt(cleanedData.reportType, 10);
    if (reportType === 4 && (!cleanedData.otherType || cleanedData.otherType.trim().length < 3)) {
      setError('Debe especificar el tipo de reporte cuando selecciona "Otro"');
      setLoading(false);
      return false;
    }
    
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
      await createReportRequest(report, studentId);
      setSuccess(true);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Create report failed", err);
      // Manejo seguro de errores - asegurarse de que el error sea una cadena de texto
      const errorDetail = err.response?.data?.detail;
      if (typeof errorDetail === 'string') {
        setError(errorDetail);
      } else {
        setError('Error al crear el reporte. Por favor, verifica los datos e intenta nuevamente.');
      }
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
