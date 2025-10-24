import { useCallback, useMemo } from 'react';
import { viewInternshipDocumentRequest, downloadInternshipDocumentRequest } from '../../../../../services/internshipService';

export default function useDocumentLinks(internshipId) {
  const openView = useCallback(async (docId) => {
    const res = await viewInternshipDocumentRequest(internshipId, docId);
    const blobUrl = URL.createObjectURL(res.data); // res.data es Blob
    window.open(blobUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
  }, [internshipId]);

  const openDownload = useCallback(async (docId) => {
    const res = await downloadInternshipDocumentRequest(internshipId, docId);
    const blobUrl = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `documento_${docId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
  }, [internshipId]);


  return useMemo(() => ({
    openView, openDownload,
  }), [openView, openDownload]);
}