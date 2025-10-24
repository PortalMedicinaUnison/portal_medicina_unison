import { Link, NavLink } from 'react-router-dom';
import { ROUTES } from '../config';
import { useUser } from '../contexts/UserContext';
import SidebarCollapse from '../utils/ui/CollapseMenu';


function StudentSidebar({ toggleSidebar, openToggleButton }) {
    return (
        <div id="sidebar">
            <aside 
                id="logo-sidebar" 
                className="sidebar-container" 
                aria-label="Sidebar"
            >

                <div className="sidebar-header">
                        <Link to={ROUTES.HOME} className="ms-5 md:me-15">
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
                            <NavLink to={ROUTES.HOME} className="sidebar-item-group group">
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

                            <NavLink to={ROUTES.ADMIN.REPORT_LIST} className="sidebar-item-group group">
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
                            </NavLink>

                            <NavLink to={ROUTES.USER.SURVEYS_LIST} className="sidebar-item-group group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    viewBox="0 1 23 23"
                                    aria-hidden="true"
                                    fill="none"
                                >
                                    <path fill="currentColor" d="M5.616 20q-.691 0-1.153-.462T4 18.384V15.5q0-.213.143-.357T4.5 15t.357.143T5 15.5v2.885q0 .23.192.423t.423.192H8.5q.214 0 .357.143T9 19.5t-.143.357T8.5 20zm12.769 0H15.5q-.213 0-.357-.143T15 19.5t.143-.357T15.5 19h2.885q.23 0 .423-.192t.192-.424V15.5q0-.213.143-.357T19.5 15t.357.143t.143.357v2.885q0 .69-.462 1.152T18.384 20M4 5.616q0-.691.463-1.153T5.616 4H8.5q.214 0 .357.143T9 4.5t-.143.357T8.5 5H5.616q-.231 0-.424.192T5 5.616V8.5q0 .214-.143.357T4.5 9t-.357-.143T4 8.5zm16 0V8.5q0 .214-.143.357T19.5 9t-.357-.143T19 8.5V5.616q0-.231-.192-.424T18.384 5H15.5q-.213 0-.357-.143T15 4.5t.143-.357T15.5 4h2.885q.69 0 1.152.463T20 5.616m-7.961 11.596q.332 0 .56-.228t.228-.561t-.228-.56t-.56-.228t-.561.228t-.228.56t.228.56t.56.229m0-9.493q.766 0 1.32.487q.556.486.556 1.227q0 .536-.315.977q-.314.44-.72.796q-.65.594-.968 1.107t-.369 1.122q-.025.196.116.333q.14.138.342.138q.196 0 .34-.135q.143-.134.174-.336q.069-.425.3-.76t.725-.829q.759-.76 1.047-1.278t.287-1.152q0-1.158-.782-1.893q-.783-.734-2.014-.734q-.852 0-1.559.385t-1.132 1.12q-.092.166-.021.353q.07.188.26.255q.171.067.365.01t.316-.218q.333-.427.762-.7t.97-.275"/>
                                </svg>
                                <span className="sidebar-item-text">
                                    Encuestas
                                </span>
                            </NavLink>
                        </div>
                        {/************************ INTERNADO ************************/}
                        <div>
                            <p className="sidebar-section-title border-t">
                                Internado
                            </p>
                        </div>
                        <div>
                            <Link to={ROUTES.USER.INTERNSHIP_REDIRECT} className="sidebar-item-group group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sidebar-item-icon"
                                    width="32" 
                                    height="32" 
                                    viewBox="0 0 24 24"
                                >
                                    <path fill="currentColor" d="M11.25 12.75v3q0 .317.216.534q.217.216.534.216t.534-.216q.216-.217.216-.534v-3h3q.317 0 .534-.216q.216-.217.216-.534t-.216-.534q-.217-.216-.534-.216h-3v-3q0-.317-.216-.534Q12.317 7.5 12 7.5t-.534.216q-.216.217-.216.534v3h-3q-.317 0-.534.216q-.216.217-.216.534t.216.534q.217.216.534.216zM5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h12.769q.69 0 1.153.463T20 5.616v12.769q0 .69-.462 1.153T18.384 20zm0-1h12.769q.23 0 .423-.192t.192-.424V5.616q0-.231-.192-.424T18.384 5H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192M5 5v14z"/>
                                </svg>               
                                <span className="sidebar-item-text">
                                    Internado
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>     
            </aside>
        </div>
    );
}

export default StudentSidebar;
