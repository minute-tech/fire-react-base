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

class Views extends Component {
    render() {
        return (
                <Routes>
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

                    <Route element={<ErrorBoundary><VisitorRoutes isUser={this.props.fireUser} /></ErrorBoundary>}>
                        <Route 
                            path="/register" 
                            element={
                                <Register 
                                    fireUser={this.props.fireUser}
                                />
                            }
                        />
                        <Route 
                            path="/login"
                            element={
                                <Login 
                                    fireUser={this.props.fireUser}
                                />
                            }
                        />
                    </Route>
                    
                    {/* isNotMFA={this.props.user?.multiFactor?.enrolledFactors && this.props.user.multiFactor.enrolledFactors.length === 0} */}
                    <Route element={<ErrorBoundary><UserRoutes isUser={this.props.fireUser} /></ErrorBoundary>}>
                        <Route 
                            path="/dashboard" 
                            element={
                                <Dashboard 
                                    fireUser={this.props.fireUser} 
                                    readOnlyFlags={this.props.readOnlyFlags}
                                    user={this.props.user}
                                    userLoggedOut={this.props.userLoggedOut} 
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

                    <Route element={<ErrorBoundary><AdminRoutes isAdmin={this.props?.readOnlyFlags?.isAdmin} /></ErrorBoundary>}>
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

function VisitorRoutes({ isUser }) {
    // console.log("VisitorRoutes isUser: " + isUser)
    let location = useLocation();
    if (isUser) {
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

function UserRoutes({ isUser }) {
    // console.log("UserRoutes isUser: " + isUser)
    let location = useLocation();
    if (!isUser) {
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

function AdminRoutes({ isAdmin }) {
    // console.log("AdminRoutes isAdmin: " + isAdmin)
    let location = useLocation();
    if (!isAdmin) {
        toast.warn("Sorry, but you need to be an administrator to access this page.", {
            toastId: 'admin',
        });
        return <Navigate to="/dashboard" state={{ from: location }} />;
    } else {
        return <Outlet />;
    }
}



export default withRouter(Views);