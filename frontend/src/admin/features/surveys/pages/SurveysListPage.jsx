import SurveysList from '../components/SurveysList.jsx';

import Layout from '../../../../Layout.jsx';
import PageLayout from '../../../../components/PageLayout.jsx';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config.js';

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
