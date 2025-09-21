import EnrollmentForm from "../components/EnrollmentForm";
import Layout from "../../../../../Layout.jsx";
import PageLayout from '../../../../../components/PageLayout.jsx';


function EnrollmentFormPage() {
  return ( 
    <Layout>
      <PageLayout 
        title="Pre-registrar un alumno" 
      >
        <EnrollmentForm/>
      </PageLayout>
    </Layout>
  );
}

export default EnrollmentFormPage;
