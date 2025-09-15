import SurveysForm from '../components/SurveysForm';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';

function SurveyFormPage() {
    return (
        <Layout>
        <PageLayout 
            title="Registrar nuevo anuncio" 
        >
            <SurveysForm/>
        </PageLayout>
        </Layout>
    );
}

export default SurveyFormPage;
