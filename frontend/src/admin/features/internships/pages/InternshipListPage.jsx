import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetInternships from '../hooks/useGetInternships';
import InternshipList from '../components/InternshipList';


function InternshipListPage() {
  const navigate = useNavigate();
  const { internships, loading: fetching, error: fetchError, refetch } = useGetInternships();
    
  const actions = (
    <button
      type="button"
      className="btn-primary"
      onClick={() => navigate(adminAbs(ROUTES.ADMIN.INTERNSHIP_CREATE))}
    >
      Crear
    </button>
  );
    
  return (
    <Layout>
      <PageLayout 
        title="Lista de internados"
        actions={actions}
      >
        <InternshipList
          internships={internships}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
        />
      </PageLayout>
    </Layout>
  );
}

export default InternshipListPage;
