import { useNavigate, useParams } from "react-router-dom";
import { ROUTES, adminAbs } from "../../../../config";
import useApplication from '../hooks/useApplication';
import Layout from "../../../../Layout";
import PageLayout from '../../../../components/PageLayout';
import ApplicationDetail from "../components/ApplicationDetail";


function ApplicationPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const { application, loading: fetching, error: fetchError, refetch } = useApplication(applicationId);

  const pageTitle = fetching
  ? 'Cargando...'
  : application
    ? `${application.academic_id}`
    : ' ';

  const actions = (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate(adminAbs(ROUTES.ADMIN.INTERNSHIP_APPLICATION_EDIT(applicationId)))}
        disabled={fetching || fetchError}
      >
        Editar
      </button>
    </span>
  );

  return (
    <Layout>
      <PageLayout 
        title={pageTitle}
        actions={actions}
      >
        <ApplicationDetail
          application={application}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
          applicationId={applicationId}
        />
      </PageLayout>
    </Layout>
  );
}

export default ApplicationPage;