import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetAnnouncements from '../hooks/useGetAnnouncements';
import AnnouncementList from '../components/AnnouncementList';


function AnnouncementListPage() {
  const navigate = useNavigate();
  const { announcements, loading: fetching, error: fetchError, refetch } = useGetAnnouncements();
    
  const actions = (
    <button
      type="button"
      className="btn-primary"
      onClick={() => navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENT_CREATE))}
    >
      Crear
    </button>
  );
    
  return (
    <Layout>
      <PageLayout 
        title="Lista de anuncios"
        actions={actions}
      >
        <AnnouncementList
          announcements={announcements}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
        />
      </PageLayout>
    </Layout>
  );
}

export default AnnouncementListPage;
