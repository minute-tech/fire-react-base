import React, { Component } from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

// Pages
import Home from './components/pages/Home';

import Login from './components/user/auth/Login.js';
import Register from './components/user/auth/Register';
import Dashboard from './components/user/dashboard/Dashboard';
// import Profile from './components/user/dashboard/Profile';
import ErrorBoundary from './components/misc/ErrorBoundary';
import About from './components/pages/About';
import Credits from './components/pages/Credits';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import TermsConditions from './components/pages/TermsConditions';
import { withRouter } from './utils/hocs';
// import Page404 from "./components/misc/Page404";

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
                                <ErrorBoundary>
                                    <Register 
                                        fireUser={this.props.fireUser}
                                    />
                                </ErrorBoundary>
                            }
                        />
                        <Route 
                            path="/login"
                            element={
                                <ErrorBoundary>
                                    <Login 
                                        fireUser={this.props.fireUser}
                                    />
                                </ErrorBoundary>
                            }
                        />
                    </Route>
                    
                    {/* isNotMFA={this.props.user?.multiFactor?.enrolledFactors && this.props.user.multiFactor.enrolledFactors.length === 0} */}
                    <Route element={<ErrorBoundary><UserRoutes isUser={this.props.fireUser} /></ErrorBoundary>}>
                        <Route 
                            path="/dashboard" 
                            element={
                                <ErrorBoundary>
                                    <Dashboard 
                                        fireUser={this.props.fireUser} 
                                        user={this.props.user}
                                        userLoggedOut={this.props.userLoggedOut} 
                                    />
                                </ErrorBoundary>
                            }
                        />
                        {/* <Route path="/profile" element={<ErrorBoundary><Profile fireUser={this.props.fireUser}/></ErrorBoundary>}/> */}
                    </Route>
                    {/* TODO: fix 404 page */}
                    {/* <Route element={() => <ErrorBoundary><Page404 /></ErrorBoundary>} /> */}
                </Routes>
        )
    }
}

// TODO add alerts here with new lib
// **These logics seem to be working backwards....
function VisitorRoutes({ isUser }) {
    let location = useLocation();
    if (isUser) {
      return <Navigate to="/dashboard" state={{ from: location }} />;
    }
  
    return <Outlet />;
}

function UserRoutes({ isUser }) {
    let location = useLocation();
    if (!isUser) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return <Navigate to="/login" state={{ from: location }} />;
    }
  
    return <Outlet />;
}



export default withRouter(Views);