import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { links } from "../constants/links";
import { AuthContext } from "../authContext";

function Splash() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <div
        className="container-fluid d-flex justify-content-center align-items-center m-auto"
        style={{ height: "100vh" }}
      >
        <div className="container">
          {!user ? (
            <>
              <div className="row align-items-center justify-content-center">
                <div className="col-md-6 col-sm-12 mb-3">
                  <h1 className="fw-bolder ">HireMe</h1>
                  <h3>The Application that connects developers to clients.</h3>
                  <p>
                    Machine Learning | Web Development | Artificial Intelligence
                    & many more
                  </p>
                  <Link
                    className="btn btn-outline-success fw-bold"
                    to={links.Login}
                  >
                    Log In
                  </Link>
                </div>

                <div className="col-md-6 col-sm-12 mb-3">
                  <div className="mb-3">
                    <h2>For Clients</h2>
                    <p>
                      Create & Publish a project. <br />
                      See bids placed on the project. <br />
                      Hire a Developer for your project
                    </p>
                    <Link
                      to={links.Register}
                      className="btn btn-outline-dark fw-bold"
                    >
                      Get Started
                    </Link>
                  </div>

                  <div>
                    <h2>For Developers</h2>
                    <p>
                      View various projects. <br />
                      Bid on projects. <br />
                      Work on projects.
                    </p>
                    <Link
                      to={links.Developer}
                      className="btn btn-outline-primary fw-bold"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="container">
                <div className="text-center">
                  <Link
                    className="btn btn-outline-success"
                    to={links?.Dashboard}
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Splash;
