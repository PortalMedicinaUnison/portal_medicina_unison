import InstitutionsList from '../components/InstitutionsList.jsx';
import Layout from '../../../../Layout.jsx';
import PageLayout from '../../../../components/PageLayout.jsx';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config.js';


function InstitutionsListPage() {
  const navigate = useNavigate();

  const instituionActions = (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate(adminAbs(ROUTES.ADMIN.INSTITUTION_CREATE))}
      >
        Crear
      </button>
    </span>
  );

  return (
      <Layout>
        <PageLayout 
          title="Lista de instituciones"
          actions={instituionActions}
          >
          <InstitutionsList />
        </PageLayout>
      </Layout>
  );
}

export default InstitutionsListPage;