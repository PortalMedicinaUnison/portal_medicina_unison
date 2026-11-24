import { useParams } from "react-router-dom";
import Layout from "../../../../Layout.jsx";
import PageLayout from '../../../../components/PageLayout.jsx';
import AnnouncementUpdate from '../components/AnnouncementUpdate.jsx'
import useAnnouncement from '../hooks/useAnnouncement';


function AnnouncementUpdatePage() {
  const { announcementId } = useParams();
  const { announcement, loading: fetching, error: fetchError, refetch } = useAnnouncement(announcementId);
  
  const pageTitle = fetching
  ? 'Cargando...'
  : announcement
    ? 'Actualizar anuncio'
    : ' ';
  
  return ( 
    <Layout>
      <PageLayout 
        title={pageTitle}
      >
        <AnnouncementUpdate
          announcement={announcement}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
          announcementId={announcementId}
        />
      </PageLayout>
    </Layout>
  );
}

export default AnnouncementUpdatePage;
