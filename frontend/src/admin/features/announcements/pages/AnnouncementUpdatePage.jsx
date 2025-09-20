import Layout from "../../../../Layout.jsx";
import PageLayout from '../../../../components/PageLayout.jsx';
import AnnouncementUpdate from '../components/AnnouncementUpdate.jsx'


function AnnouncementUpdatePage() {
  return ( 
    <Layout>
      <PageLayout 
        title="Actualizar anuncio" 
      >
        <AnnouncementUpdate/>
      </PageLayout>
    </Layout>
  );
}

export default AnnouncementUpdatePage;
