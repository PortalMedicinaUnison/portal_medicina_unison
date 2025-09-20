import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import AnnouncementsForm from '../components/AnnouncementsForm';

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
