/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-concat */
import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { AuthContext } from "../authContext";
import { localProjectApi } from "../api/axios";
import { links, urls } from "../constants/links";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Projects() {
  const { user, tokens } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [progress, setProgress] = useState([]);
  const [status, setStatus] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const config = {
    headers: {
      Authorization: "Bearer" + " " + tokens.access,
      "Content-Type": "multipart/form-data",
    },
  };

  const fetchCategories = async () => {
    try {
      const response = await localProjectApi.get("category/");
      setCategories(response?.data);
    } catch (error) {}
  };

  const fetchTypes = async () => {
    try {
      const response = await localProjectApi.get("type/");
      setTypes(response?.data);
    } catch (error) {}
  };

  const fetchProgress = async () => {
    try {
      const response = await localProjectApi.get("progress/");
      setProgress(response?.data);
    } catch (error) {}
  };

  const fetchStatus = async () => {
    try {
      const response = await localProjectApi.get("status/");
      setStatus(response?.data);
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

  useEffect(() => {
    fetchCategories();
    fetchTypes();
    fetchProgress();
    fetchStatus();
    fetchProjects();
  }, [user]);

  return (
    <div className="container-fluid page">
      <div className="container py-3">
        <section>
          <h5 className="text-secondary text-uppercase mb-2">
            <span>
              <Link to={links?.Dashboard} className="btn">
                <i className="bi bi-arrow-left"></i>
              </Link>
            </span>
            Projects
          </h5>

          <div className="d-flex align-items-center justify-content-between mb-3">
            <h3 className="fw-bold">Your Projects</h3>
            <Button variant="outline-dark btn-sm" onClick={handleShow}>
              <i className="bi bi-plus-lg me-1"></i>New Project
            </Button>
          </div>

          <Modal
            show={show}
            onHide={handleClose}
            dialogClassName="modal-dialog modal-fullscreen"
          >
            <div className="modal-header">
              <h5 className="modal-title">Create a Project</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              ></button>
            </div>

            <div className="modal-body">
              <div className="container">
                <Formik
                  initialValues={{
                    name: "",
                    description: "",
                    project_category: "",
                    project_type: "",
                    project_status: "",
                    project_progress: "",
                    file: "",
                    project_duration: "",
                    min_price: "",
                    max_price: "",
                  }}
                  onSubmit={async (values) => {
                    const formData = new FormData();
                    formData.append("name", values?.name);
                    formData.append("description", values?.description);
                    formData.append(
                      "project_category",
                      values?.project_category
                    );
                    formData.append("project_type", values?.project_type);
                    formData.append(
                      "project_duration",
                      values?.project_duration
                    );
                    formData.append("project_status", values?.project_status);
                    formData.append(
                      "project_progress",
                      values?.project_progress
                    );
                    if (values?.file) {
                      formData.append("file", values?.file);
                    }
                    formData.append("min_price", values?.min_price);
                    formData.append("max_price", values?.max_price);
                    try {
                      await localProjectApi.post(
                        urls?.PROJECTS,
                        formData,
                        config
                      );

                      toast.success("Project created successfully");
                      handleClose();
                      window.location.reload();
                    } catch (error) {
                      toast.error("Please Try again");
                    }
                  }}
                >
                  {({ setFieldValue }) => (
                    <Form>
                      <div className="row">
                        {/* name */}
                        <div className="col-md-6 col-sm-12 mb-3">
                          <label htmlFor="name" className="form-label">
                            Project Name<sup className="text-danger">*</sup>
                          </label>
                          <Field
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                          />
                        </div>

                        {/* category */}
                        <div className="col-md-6 col-sm-12 mb-3">
                          <label
                            htmlFor="project_category"
                            className="form-label"
                          >
                            Project Category<sup className="text-danger">*</sup>
                          </label>
                          <Field
                            as="select"
                            name="project_category"
                            className="form-control"
                          >
                            <option value="">Select category</option>
                            {categories.map((category) => (
                              <option key={category[0]} value={category[0]}>
                                {category[1]}
                              </option>
                            ))}
                          </Field>
                        </div>
                      </div>

                      <div className="row">
                        {/* type */}
                        <div className="col-md-6 col-sm-12 mb-3">
                          <label htmlFor="project_type" className="form-label">
                            Project Type<sup className="text-danger">*</sup>
                          </label>
                          <Field
                            as="select"
                            name="project_type"
                            className="form-control"
                          >
                            <option value="">Select type</option>
                            {types.map((type) => (
                              <option key={type[0]} value={type[0]}>
                                {type[1]}
                              </option>
                            ))}
                          </Field>
                        </div>
                        {/* status */}
                        <div className="col-md-6 col-sm-12 mb-3">
                          <label
                            htmlFor="project_status"
                            className="form-label"
                          >
                            Project Status<sup className="text-danger">*</sup>
                          </label>
                          <Field
                            as="select"
                            name="project_status"
                            className="form-control"
                          >
                            <option value="">Select status</option>
                            {status.map((status) => (
                              <option key={status[0]} value={status[0]}>
                                {status[1]}
                              </option>
                            ))}
                          </Field>
                        </div>
                      </div>

                      <div className="row">
                        {/* progress */}
                        <div className="col-md-6 col-sm-12 mb-3">
                          <label
                            htmlFor="project_progress"
                            className="form-label"
                          >
                            Project Progress<sup className="text-danger">*</sup>
                          </label>
                          <Field
                            as="select"
                            name="project_progress"
                            className="form-control"
                          >
                            <option value="">Select progress</option>
                            {progress.map((progress) => (
                              <option key={progress[0]} value={progress[0]}>
                                {progress[1]}
                              </option>
                            ))}
                          </Field>
                        </div>

                        {/* duration */}
                        <div className="col-md-6 col-sm-12 mb-3">
                          <label
                            htmlFor="project_duration"
                            className="form-label"
                          >
                            Project Duration<sup className="text-danger">*</sup>
                          </label>
                          <Field
                            type="text"
                            className="form-control"
                            id="project_duration"
                            name="project_duration"
                            placeholder="3 weeks, 6 months, 1 year"
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="file" className="form-label">
                          Project Document (if any)
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={(event) => {
                            setFieldValue("file", event.target.files[0]);
                          }}
                        />
                      </div>

                      {/* description */}
                      <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                          Project Description
                          <sup className="text-danger">*</sup>
                        </label>
                        <Field
                          type="text"
                          className="form-control"
                          id="description"
                          name="description"
                          as="textarea"
                          rows={5}
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-6 col-sm-12 mb-3">
                          <label htmlFor="min_price" className="form-label">
                            Minimum Price<sup className="text-danger">*</sup>
                          </label>
                          <Field
                            className="form-control"
                            type="number"
                            name="min_price"
                          />
                        </div>

                        {/* max price */}
                        <div className="col-md-6 col-sm-12 mb-3">
                          <label htmlFor="max_price" className="form-label">
                            Maximum Price<sup className="text-danger">*</sup>
                          </label>
                          <Field
                            className="form-control"
                            type="number"
                            name="max_price"
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <button
                          type="submit"
                          className="btn btn-outline-primary"
                        >
                          Submit
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </Modal>
          <hr />
        </section>

        <section>
          {projects?.count === 0 ? (
            <p className="text-secondary">You have no projects yet</p>
          ) : (
            <>
              {projects?.results?.map((project) => (
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <h6>{project?.name}</h6>
                    <Link
                      className="btn btn-sm btn-outline-info"
                      to={`/projects/${project?.slug}/details`}
                    >
                      More Details
                    </Link>
                  </div>
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
                    <button className="btn btn-sm btn-outline-dark">
                      {project?.project_status}
                    </button>
                  </div>

                  <hr />
                </div>
              ))}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Projects;
