import { Link, NavLink } from 'react-router-dom';
import { ADMIN_HOME, ROUTES, adminAbs } from '../../config';
import SidebarCollapse from '../../utils/ui/CollapseMenu';
import { PROGRAMS } from '../../utils/constants';
import { promotionListPath } from '../features/promotions/promotionPaths';
import { documentRequirementsPath } from '../features/document-requirements/documentRequirementPaths';


function Sidebar({ toggleSidebar, openToggleButton }) {
    return (
        <div id="sidebar">
            <aside 
                id="logo-sidebar" 
                className="sidebar-container" 
                aria-label="Sidebar"
            >

                <div className="sidebar-header">
                        <Link to={ADMIN_HOME} className="ms-5 md:me-15">
                            <img src="../../unison-letters.svg" className="h-8 me-3" alt="unison logo" />
                        </Link>
                        <button className={`${openToggleButton ? 'block' : 'hidden'}`} onClick={toggleSidebar}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="sidebar-item-icon"
                                viewBox="-1 -1 23 23"
                                aria-hidden="true"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M4.5 6.5h12m-12.002 4h11.997M4.5 14.5h11.995"/>
                            </svg>
                        </button>
                </div>
                <div className="sidebar-body">
                    <div className="space-y-1">

                        {/************************ GENERAL ************************/}
                        <div>
                            <p className="sidebar-section-title">
                                General
                            </p>
                        </div>
                        <div>
                            <NavLink to={ADMIN_HOME} end className="sidebar-item-group group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    viewBox="-1 -1 23 23"
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m1.5 10.5l9-9l9 9"/>
                                    <path d="M3.5 8.5v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>
                                </svg>                        
                                <span className="sidebar-item-text">
                                    Inicio
                                </span>
                            </NavLink>
                        </div>
                        <div>
                            <SidebarCollapse
                                title="Alumnos"
                                links={[
                                    { label: 'Usuarios', to: adminAbs(ROUTES.ADMIN.USER_LIST), className: 'sidebar-item-link' },
                                    { label: 'Pre-registro', to: adminAbs(ROUTES.ADMIN.USER_ENROLLMENT_LIST), className: 'sidebar-item-link' },
                                ]}
                                icon={
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z"/>
                                    </svg>
                                }
                            />
                        </div>

                        {/************************ INTERNADO ************************/}
                        <div>
                            <p className="sidebar-section-title border-t">
                                Internado y servicio social
                            </p>
                        </div>
                        <div>
                            <SidebarCollapse
                                title="Internado"
                                links={[
                                    { label: 'Promociones', to: promotionListPath(PROGRAMS.INTERNSHIP), className: 'sidebar-item-link' },
                                    { label: 'Documentos requeridos', to: documentRequirementsPath(PROGRAMS.INTERNSHIP), className: 'sidebar-item-link' },
                                    { label: 'Inscripciones', to: adminAbs(ROUTES.ADMIN.INTERNSHIP_APPLICATION_LIST), className: 'sidebar-item-link' },
                                    { label: 'Resultados del acto', to: adminAbs(ROUTES.ADMIN.INTERNSHIP_PLAZA_RESULTS), className: 'sidebar-item-link' },
                                ]}
                                icon={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="sidebar-item-icon"
                                        width="32" 
                                        height="32" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path fill="currentColor" d="M11.25 12.75v3q0 .317.216.534q.217.216.534.216t.534-.216q.216-.217.216-.534v-3h3q.317 0 .534-.216q.216-.217.216-.534t-.216-.534q-.217-.216-.534-.216h-3v-3q0-.317-.216-.534Q12.317 7.5 12 7.5t-.534.216q-.216.217-.216.534v3h-3q-.317 0-.534.216q-.216.217-.216.534t.216.534q.217.216.534.216zM5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h12.769q.69 0 1.153.463T20 5.616v12.769q0 .69-.462 1.153T18.384 20zm0-1h12.769q.23 0 .423-.192t.192-.424V5.616q0-.231-.192-.424T18.384 5H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192M5 5v14z"/>
                                    </svg>             
                                }
                            />
                        </div>
                        <div>
                            <SidebarCollapse
                                title="Servicio social"
                                links={[
                                    { label: 'Promociones', to: promotionListPath(PROGRAMS.SOCIAL_SERVICE), className: 'sidebar-item-link' },
                                    { label: 'Documentos requeridos', to: documentRequirementsPath(PROGRAMS.SOCIAL_SERVICE), className: 'sidebar-item-link' },
                                    { label: 'Inscripciones', to: adminAbs(ROUTES.ADMIN.SOCIAL_SERVICE_APPLICATION_LIST), className: 'sidebar-item-link' },
                                    { label: 'Resultados del acto', to: adminAbs(ROUTES.ADMIN.SOCIAL_SERVICE_PLAZA_RESULTS), className: 'sidebar-item-link' },
                                ]}
                                icon={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="sidebar-item-icon"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect x="4" y="7" width="16" height="13" rx="1.6"/>
                                        <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/>
                                        <path d="M12 10.5v6m-3-3h6"/>
                                    </svg>
                                }
                            />
                        </div>
                        <div>
                            <SidebarCollapse
                                title="Sedes"
                                links={[
                                    { label: 'Sedes', to: adminAbs(ROUTES.ADMIN.SITE_LIST), className: 'sidebar-item-link' },
                                    { label: 'Instituciones', to: adminAbs(ROUTES.ADMIN.INSTITUTION_LIST), className: 'sidebar-item-link' },
                                ]}
                                icon={
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        width="28" 
                                        height="28" 
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path d="M12 21.325q-.35 0-.7-.125t-.625-.375Q9.05 19.325 7.8 17.9t-2.087-2.762t-1.275-2.575T4 10.2q0-3.75 2.413-5.975T12 2t5.588 2.225T20 10.2q0 1.125-.437 2.363t-1.275 2.575T16.2 17.9t-2.875 2.925q-.275.25-.625.375t-.7.125M12 12q.825 0 1.413-.587T14 10t-.587-1.412T12 8t-1.412.588T10 10t.588 1.413T12 12"/>
                                        {/* <path fill="currentColor" d="M12 20.556q-.235 0-.47-.077t-.432-.25q-1.067-.981-2.164-2.185q-1.096-1.203-1.99-2.493t-1.468-2.633t-.572-2.622q0-3.173 2.066-5.234Q9.037 3 12 3t5.03 2.062q2.066 2.061 2.066 5.234q0 1.279-.572 2.613q-.572 1.333-1.458 2.632q-.885 1.3-1.981 2.494T12.92 20.21q-.191.173-.434.26q-.244.086-.487.086m.004-8.825q.667 0 1.14-.476q.472-.475.472-1.143t-.476-1.14t-1.143-.472t-1.14.476t-.472 1.143t.475 1.14t1.144.472"/> */}
                                    </svg>
                                }
                            />
                        </div>
                        <div>
                            <Link to={adminAbs(ROUTES.ADMIN.REPORT_LIST)} className="sidebar-item-group group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    width="32" 
                                    height="32" 
                                    viewBox="0 0 24 24"
                                >
                                    <path fill="currentColor" d="M5.616 20q-.667 0-1.141-.475T4 18.386V5.615q0-.666.475-1.14T5.615 4h4.7q-.136-.766.367-1.383Q11.184 2 12.01 2t1.328.617T13.685 4h4.7q.666 0 1.14.475T20 5.615v12.77q0 .666-.475 1.14t-1.14.475zm0-1h12.769q.23 0 .423-.192t.192-.424V5.616q0-.231-.192-.424T18.384 5H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192M8 16.27h5q.213 0 .356-.145t.144-.356t-.144-.356t-.356-.144H8q-.213 0-.356.144q-.144.144-.144.357t.144.356t.356.143M8 12.5h8q.213 0 .356-.144t.144-.357t-.144-.356T16 11.5H8q-.213 0-.356.144t-.144.357t.144.356T8 12.5m0-3.77h8q.213 0 .356-.143q.144-.144.144-.357t-.144-.356T16 7.731H8q-.213 0-.356.144t-.144.357t.144.356T8 8.73m4-4.289q.325 0 .538-.212t.212-.538t-.213-.537T12 2.942t-.537.213t-.213.537t.213.538t.537.212M5 19V5z"/>
                                </svg>                        
                                <span className="sidebar-item-text">
                                    Reportes
                                </span>
                            </Link>
                        </div>

                        <div>
                            <Link to={adminAbs(ROUTES.ADMIN.ANNOUNCEMENTS_LIST)} className="sidebar-item-group group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    width="32" 
                                    height="32" 
                                    viewBox="0 0 26 26"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path d="M18.008 2.987C19.34 2.225 21 3.187 21 4.723v12.554c0 1.535-1.659 2.498-2.992 1.736L14 16.723V5.277zM12 6H7a5 5 0 0 0-1 9.9v3.6a2.5 2.5 0 0 0 5 0V16h1z" clipRule="evenodd"/>
                                </svg>                        
                                <span className="sidebar-item-text">
                                    Avisos
                                </span>
                            </Link>
                        </div>
                        <div>
                            <Link to={adminAbs(ROUTES.ADMIN.SURVEY_LIST)} className="sidebar-item-group group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    width="32" 
                                    height="32" 
                                    viewBox="0 0 24 24"
                                >
                                    <path fill="currentColor" d="M16.116 10q.213 0 .356-.143q.144-.143.144-.357t-.144-.357T16.115 9H12.5q-.213 0-.357.143T12 9.5t.143.357t.357.143zm0 5q.213 0 .356-.143q.144-.143.144-.357t-.144-.357t-.357-.143H12.5q-.213 0-.357.143T12 14.5t.143.357t.357.143zM9 10.73q.517 0 .874-.356t.357-.874t-.357-.874T9 8.269t-.874.357t-.357.874t.357.874t.874.357m0 5q.517 0 .874-.357t.357-.874t-.357-.874T9 13.269t-.874.357t-.357.874t.357.874t.874.357M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h12.769q.69 0 1.153.463T20 5.616v12.769q0 .69-.462 1.153T18.384 20zm0-1h12.769q.23 0 .423-.192t.192-.424V5.616q0-.231-.192-.424T18.384 5H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192M5 5v14z"/>
                                </svg>                        
                                <span className="sidebar-item-text">
                                    Encuestas
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>     
            </aside>
        </div>
    );
}

export default Sidebar;
