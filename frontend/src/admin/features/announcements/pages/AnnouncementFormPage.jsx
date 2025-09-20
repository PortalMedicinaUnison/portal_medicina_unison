import AnnouncementsForm from '../components/AnnouncementsForm';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';

function AnnouncementFormPage() {
    return (
        <Layout>
        <PageLayout 
            title="📣 Registrar nuevo anuncio" 
        >
            <AnnouncementsForm/>
        </PageLayout>
        </Layout>
    );
}

export default AnnouncementFormPage;
