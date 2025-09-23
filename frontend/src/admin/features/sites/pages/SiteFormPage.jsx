import Layout from "../../../../Layout.jsx";
import PageLayout from '../../../../components/PageLayout.jsx';
import SiteForm from "../components/SiteForm.jsx";


function SiteFormPage() {
  return ( 
    <Layout>
      <PageLayout 
        title="🏨 Registrar nueva sede" 
      >
        <SiteForm/>
      </PageLayout>
    </Layout>
  );
}

export default SiteFormPage;
