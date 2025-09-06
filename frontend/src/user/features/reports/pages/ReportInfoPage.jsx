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

  // Se eliminó el botón de editar de la parte superior

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!report) return <div>No se encontró el reporte.</div>;

  return (
      <Layout>
        <PageLayout 
          title={`Reporte #${report.report_id}`}
        >
          <ReportInfo/>
        </PageLayout>
      </Layout>
  );
}

export default ReportInfoPage;
