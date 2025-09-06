import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import ReportInfo from '../components/ReportInfo';
import { useParams } from 'react-router-dom';

function ReportInfoPage() {
    const { reportId } = useParams();

    return (
        <Layout>
            <PageLayout title={`Reporte #${reportId}`}>
                <ReportInfo />
            </PageLayout>
        </Layout>
    );
}

export default ReportInfoPage;
