import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import SurveyForm from '../components/SurveyForm';

function SurveyFormPage() {
    return (
        <Layout>
        <PageLayout 
            title="Registrar nuevo anuncio" 
        >
            <SurveyForm/>
        </PageLayout>
        </Layout>
    );
}

export default SurveyFormPage;
