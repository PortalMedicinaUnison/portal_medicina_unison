import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config.js';
import Layout from '../../../../Layout.jsx';
import PageLayout from '../../../../components/PageLayout.jsx';
import EnrollmentsList from '../components/EnrollmentsList.jsx';


function EnrollmentsListPage() {
  const navigate = useNavigate();

  const enrollmentsActions = (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate(adminAbs(ROUTES.ADMIN.ENROLLMENT_CREATE))}
      >
        Crear
      </button>
    </span>
  );

  return (
      <Layout>
        <PageLayout 
          title="Lista de alumnos pre-registrados"
          actions={enrollmentsActions}
          >
          <EnrollmentsList />
        </PageLayout>
      </Layout>
  );
}

export default EnrollmentsListPage;