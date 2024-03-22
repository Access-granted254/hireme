/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-concat */
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../authContext";
import { localApi, localProjectApi } from "../api/axios";
import avatarImage from "../assets/images/samples/avatar.jpg";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { links, urls } from "../constants/links";
import StatusCards from "../components/Dashboard/StatusCards";

function Dashboard() {
  const { user, tokens } = useContext(AuthContext);
  const [person, setPerson] = useState([]);
  const [projects, setProjects] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [proProfile, setProProfile] = useState([]);
  const [tenProjects, setTenProjects] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const config = {
    headers: {
      Authorization: "Bearer" + " " + tokens.access,
      "Content-Type": "multipart/form-data",
    },
  };

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

  const fetchProjects = async () => {
    if (!user?.user_id) {
      return;
    }
    try {
      const response = await localProjectApi.get(urls?.PROJECTS, {
        headers: {
          Authorization: `Bearer ${tokens?.access}`,
        },
      });
      setProjects(response?.data);
    } catch (error) {}
  };

  const fetchTenProjects = async () => {
    if (!user?.user_id) {
      return;
    }
    try {
      const response = await localProjectApi.get(urls?.TEN, {
        headers: {
          Authorization: `Bearer ${tokens?.access}`,
        },
      });
      setTenProjects(response?.data);
    } catch (error) {}
  };

  const fetchAvailableProjects = async () => {
    if (!user?.user_id) {
      return;
    }
    try {
      const response = await localProjectApi.get(urls?.AVAILABLEPROJECTS, {
        headers: {
          Authorization: `Bearer ${tokens?.access}`,
        },
      });
      setAvailableProjects(response?.data);
    } catch (error) {}
  };

  const fetchProfessionalProfile = async () => {
    if (!user?.user_id) {
      return;
    }
    try {
      const response = await localApi.get(`${user?.user_id}/`, {
        headers: {
          Authorization: `Bearer ${tokens?.access}`,
        },
      });
      setProProfile(response?.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchProjects();
    fetchPerson();
    fetchAvailableProjects();
    fetchProfessionalProfile();
    fetchTenProjects();
  }, [user]);

  console.log(tenProjects);

  const pendingProjects = projects?.results?.filter(
    (project) => project.project_progress === "Pending"
  );

  const activeProjects = projects?.results?.filter(
    (project) => project.project_progress === "Active"
  );

  const completedProjects = projects?.results?.filter(
    (project) => project.project_progress === "Completed"
  );
  return (
    <>
      <div className="container-fluid py-3 px-3">
        {person?.is_client ? (
          <>
            <section className="row">
              {/* Client Profile */}
              <div className="col-md-3 col-sm-12 py-2">
                <section>
                  <h3 className="fw-bold mb-3">Client Information</h3>
                  <div className="card">
                    <div className="card-body">
                      <div>
                        {person?.image ? (
                          <>
                            <img
                              src={avatarImage}
                              alt=""
                              className="avatar-image mb-2"
                            />
                          </>
                        ) : (
                          <>
                            <img
                              src={person?.image}
                              alt=""
                              className="avatar-image mb-2"
                            />
                          </>
                        )}
                      </div>
                      <h5 className="card-title fw-semibold">
                        {person?.username}
                      </h5>
                      {person?.firstname !== null &&
                      person?.lastname !== null ? (
                        <>
                          <p className="card-text">
                            {person?.firstname} {person?.lastname}
                          </p>
                        </>
                      ) : null}
                      <p className="card-text">{person?.email}</p>
                      <Button
                        variant="outline-primary btn-sm"
                        onClick={handleShow}
                      >
                        Update Profile
                      </Button>

                      {/* profile modal */}
                      <Modal show={show} onHide={handleClose}>
                        <div className="modal-header">
                          <h5 className="modal-title">Update your profile</h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                          ></button>
                        </div>

                        <div className="modal-body">
                          <Formik
                            initialValues={{
                              image: person?.image,
                              firstname: person?.firstname,
                              lastname: person?.lastname,
                              about: person?.about,
                            }}
                            onSubmit={async (values) => {
                              const formData = new FormData();
                              if (values?.image) {
                                formData.append("image", values?.image);
                              }
                              formData.append("firstname", values?.firstname);
                              formData.append("lastname", values?.lastname);
                              formData.append("about", values?.about);
                              try {
                                await localApi.patch(
                                  `profile/${user?.user_id}/`,
                                  formData,
                                  config
                                );
                                toast.success(
                                  "Profile Updated. Refresh to see changes"
                                );
                                setShow(false);
                                window.location.reload();
                              } catch (error) {
                                toast.error("Please Try again");
                              }
                            }}
                          >
                            {({ setFieldValue }) => (
                              <Form>
                                {/* image */}
                                <div className="mb-3">
                                  <label htmlFor="image" className="form-label">
                                    Profile Picture
                                  </label>
                                  <input
                                    type="file"
                                    className="form-control"
                                    onChange={(event) => {
                                      setFieldValue(
                                        "image",
                                        event.target.files[0]
                                      );
                                    }}
                                  />
                                </div>

                                {/* firstname */}
                                <div className="mb-3">
                                  <label
                                    htmlFor="firstname"
                                    className="form-label"
                                  >
                                    First Name
                                  </label>
                                  <Field
                                    className="form-control"
                                    name="firstname"
                                  />
                                </div>

                                {/* lastname */}
                                <div className="mb-3">
                                  <label
                                    htmlFor="lastname"
                                    className="form-label"
                                  >
                                    Last Name
                                  </label>
                                  <Field
                                    className="form-control"
                                    name="lastname"
                                  />
                                </div>

                                {/* about */}
                                <div className="mb-3">
                                  <label htmlFor="about" className="form-label">
                                    About
                                  </label>
                                  <Field
                                    className="form-control"
                                    name="about"
                                    as="textarea"
                                  />
                                </div>

                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleClose}
                                  >
                                    Close
                                  </button>
                                  <button
                                    type="submit"
                                    className="btn btn-primary"
                                  >
                                    Update
                                  </button>
                                </div>
                              </Form>
                            )}
                          </Formik>
                        </div>
                      </Modal>
                    </div>
                  </div>
                </section>
              </div>
              {/* end of profile */}

              {/* main dashboard */}
              <div className="col-md-9 col-sm-12 py-2">
                <h3 className="fw-bold mb-3">Dashboard</h3>
                <hr />
                <section className="mb-2">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h5 className="text-uppercase">Projects Overview</h5>
                    </div>
                    <div>
                      <Link
                        to={links?.Projects}
                        className="btn btn-outline-dark"
                      >
                        Projects
                      </Link>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 col-sm-12 mb-3">
                      <StatusCards
                        title={"Total Projects"}
                        body={projects?.count}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-3">
                      <StatusCards
                        title={"Active Projects"}
                        body={activeProjects?.length}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-3">
                      <StatusCards
                        title={"Pending Projects"}
                        body={pendingProjects?.length}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-3">
                      <StatusCards
                        title={"Completed Projects"}
                        body={completedProjects?.length}
                      />
                    </div>
                  </div>
                </section>
                <hr />
                <section className="mb-2">
                  <h5 className="text-uppercase">Current Projects</h5>
                  <div className="table-responseive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Status</th>
                          <th>Bids</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tenProjects?.results?.map((project) => (
                          <>
                            <tr>
                              <td>{project?.name}</td>
                              <td>{project?.project_category}</td>
                              <td>{project?.project_status}</td>
                              <td>{project?.bids?.length}</td>
                              <td>
                                <Link
                                  className="btn btn-sm btn-outline-info"
                                  to={`/projects/${project?.slug}/details`}
                                >
                                  Details
                                </Link>
                              </td>
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </section>
          </>
        ) : person?.is_developer ? (
          <></>
        ) : null}
        <section>
          {/* profile */}
          <div className="mb-3">
            {person.is_developer ? (
              <>
                <div className="card mt-3">
                  <div className="card-body">
                    <h5 className="card-title">Professional Profile</h5>
                    {!proProfile?.github &&
                    !proProfile?.linkedin &&
                    !proProfile?.website &&
                    !proProfile?.twitter &&
                    !proProfile?.skills ? (
                      <>
                        <p className="card-text">Update Professional Profile</p>
                        <Link
                          to={links?.Profile}
                          className="btn btn-outline-primary btn-sm"
                        >
                          Update
                        </Link>
                      </>
                    ) : (
                      <>
                        <p className="card-text">{proProfile?.role}</p>
                        <Link className="card-link" to={proProfile?.github}>
                          Github
                        </Link>
                        <Link className="card-link" to={proProfile?.linkedin}>
                          Linkedin
                        </Link>
                        <Link className="card-link" to={proProfile?.twitter}>
                          Twitter
                        </Link>
                        <Link className="card-link" to={proProfile?.website}>
                          Website
                        </Link>
                        <p className="card-text">{proProfile?.skills}</p>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>
          {/* end of profile */}

          <div className="mb-3">
            {person.is_client ? (
              <></>
            ) : person.is_developer ? (
              <>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="text-uppercase">Available Projects</h5>
                    <p className="fst-italic">
                      Place bids on projects for clients to hire you.
                    </p>
                  </div>

                  <div>
                    <Link
                      to={links?.Bids}
                      className="btn btn-outline-dark btn-sm"
                    >
                      Your Bids
                    </Link>
                  </div>
                </div>
                <hr />

                <section className="mb-3 mt-2">
                  {availableProjects?.count === 0 ? (
                    <p className="text-secondary">No projects available yet</p>
                  ) : (
                    <>
                      {availableProjects?.results?.map((project) => (
                        <div className="mb-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <h6>{project?.name}</h6>
                            <Link
                              className="btn btn-sm btn-outline-info"
                              to={`/project/${project?.slug}/bid/`}
                            >
                              More Details
                            </Link>
                          </div>
                          <p>
                            Ksh {project?.min_price} - Ksh {project?.max_price}
                          </p>
                          <p>{project?.description}</p>

                          <div className="btn-group" role="group">
                            <button className="btn btn-sm btn-outline-dark">
                              {project?.project_category}
                            </button>
                            <button className="btn btn-sm btn-outline-dark">
                              {project?.project_type}
                            </button>
                            <button className="btn btn-sm btn-outline-dark">
                              {project?.project_duration}
                            </button>
                          </div>

                          <hr />
                        </div>
                      ))}
                    </>
                  )}
                </section>
              </>
            ) : null}
          </div>
        </section>
      </div>
    </>
  );
}

export default Dashboard;
