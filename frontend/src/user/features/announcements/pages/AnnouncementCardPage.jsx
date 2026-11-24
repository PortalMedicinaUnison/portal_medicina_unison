import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetAnnouncements from '../hooks/useGetAnnouncements';
import AnnouncementCard from '../components/AnnouncementCard';


function AnnouncementCardPage() {
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
