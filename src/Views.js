import React, { Component } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import { withRouter } from './utils/misc';

// Pages
import Home from './components/pages/Home';
// import UserLoggingIn from './components/user/auth/UserLoggingIn';
// import UserLogin from './components/user/auth/UserLogin.js';
// import UserRegister from './components/user/auth/UserRegister';
// import UserDashboard from './components/user/dashboard/UserDashboard';
// import UserProfile from './components/user/dashboard/UserProfile';
import ErrorBoundary from './components/misc/ErrorBoundary';
import About from './components/pages/About';
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
                    {/* TODO: add back errorboundary funcationality */}

                    {/* User */}
                    {/* <Route 
                        path="/user/logging-in" 
                        exact 
                        component={
                            () => (
                                <ErrorBoundary>
                                    <UserLoggingIn 
                                        user={this.props.user}
                                    />
                                </ErrorBoundary>
                            )
                        } 
                    />
                    <VisitorRoute 
                        exact 
                        path="/user/login" 
                        isUser={this.props.user} 
                        component={
                            () => (
                                <ErrorBoundary>
                                    <UserLogin 
                                        user={this.props.user}
                                    />
                                </ErrorBoundary>
                            )
                        } 
                    />
                    <VisitorRoute 
                        exact 
                        path="/user/register" 
                        isUser={this.props.user} 
                        component={
                            () => (
                                <ErrorBoundary>
                                    <UserRegister
                                        user={this.props.user}
                                    />
                                </ErrorBoundary>
                            )
                        } 
                    />
                    <UserRoute 
                        exact 
                        path="/user/dashboard" 
                        isUser={this.props.user} 
                        isNotMFA={this.props.user?.multiFactor?.enrolledFactors && this.props.user.multiFactor.enrolledFactors.length === 0}
                        component={
                            () => (
                                <ErrorBoundary>
                                    <UserDashboard 
                                        user={this.props.user}
                                    />
                                </ErrorBoundary>
                            )
                        } 
                    />
                    <UserRoute 
                        exact 
                        path="/user/profile" 
                        isUser={this.props.user} 
                        component={
                            () => (
                                <ErrorBoundary>
                                    <UserProfile 
                                        user={this.props.user}
                                    />
                                </ErrorBoundary>
                            )
                        } 
                    /> */}
                        
                    {/* <Route element={() => <ErrorBoundary><Page404 /></ErrorBoundary>} /> */}
                </Routes>
        )
    }
}

//Must be signed in to view
// const UserRoute = ({ component: Comp, isUser, isNotMFA, path }) => {
//     // ** Couldn't get the react-notif library to alert in style... default alert will work fine
//     // Was getting error: "cannot update during an existing state transition..."
//     if(!isUser){
//         alert("Please log in as a user.")
//         return (
//             <Route
//                 path={path}
//                 render={() => {
//                     return (
//                         <Navigate replace to="/user/login" />
//                     )
//                 }}
//             />
//         );
//     } else if(isNotMFA){
//         alert("User account not fully secured yet, follow the profile page steps!")
//         return (
//             <Route
//                 path={path}
//                 render={() => {
//                     return (
//                         <Navigate replace to="/user/profile" />
//                     )
//                 }}
//             />
//         );
//     } else {
//         return (
//             <Route
//                 path={path}
//                 render={props => {
//                     return (
//                         <ErrorBoundary><Comp {...props} /></ErrorBoundary>
//                     );
//                 }}
//             />
//         );
//     }
// };

// // Must be signed out to view
// const VisitorRoute = ({ component: Comp, isUser, path }) => {
//     if(isUser){
//         alert("You must be signed out as a user to visit that page.")
//         return (
//             <Route
//                 path={path}
//                 render={() => {
//                     return (
//                         <Navigate replace to="/user/dashboard" />
//                     )
//                 }}
//             />
//         );
//     } else {
//         return (
//             <Route
//                 path={path}
//                 render={props => {
//                     return (
//                         <ErrorBoundary><Comp {...props} /></ErrorBoundary>
//                     );
//                 }}
//             />
//         );
//     }
// };

export default withRouter(Views);