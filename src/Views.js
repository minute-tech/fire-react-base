import React, { Component } from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';

import { withRouter } from './utils/hocs';

// Pages
import Home from './components/pages/Home';
import Login from './components/user/auth/Login.js';
import Register from './components/user/auth/Register';
import Dashboard from './components/user/dashboard/Dashboard';
import Profile from './components/user/dashboard/Profile';
import ErrorBoundary from './components/misc/ErrorBoundary';
import About from './components/pages/About';
import Credits from './components/pages/Credits';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import TermsConditions from './components/pages/TermsConditions';
import Page404 from './components/misc/Page404';
import AdminDashboard from './components/user/admin/AdminDashboard';
import AdminMessages from './components/user/admin/AdminMessages';
import LoggingIn from './components/user/auth/LoggingIn';

class Views extends Component {
    render() {
        return (
                <Routes>
                    {/* Anyone routes */}
                    <Route 
                        index 
                        path="/" 
                        element={<ErrorBoundary><Home /></ErrorBoundary>}
                    />

                    <Route 
                        path="/about" 
                        element={<ErrorBoundary><About /></ErrorBoundary>}
                    />

                    <Route 
                        path="/credits" 
                        element={<ErrorBoundary><Credits /></ErrorBoundary>}
                    />

                    <Route 
                        path="/privacy-policy" 
                        element={<ErrorBoundary><PrivacyPolicy /></ErrorBoundary>}
                    />

                    <Route 
                        path="/terms-conditions" 
                        element={<ErrorBoundary><TermsConditions /></ErrorBoundary>}
                    />

                    <Route 
                        path="/logging-in" 
                        element={
                            <ErrorBoundary>
                                <LoggingIn
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
                                    fireUser={this.props.fireUser}
                                    userLoggingIn={this.props.userLoggingIn}
                                />
                            }
                        />
                        <Route 
                            path="/login"
                            element={
                                <Login 
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
                                    fireUser={this.props.fireUser} 
                                    readOnlyFlags={this.props.readOnlyFlags}
                                    user={this.props.user}
                                />
                            }
                        />
                    </Route>

                    <Route path="*" element={<ErrorBoundary><Page404 /></ErrorBoundary>} />
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