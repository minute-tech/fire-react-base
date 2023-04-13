import React from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useTheme } from 'styled-components';
import { toast } from 'react-toastify';
import { multiFactor } from 'firebase/auth';

import { checkIfRoleIsAdmin, urlify } from './utils/misc';
import { Wrapper } from './utils/styles/misc';
import { ADMIN, ITEMS } from './utils/constants';

// Pages //
// Misc
import Home from './components/pages/misc/Home';
import About from './components/pages/misc/About';
import Credits from './components/pages/misc/Credits';
import PrivacyPolicy from './components/pages/misc/PrivacyPolicy';
import TermsConditions from './components/pages/misc/TermsConditions';
import ErrorBoundary from './components/pages/misc/ErrorBoundary';
import Page404 from './components/pages/misc/Page404';
import CustomPage from './components/pages/misc/CustomPage';
import GiftShipForm from './components/pages/misc/GiftShipForm';
// User
import Login from './components/pages/user/auth/Login';
import Register from './components/pages/user/auth/Register';
import LoggingIn from './components/pages/user/auth/LoggingIn';
import Dashboard from './components/pages/user/dashboard/Dashboard';
import Profile from './components/pages/user/dashboard/Profile';
// Admin
import AdminDashboard from './components/pages/user/admin/AdminDashboard';
import ManageSite from './components/pages/user/admin/ManageSite';
import ManageUsers from './components/pages/user/admin/ManageUsers';
import ManageRoles from './components/pages/user/admin/ManageRoles';
import ManageMessages from './components/pages/user/admin/ManageMessages';
import ManageFeedback from './components/pages/user/admin/ManageFeedback';
import ManagePages from './components/pages/user/admin/ManagePages';

function Views(props) {
    const theme = useTheme();

    // Loading the font as an inline style here, instead of in the Global variable for styled-components 
    // prevents the flashing of the font every load
    // If the value is a URL for either of the fonts, then load from URL
    let css = ``;
    if (theme.font.heading.url.includes("https://") && theme.font.body.url.includes("https://")) {
        css = `
            @font-face {
                font-family: ${theme.font.heading.name ? theme.font.heading.name : "Arial, Helvetica, sans-serif"};
                src: url(${theme.font.heading.url}) format("truetype");
            }

            @font-face {
                font-family: ${theme.font.subheading.name ? theme.font.subheading.name : "Arial, Helvetica, sans-serif"};
                src: url(${theme.font.subheading.url}) format("truetype");
            }

            @font-face {
                font-family: ${theme.font.body.name ? theme.font.body.name : "Arial, Helvetica, sans-serif"};
                src: url(${theme.font.body.url}) format("truetype");
            }
        `
    }

    return (
        <>
        {css && (<>
            <style>{css}</style>
        </>
        )}
        <Routes>
            <Route 
                index
                path="/"
                element={
                    <ErrorBoundary>
                        <Home site={props.site} />
                    </ErrorBoundary>
                }
            />
            <Route 
                path="/about" 
                element={
                    <ErrorBoundary>
                        <About site={props.site} />
                    </ErrorBoundary>
                }
            />
            <Route 
                path="/credits" 
                element={
                    <ErrorBoundary>
                        <Credits site={props.site} />
                    </ErrorBoundary>
                }
            />
            <Route 
                path="/privacy-policy" 
                element={
                    <ErrorBoundary>
                        <PrivacyPolicy site={props.site} />
                    </ErrorBoundary>
                }
            />
            <Route 
                path="/terms-conditions" 
                element={
                    <ErrorBoundary>
                        <TermsConditions site={props.site} />
                    </ErrorBoundary>
                }
            />
            <Route 
                path="/logging-in" 
                element={
                    <ErrorBoundary>
                        <LoggingIn {...props} />
                    </ErrorBoundary>
                }
            />
            <Route 
                path="/gift-ship-form" 
                element={
                    <ErrorBoundary>
                        <GiftShipForm {...props} />
                    </ErrorBoundary>
                }
            />

            {/* Dynamic pages */}
            {
                props.pages.map((page, p) => {
                    let pageUrl = urlify(page.name);
                    return (
                        <Route 
                            key={p}
                            path={pageUrl} 
                            element={
                                <ErrorBoundary>
                                    <CustomPage
                                        {...props}
                                        page={page}
                                    />
                                </ErrorBoundary>
                            }
                        />
                    );
                    
                })
            }

            {/* Visitor ONLY routes */}
            <Route 
                element={
                    <ErrorBoundary>
                        <VisitorRoutes {...props} />
                    </ErrorBoundary>
                }
            >
                <Route 
                    path="/register" 
                    element={ <Register {...props} /> }
                />
                <Route 
                    path="/login"
                    element={ <Login {...props} /> }
                />
            </Route>
            
            {/* User ONLY routes */}
            <Route 
                element={
                    <ErrorBoundary>
                        <UserRoutes {...props} />
                    </ErrorBoundary>
                }
            >
                <Route 
                    path="dashboard"
                    element={
                        <Wrapper>
                            <Outlet />
                        </Wrapper> 
                    }
                >
                    <Route 
                        index
                        element={ <Dashboard {...props} /> }
                    />
                    <Route 
                        path="profile" 
                        element={ <Profile {...props} /> }
                    />
                    {/* Admin ONLY routes */}
                    <Route 
                        element={
                            <ErrorBoundary>
                                <AdminRoutes 
                                    {...props}
                                    isAdmin={checkIfRoleIsAdmin(props.customClaims.role, props.roles)}
                                />
                            </ErrorBoundary>
                        }
                    >
                        <Route 
                            path="admin" 
                            element={ <Outlet /> }
                        >
                            <Route 
                                index
                                element={ <AdminDashboard {...props} /> }
                            />
                            {/* Normal ADMIN */}
                            <Route 
                                path={ITEMS.MESSAGES.COLLECTION}
                                element={ <ManageMessages {...props} /> }
                            />
                            <Route
                                path={ITEMS.FEEDBACK.COLLECTION}
                                element={ <ManageFeedback {...props} /> }
                            />
                        </Route>
                    </Route>
                    <Route 
                        element={
                            <ErrorBoundary>
                                <SuperRoutes 
                                    {...props}
                                    isSuper={props.customClaims.role === ADMIN.SUPER}
                                />
                            </ErrorBoundary>
                        }
                    >
                        <Route 
                            path="admin" 
                            element={ <Outlet /> }
                        >
                            {/* SUPER ADMIN ONLY */}
                            <Route 
                                index
                                element={ <AdminDashboard {...props} /> }
                            />
                            <Route
                                path="site" 
                                element={ <ManageSite {...props} /> }
                            />
                            <Route 
                                path={ITEMS.PAGES.COLLECTION}
                                element={ <ManagePages {...props} /> }
                            />
                            <Route 
                                path={ITEMS.USERS.COLLECTION} 
                                element={ <ManageUsers {...props} /> }
                            />
                            <Route 
                                path={ITEMS.ROLES.COLLECTION}
                                element={ <ManageRoles {...props} /> }
                            />
                        </Route>
                    </Route>
                </Route>
            </Route>
            <Route path="*" element={<Page404 site={props.site} />} />
        </Routes>
        </>
        
    )
}

