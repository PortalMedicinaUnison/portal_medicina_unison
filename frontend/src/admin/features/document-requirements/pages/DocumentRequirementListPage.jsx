import { Navigate, useSearchParams } from 'react-router-dom';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import RequirementCatalog from '../components/RequirementCatalog';
import { PROGRAMS, PROGRAM_LABELS } from '../../../../utils/constants';
import { programFromParams } from '../../../../utils/programParams';
import { documentRequirementsPath } from '../documentRequirementPaths';


// Una sola pantalla para ambos programas: el menú de Internado y el de Servicio social la abren con ?program=.
function DocumentRequirementListPage() {
  const [searchParams] = useSearchParams();
  const program = programFromParams(searchParams);
  if (!program) return <Navigate replace to={documentRequirementsPath(PROGRAMS.INTERNSHIP)} />;

  return (
    <Layout>
      <PageLayout title={`Documentos requeridos · ${PROGRAM_LABELS[program]}`}>
        {/* key: al cambiar de programa se cierra lo que estuviera abierto */}
        <RequirementCatalog key={program} program={program} />
      </PageLayout>
    </Layout>
  );
}

export default DocumentRequirementListPage;
