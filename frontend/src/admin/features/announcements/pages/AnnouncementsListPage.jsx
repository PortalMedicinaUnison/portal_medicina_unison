import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetAnnouncements from '../hooks/useGetAnnouncements';
import AnnouncementsList from '../components/AnnouncementsList';


function AnnouncementsListPage() {
    const navigate = useNavigate();
    const { announcements, loading: fetching, error: fetchError, refetch } = useGetAnnouncements();
    
    const announcementActions = (
        <span className="show-on-sm">
        <button
            type="button"
            className="btn-primary"
            onClick={() => navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENT_CREATE))}
        >
            Crear
        </button>
        </span>
    );
    
    return (
        <Layout>
            <PageLayout 
            title="Lista de anuncios"
            actions={announcementActions}
            >
            <AnnouncementsList
                announcements={announcements}
                fetching={fetching}
                fetchError={fetchError}
                refetch={refetch}
             />
            </PageLayout>
        </Layout>
    );
}

export default AnnouncementsListPage;
