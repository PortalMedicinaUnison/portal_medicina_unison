import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetInstitutions from '../hooks/useGetInstitutions';
import InstitutionList from '../components/InstitutionList';


function InstitutionsListPage() {
  const navigate = useNavigate();
  const { institutions, loading: fetching, error: fetchError, refetch } = useGetInstitutions();
    
  const actions = (
    <button
      type="button"
      className="btn-primary"
      onClick={() => navigate(adminAbs(ROUTES.ADMIN.INSTITUTION_CREATE))}
    >
      Crear
    </button>
  );
    
  return (
    <Layout>
      <PageLayout 
        title="Lista de instituciones"
        actions={actions}
      >
        <InstitutionList
          institutions={institutions}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
        />
      </PageLayout>
    </Layout>
  );
}

export default InstitutionsListPage;
