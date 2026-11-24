import { REVIEW_STATUS, REVIEW_STATUS_LABELS, labelOf } from '../../../utils/constants';

const STYLES = {
  [REVIEW_STATUS.PENDING]: 'bg-amber-50 text-amber-800 ring-amber-200',
  [REVIEW_STATUS.APPROVED]: 'bg-green-50 text-green-700 ring-green-200',
  [REVIEW_STATUS.REJECTED]: 'bg-red-50 text-red-700 ring-red-200',
};

function ReviewStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[status] ?? 'bg-gray-50 text-gray-700 ring-gray-200'}`}>
      {labelOf(REVIEW_STATUS_LABELS, status)}
    </span>
  );
}

export default ReviewStatusBadge;
