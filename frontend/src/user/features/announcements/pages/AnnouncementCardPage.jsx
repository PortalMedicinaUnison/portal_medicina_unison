import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetAnnouncements from '../../../../admin/features/announcements/hooks/useGetAnnouncements';
import AnnouncementCard from '../components/AnnouncementCard';


function AnnouncementCardPage() {
  const navigate = useNavigate();
  const { announcements, loading: fetching, error: fetchError, refetch } = useGetAnnouncements();
    
  return (
    <Layout>
      <PageLayout 
        pretitle=''
      >
        <AnnouncementCard
          announcements={announcements}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
        />
      </PageLayout>
    </Layout>
  );
}

export default AnnouncementCardPage;
