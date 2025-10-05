import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import AnnouncementForm from '../components/AnnouncementForm';


function AnnouncementFormPage() {
  return (
    <Layout>
      <PageLayout 
        title="Registrar nuevo anuncio" 
      >
        <AnnouncementForm/>
      </PageLayout>
    </Layout>
  );
}

export default AnnouncementFormPage;
