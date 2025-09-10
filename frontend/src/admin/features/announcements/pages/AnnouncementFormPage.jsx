import AnnouncementsForm from '../components/AnnouncementsForm.jsx';
import Layout from '../../../../Layout.jsx';
import PageLayout from '../../../../components/PageLayout.jsx';

function AnnouncementFormPage() {
    return (
        <Layout>
        <PageLayout 
            title="Registrar nuevo anuncio" 
        >
            <AnnouncementsForm/>
        </PageLayout>
        </Layout>
    );
}

export default AnnouncementFormPage;
