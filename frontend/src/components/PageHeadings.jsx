import '../styles.css';


export default function PageHeadings({ title, btn, btn2 }) {
return (
    <div className="flex lg:items-center lg:justify-between">
    <div className=" flex-1">
        <h2 className="page-title">
        {title || 'Page Title'}
        </h2>
    </div>
    
    <div className="mt-0 flex lg:ml-0 border">
        {btn2 && (
            <span className="hidden sm:block">
            <button
                type="button"
                className="btn-secondary"
            >
                {btn2 || 'Action 2'}
            </button>
            </span>
        )}

        {btn && (
            <span className="sm:ml-2">
            <button
                type="button"
                className="btn-primary"
            >
                {btn || 'Action 1'}
            </button>
            </span>
        )}
    </div>
    </div>
)
}