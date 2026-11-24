import { useParams } from 'react-router-dom';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useReport from '../hooks/useReport';
import ReportDetail from '../components/ReportDetail';


function ReportDetailPage() {
  const { reportId } = useParams();
  const { report, loading: fetching, error: fetchError, refetch } = useReport(reportId);

  const pageTitle = fetching
  ? 'Cargando...'
  : report
    ? 'Detalle del reporte'
    : ' ';

  return (
    <Layout>
      <PageLayout
        title={pageTitle}
      >
        <ReportDetail
          report={report}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
          reportId={reportId}
        />
      </PageLayout>
    </Layout>
  );
}

export default ReportDetailPage;
