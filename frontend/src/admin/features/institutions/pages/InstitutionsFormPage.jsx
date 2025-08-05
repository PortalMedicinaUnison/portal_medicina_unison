import InstitutionForm from "../components/InstitutionForm.jsx";
import Layout from "../../../../Layout.jsx";
import PageLayout from '../../../../components/PageLayout.jsx';


function InstitutionFormPage() {
  return ( 
    <Layout>
      <PageLayout 
        title="Registrar nueva sede" 
      >
        <InstitutionForm/>
      </PageLayout>
    </Layout>
  );
}

export default InstitutionFormPage;
