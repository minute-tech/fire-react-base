import React, { Component } from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

// Pages
import Home from './components/pages/Home';

import UserLogin from './components/user/auth/UserLogin.js';
import UserRegister from './components/user/auth/UserRegister';
// import UserLoggingIn from './components/user/auth/UserLoggingIn';
import UserDashboard from './components/user/dashboard/UserDashboard';
// import UserProfile from './components/user/dashboard/UserProfile';
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

                    {/* <Route
                        path="/user/logging-in" 
                        element={<ErrorBoundary><UserLoggingIn user={this.props.user}/></ErrorBoundary>}
                    /> */}
                    <Route element={<ErrorBoundary><VisitorRoutes isUser={this.props.user} /></ErrorBoundary>}>
                        <Route path="/user/register" element={<ErrorBoundary><UserRegister user={this.props.user}/></ErrorBoundary>}/>
                        <Route path="/user/login" element={<ErrorBoundary><UserLogin user={this.props.user}/></ErrorBoundary>}/>
                    </Route>
                    
                    {/* isNotMFA={this.props.user?.multiFactor?.enrolledFactors && this.props.user.multiFactor.enrolledFactors.length === 0} */}
                    <Route element={<ErrorBoundary><UserRoutes isUser={this.props.user} /></ErrorBoundary>}>
                        <Route path="/user/dashboard" element={<ErrorBoundary><UserDashboard user={this.props.user} userLogged={this.props.userLogged}/></ErrorBoundary>}/>
                        {/* <Route path="/user/dashboard" element={<ErrorBoundary><UserProfile user={this.props.user}/></ErrorBoundary>}/> */}
                    </Route>
                        
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
      return <Navigate to="/user/dashboard" state={{ from: location }} />;
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
      return <Navigate to="/user/login" state={{ from: location }} />;
    }
  
    return <Outlet />;
}



export default withRouter(Views);