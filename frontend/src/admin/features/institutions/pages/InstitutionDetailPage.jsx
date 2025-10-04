import { useNavigate, useParams } from "react-router-dom";
import { ROUTES, adminAbs } from "../../../../config";
import useInstitution from '../hooks/useInstitution';
import Layout from "../../../../Layout";
import PageLayout from '../../../../components/PageLayout';
import InstitutionDetail from "../components/InstitutionDetail";


function InstitutionPage() {
  const navigate = useNavigate();
  const { institutionId } = useParams();
  const { institution, loading: fetching, error: fetchError, refetch } = useInstitution(institutionId);

  const pageTitle = fetching
  ? 'Cargando...'
  : institution
    ? `${institution.name}`
    : ' ';

  const actions = (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate(adminAbs(ROUTES.ADMIN.INSTITUTION_EDIT(institutionId)))}
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
        <InstitutionDetail
          institution={institution}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
          institutionId={institutionId}
        />
      </PageLayout>
    </Layout>
  );
}

export default InstitutionPage;