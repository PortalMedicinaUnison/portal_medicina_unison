import { useParams } from 'react-router-dom';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useReport from '../hooks/useReport';
import ReportForm from '../components/ReportForm';


function ReportUpdatePage() {
  const { reportId } = useParams();
  const { report, loading: fetching, error: fetchError, refetch } = useReport(reportId);

  const pageTitle = fetching
  ? 'Cargando...'
  : report
    ? 'Editar reporte'
    : ' ';

  return (
    <Layout>
      <PageLayout
        title={pageTitle}
      >
        <ReportForm
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

export default ReportUpdatePage;
