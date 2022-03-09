import React, { Component } from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';

import { withRouter } from './utils/hocs';

// Pages //
// Misc
import Home from './components/pages/misc/Home';
import About from './components/pages/misc/About';
import Credits from './components/pages/misc/Credits';
import PrivacyPolicy from './components/pages/misc/PrivacyPolicy';
import TermsConditions from './components/pages/misc/TermsConditions';
import ErrorBoundary from './components/pages/misc/ErrorBoundary';
import Page404 from './components/pages/misc/Page404';
// User
import Login from './components/pages/user/auth/Login';
import Register from './components/pages/user/auth/Register';
import LoggingIn from './components/pages/user/auth/LoggingIn';
import Dashboard from './components/pages/user/dashboard/Dashboard';
import Profile from './components/pages/user/dashboard/Profile';
// Admin
import AdminDashboard from './components/pages/user/admin/AdminDashboard';
import AdminMessages from './components/pages/user/admin/AdminMessages';

class Views extends Component {
    render() {
        return (
            <Routes>
                {/* Anyone routes */}
                <Route 
                    index 
                    path="/" 
                    element={<ErrorBoundary><Home site={this.props.site} /></ErrorBoundary>}
                />

                <Route 
                    path="/about" 
                    element={<ErrorBoundary><About site={this.props.site} /></ErrorBoundary>}
                />

                <Route 
                    path="/credits" 
                    element={<ErrorBoundary><Credits site={this.props.site} /></ErrorBoundary>}
                />

                <Route 
                    path="/privacy-policy" 
                    element={<ErrorBoundary><PrivacyPolicy site={this.props.site} /></ErrorBoundary>}
                />

                <Route 
                    path="/terms-conditions" 
                    element={<ErrorBoundary><TermsConditions site={this.props.site} /></ErrorBoundary>}
                />

                <Route 
                    path="/logging-in" 
                    element={
                        <ErrorBoundary>
                            <LoggingIn
                                site={this.props.site} 
                                fireUser={this.props.fireUser}
                                userLoggingIn={this.props.userLoggingIn}  
                            />
                        </ErrorBoundary>
                    }
                />
                
                {/* Visitor ONLY routes */}
                <Route 
                    element={
                        <ErrorBoundary>
                            <VisitorRoutes 
                                site={this.props.site} 
                                isUser={this.props.fireUser} 
                                isLoggingIn={this.props.isLoggingIn} 
                            />
                        </ErrorBoundary>
                    }
                >
                    <Route 
                        path="/register" 
                        element={
                            <Register 
                                site={this.props.site} 
                                fireUser={this.props.fireUser}
                                userLoggingIn={this.props.userLoggingIn}
                            />
                        }
                    />
                    <Route 
                        path="/login"
                        element={
                            <Login 
                                site={this.props.site} 
                                fireUser={this.props.fireUser}
                                userLoggingIn={this.props.userLoggingIn}
                            />
                        }
                    />
                </Route>
                
                {/* User ONLY routes */}
                {/* isNotMFA={this.props.fireUser?.multiFactor?.enrolledFactors && this.props.fireUser.multiFactor.enrolledFactors.length === 0} */}
                <Route 
                    element={
                        <ErrorBoundary>
                            <UserRoutes 
                                site={this.props.site} 
                                isUser={this.props.fireUser} 
                                isLoggingIn={this.props.isLoggingIn} 
                            />
                        </ErrorBoundary>
                    }
                >
                    <Route 
                        path="/dashboard" 
                        element={
                            <Dashboard 
                                site={this.props.site} 
                                fireUser={this.props.fireUser} 
                                readOnlyFlags={this.props.readOnlyFlags}
                                user={this.props.user}
                                userLoggingOut={this.props.userLoggingOut} 
                            />
                        }
                    />
                    <Route 
                        path="/profile" 
                        element={
                            <Profile 
                                site={this.props.site} 
                                fireUser={this.props.fireUser} 
                                readOnlyFlags={this.props.readOnlyFlags}
                                user={this.props.user}
                            />
                        }
                    />
                </Route>

                {/* Admin ONLY routes */}
                <Route 
                    element={
                        <ErrorBoundary>
                            <AdminRoutes 
                                site={this.props.site} 
                                isAdmin={this.props?.readOnlyFlags?.isAdmin} 
                                isLoggingIn={this.props.isLoggingIn} 
                            />
                        </ErrorBoundary>
                    }
                >
                    <Route 
                        path="/admin/dashboard" 
                        element={
                            <AdminDashboard 
                                site={this.props.site} 
                                fireUser={this.props.fireUser} 
                                readOnlyFlags={this.props.readOnlyFlags}
                                user={this.props.user}
                            />
                        }
                    />
                    <Route 
                        path="/admin/messages" 
                        element={
                            <AdminMessages
                                site={this.props.site} 
                                fireUser={this.props.fireUser} 
                                readOnlyFlags={this.props.readOnlyFlags}
                                user={this.props.user}
                            />
                        }
                    />
                </Route>

                <Route path="*" element={<ErrorBoundary><Page404 site={this.props.site} /></ErrorBoundary>} />
            </Routes>
        )
    }
}

function VisitorRoutes({ isUser, isLoggingIn }) {
    let location = useLocation();
    if (isUser && !isLoggingIn) {
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

function UserRoutes({ isUser, isLoggingIn }) {
    let location = useLocation();
    if (!isUser && !isLoggingIn) {
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

function AdminRoutes({ isAdmin, isLoggingIn }) {
    let location = useLocation();
    if (!isAdmin && !isLoggingIn) {
        toast.warn("Sorry, but you need to be an administrator to access this page.", {
            toastId: 'admin',
        });
        return <Navigate to="/dashboard" state={{ from: location }} />;
    } else {
        return <Outlet />;
    }
}



export default withRouter(Views);