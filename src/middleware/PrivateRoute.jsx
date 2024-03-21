import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../authContext";
import { links } from "../constants/links";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user, loading } = useContext(AuthContext);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // This effect runs when user or loading changes
    setAuthChecked(true);
  }, [user, loading]);

  if (!authChecked) {
    // Show a loading spinner or message while checking authentication
    return (
      <div className="spinner-border text-success" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to={links.Login} replace />;
};

export default PrivateRoute;
