import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../../config';
import Layout from '../../../../../Layout';
import PageLayout from '../../../../../components/PageLayout';
import useGetEnrollments from '../hooks/useGetEnrollments';
import EnrollmentList from '../components/EnrollmentList';


function EnrollmentListPage() {
  const navigate = useNavigate();
  const { enrollments, loading: fetching, error: fetchError, refetch } = useGetEnrollments();
    
  const actions = (
    <button
      type="button"
      className="btn-primary"
      onClick={() => navigate(adminAbs(ROUTES.ADMIN.USER_ENROLLMENT_CREATE))}
    >
      Crear
    </button>
  );
    
  return (
    <Layout>
      <PageLayout 
        title="Lista de usuarios pre-registrados"
        actions={actions}
      >
        <EnrollmentList
          enrollments={enrollments}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
        />
      </PageLayout>
    </Layout>
  );
}

export default EnrollmentListPage;
