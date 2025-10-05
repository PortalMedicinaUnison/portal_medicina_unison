import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import InternshipForm from '../components/InternshipForm';


function InternshipFormPage() {
  return (
    <Layout>
      <PageLayout 
        title="Registrar un internado" 
      >
        <InternshipForm/>
      </PageLayout>
    </Layout>
  );
}

export default InternshipFormPage;
