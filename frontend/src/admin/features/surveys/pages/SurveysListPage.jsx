import SurveysList from '../components/SurveysList';

import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';

function SurveysListPage() {
    const navigate = useNavigate();
    
    const surveyActions = (
        <span className="show-on-sm">
        <button
            type="button"
            className="btn-primary"
            onClick={() => navigate(adminAbs(ROUTES.ADMIN.SURVEY_CREATE))}
        >
            Crear
        </button>
        </span>
    );
    
    return (
        <Layout>
            <PageLayout 
            title="Lista de encuentas"
            actions={surveyActions}
            >
            <SurveysList />
            </PageLayout>
        </Layout>
    );
}

export default SurveysListPage;
