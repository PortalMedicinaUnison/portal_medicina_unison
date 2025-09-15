import { useState, useEffect } from 'react';
import { getReportByIdAdminRequest } from '../../../../services/reportService';

export function useAdminReport(reportId) {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReport = async () => {
        if (!reportId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await getReportByIdAdminRequest(reportId);
            setReport(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar el reporte. Por favor, intente nuevamente.');
            setReport(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [reportId]);

    const refetch = () => {
        fetchReport();
    };

    return { report, loading, error, refetch };
}