function VisitorRoutes({ fireUser, isLoggingIn }) {
    let location = useLocation();
    if (fireUser && !isLoggingIn) {
        // ** ID needed to be defined so doesnt render twice:
        // https://stackoverflow.com/questions/62578112/react-toastify-showing-multiple-toast
        toast.warn("Sorry, but you need to be signed out to access this page.", {
            toastId: 'visitor',
        });
        return <Navigate to="/dashboard" state={{ from: location }} />;
    } else {
        return <Outlet />;
    }
  
}

function UserRoutes({ fireUser, isLoggingIn }) {
    let location = useLocation();
    if (!fireUser && !isLoggingIn) {
        toast.warn("Sorry, but you need to be signed in to access this page.", {
            toastId: 'user',
        });
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} />;
    } else {
        return <Outlet />;
    }
}

function AdminRoutes({ isAdmin, isLoggingIn, fireUser }) {
    const location = useLocation();
    const mfaUser = multiFactor(fireUser);

    if (!isAdmin && !isLoggingIn) {
        toast.warn("Sorry, but you need to be an administrator to access this page.", {
            toastId: 'admin',
        });

        return <Navigate to="/dashboard" state={{ from: location }} />;
    } else if ((mfaUser?.enrolledFactors.length ?? 0) === 0) {
        toast.warn(`Sorry, but you need to enable 2FA to view admin pages. ${!fireUser.emailVerified ? "Start by verifying your email below." : "Secure your account on this page!"}`, {
            toastId: 'admin-2fa',
        });
        return <Navigate to="/dashboard/profile" state={{ from: location }} />;
    } else {
        return <Outlet />;
    }
}

function SuperRoutes({ isSuper, isLoggingIn, fireUser }) {
    const location = useLocation();
    const mfaUser = multiFactor(fireUser);

    if (!isSuper && !isLoggingIn) {
        toast.warn("Sorry, but you need to be a super administrator to access this page.", {
            toastId: 'super-admin',
        });

        return <Navigate to="/dashboard" state={{ from: location }} />;
    } else if ((mfaUser?.enrolledFactors.length ?? 0) === 0) {
        toast.warn(`Sorry, but you need to enable 2FA to view admin pages. ${!fireUser.emailVerified ? "Start by verifying your email below." : "Secure your account on this page!"}`, {
            toastId: 'super-admin-2fa',
        });
        return <Navigate to="/dashboard/profile" state={{ from: location }} />;
    } else {
        return <Outlet />;
    }
}

export default Views;