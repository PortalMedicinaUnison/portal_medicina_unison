import ReportForm from "../components/ReportForm.jsx";
import Layout from "../../../../Layout.jsx";
import PageLayout from '../../../../components/PageLayout.jsx';

function ReportFormPage() {
  return ( 
    <Layout>
      <PageLayout 
        title="Crear Reporte" 
      >
        <ReportForm/>
      </PageLayout>
    </Layout>
  );
}

export default ReportFormPage;
