import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import SocialServiceApplicationForm from '../components/SocialServiceApplicationForm';


function SocialServiceApplicationFormPage() {
  return (
    <Layout>
      <PageLayout
        title="Registrar una nueva asignación de servicio social"
      >
        <SocialServiceApplicationForm />
      </PageLayout>
    </Layout>
  );
}

export default SocialServiceApplicationFormPage;
