import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getReportByIdRequest } from '../../../../services/reportService.js';

export const useReport = (reportId, studentId) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getReportById = async (id, studentId) => {
        if (!id || !studentId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await getReportByIdRequest(id, studentId);
            setReport(response.data);
            console.log('Report fetched:', response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al cargar el reporte');
            console.error('Error fetching report:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (reportId && studentId) {
            getReportById(reportId, studentId);
        }
    }, [reportId, studentId, location.search]);

    // Función para refrescar los datos
    const refetch = () => {
        if (reportId && studentId) {
            getReportById(reportId, studentId);
        }
    };

    return {
        report,
        loading,
        error,
        refetch,
        getReportById
    };
};
