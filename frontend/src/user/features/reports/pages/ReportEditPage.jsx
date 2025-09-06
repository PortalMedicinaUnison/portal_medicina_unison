import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReport } from '../hooks/useReport';
import useEditReport from '../hooks/useEditReport';
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
  
  const [formData, setFormData] = useState({
    is_active: true
  });

  useEffect(() => {
    if (report) {
      setFormData({
        is_active: report.is_active
      });
    }
  }, [report]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isUpdated = await updateReport(reportId, formData, studentId);
    if (isUpdated) {
      navigate(userAbs(ROUTES.USER.REPORT_INFO(reportId)));
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

            <div className="button-group">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handleCancel}
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
      </PageLayout>
    </Layout>
  );
}

export default ReportEditPage;
