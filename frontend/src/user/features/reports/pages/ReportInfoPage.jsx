import ReportInfo from "../components/ReportInfo.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES, userAbs } from "../../../../config.js";
import { useReport } from "../hooks/useReport.js";
import Layout from "../../../../Layout.jsx";
import PageLayout from '../../../../components/PageLayout.jsx';

function ReportInfoPage() {
  const { reportId } = useParams();
  // TODO: Obtener studentId del contexto de autenticación
  const studentId = 1; // Temporal - debe venir del contexto de usuario
  
  const { report, loading, error } = useReport(parseInt(reportId), studentId);
  const navigate = useNavigate();

  const editReportActions = report && report.is_active && report.is_open ? (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate(userAbs(ROUTES.USER.REPORT_EDIT(report.report_id)))}
      >
        Editar
      </button>
    </span>
  ) : null;

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!report) return <div>No se encontró el reporte.</div>;

  return (
      <Layout>
        <PageLayout 
          title={`Reporte #${report.report_id}`}
          actions={editReportActions}
        >
          <ReportInfo/>
        </PageLayout>
      </Layout>
  );
}

export default ReportInfoPage;
