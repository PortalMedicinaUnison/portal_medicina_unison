import AnnouncementsList from '../components/AnnouncementsList.jsx';
import Layout from '../../../../Layout.jsx';
import PageLayout from '../../../../components/PageLayout.jsx';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config.js';

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
