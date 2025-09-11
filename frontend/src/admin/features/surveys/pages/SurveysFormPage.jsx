import SurveysForm from '../components/SurveysForm.jsx';
import Layout from '../../../../Layout.jsx';
import PageLayout from '../../../../components/PageLayout.jsx';

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
