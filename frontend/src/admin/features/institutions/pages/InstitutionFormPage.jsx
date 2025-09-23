import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout.jsx';
import InstitutionForm from '../components/InstitutionForm.jsx';


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
