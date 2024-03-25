import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { links } from "./links";
import Navbar from "../layouts/Navbar";
import PrivateRoute from "../middleware/PrivateRoute";

const Splash = React.lazy(() => import("../pages/Splash"));
const Login = React.lazy(() => import("../pages/Login"));
const Register = React.lazy(() => import("../pages/Register"));
const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const Profile = React.lazy(() => import("../pages/Profile"));
const Developer = React.lazy(() => import("../pages/Developer"));
const Projects = React.lazy(() => import("../pages/Projects"));
const ProjectDetail = React.lazy(() => import("../pages/ProjectDetail"));
const ProjectDetails = React.lazy(() => import("../pages/ProjectDetails"));
const Bids = React.lazy(() => import("../pages/Bids"));
const VerifyEmail = React.lazy(() => import("../pages/VerifyEmail"));
const AccountVerify = React.lazy(() => import("../pages/AccountVerify"));

function BaseRouter() {
  return (
    <Router>
      <Suspense
        fallback={
          <>
            <div className="spinner-grow text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </>
        }
      >
        <Navbar />
        <Routes>
          <Route exact path={links?.Splash} element={<Splash />} />
          <Route path={links?.Login} element={<Login />} />
          <Route path={links?.Register} element={<Register />} />
          <Route path={links?.Developer} element={<Developer />} />
          <Route
            path="/v1/users/verify-email/:uidb64/:token/"
            element={<VerifyEmail />}
          />
          <Route path={links?.AccountVerify} element={<AccountVerify />} />

          <Route element={<PrivateRoute />}>
            <Route path={links?.Dashboard} element={<Dashboard />} />
            <Route path={links?.Profile} element={<Profile />} />
            <Route path={links?.Projects} element={<Projects />} />
            <Route
              path="/projects/:slug/details/"
              element={<ProjectDetail />}
            />
            <Route path="/project/:slug/bid/" element={<ProjectDetails />} />
            <Route path={links?.Bids} element={<Bids />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default BaseRouter;
