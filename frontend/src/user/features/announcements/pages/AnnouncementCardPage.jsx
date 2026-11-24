import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetAnnouncements from '../hooks/useGetAnnouncements';
import AnnouncementCard from '../components/AnnouncementCard';
import MyProcessCard from '../../home/MyProcessCard';
import { useUser } from '../../../../contexts/UserContext';


// Inicio del alumno: en qué va (y qué sigue) y, debajo, los avisos de la coordinación.
function AnnouncementCardPage() {
  const { user } = useUser();
  const { announcements, loading: fetching, error: fetchError, refetch } = useGetAnnouncements();

  return (
    <Layout>
      <PageLayout
        pretitle=''
        title={user?.first_name ? `Hola, ${user.first_name}` : 'Inicio'}
      >
        <div className="flex flex-col gap-10">
          <MyProcessCard />
          <section className="flex flex-col gap-4" aria-labelledby="announcements-title">
            <h3 id="announcements-title" className="text-lg font-semibold text-gray-900">Avisos</h3>
            <AnnouncementCard
              announcements={announcements}
              fetching={fetching}
              fetchError={fetchError}
              refetch={refetch}
            />
          </section>
        </div>
      </PageLayout>
    </Layout>
  );
}

export default AnnouncementCardPage;
