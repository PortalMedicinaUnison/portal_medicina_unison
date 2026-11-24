import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import RequirementCatalog from '../components/RequirementCatalog';


function DocumentRequirementListPage() {
  return (
    <Layout>
      <PageLayout title="Documentos requeridos">
        <RequirementCatalog />
      </PageLayout>
    </Layout>
  );
}

export default DocumentRequirementListPage;
