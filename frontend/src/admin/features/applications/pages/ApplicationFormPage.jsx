import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import ApplicationForm from '../components/ApplicationForm';


function ApplicationFormPage() {
  return (
    <Layout>
      <PageLayout 
        title="Registrar una nueva aplicación" 
      >
        <ApplicationForm/>
      </PageLayout>
    </Layout>
  );
}

export default ApplicationFormPage;
