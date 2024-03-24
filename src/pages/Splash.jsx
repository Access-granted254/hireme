import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { links } from "../constants/links";
import { AuthContext } from "../authContext";
import splashImage from "../assets/images/landing/splash.jpg";

function Splash() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <div
        className="container-fluid d-flex justify-content-center align-items-center m-0 p-0"
        style={{ height: "100vh" }}
      >
        <div
          className="col-md-3 col-sm-0 d-none d-sm-block"
          style={{
            backgroundImage: `url(${splashImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            height: "100vh",
          }}
        ></div>
        <div className="col-md-6 col-sm-12">
          <div className="d-flex align-items-start p-5 justify-content-start">
            <div className="d-flex flex-column">
              <div className="mb-3">
                <h3 className="fw-bold mb-3">Get Started on HireNest</h3>
              </div>
              <div className="mb-3">
                <Link
                  to={links?.Login}
                  className="btn btn-dark w-100 rounded-pill btn-lg"
                >
                  Sign In
                </Link>
              </div>
              <hr className="mb-3" />
              <div className="mb-3">
                <Link
                  to={links?.Register}
                  className="btn btn-outline-dark w-100 rounded-pill btn-lg"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-12"></div>
      </div>
    </>
  );
}

export default Splash;
