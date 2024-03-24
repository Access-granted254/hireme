/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-concat */
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../authContext";
import { links } from "../constants/links";
import { localApi } from "../api/axios";

function Navbar() {
  const { user, tokens, logout } = useContext(AuthContext);
  const [person, setPerson] = useState([]);

  const fetchPerson = async () => {
    if (!user?.user_id) {
      return;
    }
    try {
      const response = await localApi.get(`profile/${user?.user_id}/`, {
        headers: {
          Authorization: `Bearer ${tokens?.access}`,
        },
      });
      setPerson(response?.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchPerson();
  }, [user]);
  return (
    <>
      <nav className="navbar sticky-top border-bottom bg-white">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold ">HireNest</Link>
          <button
            className="navbar-toggler bg-light-subtle"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            data-bs-theme="dark"
          >
            <div className="offcanvas-header">
              {user ? (
                <>
                  <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                    Hello {person?.username}
                  </h5>
                </>
              ) : (
                <>
                  <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                    Hello
                  </h5>
                </>
              )}

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <hr />

            {/* offcanvas body */}
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3 ">
                {user ? (
                  <>
                    <li className="nav-item">
                      <Link
                        className="nav-link text-white"
                        to={links?.Dashboard}
                      >
                        Dashboard
                      </Link>
                    </li>

                    {person.is_client ? (
                      <>
                        <li className="nav-item">
                          <Link
                            className="nav-link text-white"
                            to={links?.Projects}
                          >
                            Projects
                          </Link>
                        </li>
                      </>
                    ) : person.is_developer ? (
                      <>
                        <li className="nav-item">
                          <Link
                            className="nav-link text-white"
                            to={links?.Bids}
                          >
                            Bids
                          </Link>
                        </li>
                      </>
                    ) : null}

                    <li className="nav-item">
                      <Link
                        className=" btn btn-outline-danger"
                        onClick={logout}
                      >
                        Sign Out
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link
                        className="btn btn-outline-success"
                        to={links?.Login}
                      >
                        Login
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
