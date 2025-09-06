import { useState } from 'react';
import { updateReportRequest } from '../../../../services/reportService';

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
      await updateReportRequest(reportId, data, studentId);
      setSuccess(true);
      setLoading(false);
      return true;
    } catch (err) {
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
