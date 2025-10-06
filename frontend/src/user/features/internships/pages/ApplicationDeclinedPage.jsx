import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../../../config';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import ApplicationDeclined from '../components/ApplicationDeclined';
import { useUser } from '../../../../contexts/UserContext';
import useApplicationByAcademic from '../hooks/useApplicationByAcademic'

function ApplicationDeclinedPage() {
  return ( 
    <Layout>
      <PageLayout 
        title="Solicitud rechazada" 
      >
        <ApplicationDeclined/>
      </PageLayout>
    </Layout>
  );
}

export default ApplicationDeclinedPage;