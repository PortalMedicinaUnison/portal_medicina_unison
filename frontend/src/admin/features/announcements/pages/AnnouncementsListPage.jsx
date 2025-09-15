import AnnouncementsList from '../components/AnnouncementsList';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';

function AnnouncementsListPage() {
    const navigate = useNavigate();
    
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
            <AnnouncementsList />
            </PageLayout>
        </Layout>
    );
}

export default AnnouncementsListPage;
