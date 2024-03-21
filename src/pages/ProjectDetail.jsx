/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-concat */
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../authContext";
import { localProjectApi } from "../api/axios";
import { links } from "../constants/links";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { Field, Form, Formik } from "formik";

function ProjectDetail() {
  const { user, tokens } = useContext(AuthContext);
  const { slug } = useParams();
  const [projectDetail, setProjectDetail] = useState([]);
  const navigate = useNavigate();
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

  const handleDelete = async () => {
    if (!user?.user_id) {
      return;
    }
    try {
      await localProjectApi.delete(`projects/${slug}/`, {
        headers: {
          Authorization: `Bearer ${tokens?.access}`,
        },
      });
      toast.success("Project has been deleted");
      navigate(links.Projects);
    } catch (error) {}
  };

  const fetchProjectDetail = async () => {
    if (!user?.user_id) {
      return;
    }
    try {
      const response = await localProjectApi.get(`projects/${slug}/`, {
        headers: {
          Authorization: `Bearer ${tokens?.access}`,
        },
      });
      setProjectDetail(response?.data);
    } catch (error) {}
  };

  const acceptBid = async (bidSlug) => {
    try {
      const hasAcceptedBid = projectDetail?.bids?.some(
        (bid) => bid.status === "Accepted"
      );
      if (hasAcceptedBid) {
        toast.warning("Another bid has already been accepted.");
        return;
      }

      await localProjectApi.patch(
        `bid/${bidSlug}/`,
        {
          status: "Accepted",
        },
        {
          headers: {
            Authorization: `Bearer ${tokens?.access}`,
          },
        }
      );
      toast.success("Bid has been accepted");
      window.location.reload();
    } catch (error) {}
  };

  useEffect(() => {
    fetchCategories();
    fetchTypes();
    fetchProgress();
    fetchStatus();
    fetchProjectDetail();
  }, [user]);

  return (
    <>
      <div className="container py-3">
        <section>
          <h5 className="text-secondary text-uppercase mb-2">
            <span>
              <Link to={links.Projects} className="btn">
                <i className="bi bi-arrow-left"></i>
              </Link>
            </span>
            Project Detail
          </h5>
          <h3 className="fw-bold">{projectDetail?.name}</h3>
          <div className="btn-group" role="group">
            <button className="btn btn-sm btn-outline-dark">
              {projectDetail?.project_category}
            </button>
            <button className="btn btn-sm btn-outline-dark">
              {projectDetail?.project_type}
            </button>
            <button className="btn btn-sm btn-outline-dark">
              {projectDetail?.project_duration}
            </button>
          </div>
          <hr />
        </section>

        <section className="mt-3">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <article className="mb-3">
                <h5>Project Description</h5>
                <p>{projectDetail?.description}</p>
                {projectDetail?.file ? (
                  <>
                    <p className="mb-0">
                      File:{" "}
                      <a
                        href={projectDetail?.file}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Click here
                      </a>
                    </p>
                  </>
                ) : null}
                <p className="fst-italic">
                  Progress: {projectDetail?.project_progress}
                </p>
                <p>
                  <strong>Price Range: </strong>
                  {projectDetail?.min_price} - {projectDetail?.max_price}
                </p>
                <div>
                  <Button onClick={handleShow} variant="outline-warning">
                    Update
                  </Button>
                  <Link
                    onClick={handleDelete}
                    className="ms-2 btn btn-outline-danger"
                  >
                    Delete
                  </Link>
                </div>

                <Modal
                  show={show}
                  onHide={handleClose}
                  dialogClassName="modal-dialog modal-fullscreen"
                >
                  <div className="modal-header">
                    <h5 className="modal-title">Update Project</h5>
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
                          name: projectDetail?.name,
                          description: projectDetail?.description,
                          project_category: projectDetail?.project_category,
                          project_type: projectDetail?.project_type,
                          project_status: projectDetail?.project_status,
                          project_progress: projectDetail?.project_progress,
                          file: null,
                          project_duration: projectDetail?.project_duration,
                          min_price: projectDetail?.min_price,
                          max_price: projectDetail?.max_price,
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
                          formData.append(
                            "project_status",
                            values?.project_status
                          );
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
                            await localProjectApi.patch(
                              `projects/${slug}/`,
                              formData,
                              config
                            );
                            toast.success("Project updated successfully.");
                            setShow(false);
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
                                  Project Name
                                  <sup className="text-danger">*</sup>
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
                                  Project Category
                                  <sup className="text-danger">*</sup>
                                </label>
                                <Field
                                  as="select"
                                  name="project_category"
                                  className="form-control"
                                >
                                  {categories.map((category) => (
                                    <option
                                      key={category[0]}
                                      value={category[0]}
                                    >
                                      {category[1]}
                                    </option>
                                  ))}
                                </Field>
                              </div>
                            </div>

                            <div className="row">
                              {/* type */}
                              <div className="col-md-6 col-sm-12 mb-3">
                                <label
                                  htmlFor="project_type"
                                  className="form-label"
                                >
                                  Project Type
                                  <sup className="text-danger">*</sup>
                                </label>
                                <Field
                                  as="select"
                                  name="project_type"
                                  className="form-control"
                                >
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
                                  Project Status
                                  <sup className="text-danger">*</sup>
                                </label>
                                <Field
                                  as="select"
                                  name="project_status"
                                  className="form-control"
                                >
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
                                  Project Progress
                                  <sup className="text-danger">*</sup>
                                </label>
                                <Field
                                  as="select"
                                  name="project_progress"
                                  className="form-control"
                                >
                                  {progress.map((progress) => (
                                    <option
                                      key={progress[0]}
                                      value={progress[0]}
                                    >
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
                                  Project Duration
                                  <sup className="text-danger">*</sup>
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
                              <label
                                htmlFor="description"
                                className="form-label"
                              >
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
                                <label
                                  htmlFor="min_price"
                                  className="form-label"
                                >
                                  Minimum Price
                                  <sup className="text-danger">*</sup>
                                </label>
                                <Field
                                  className="form-control"
                                  type="number"
                                  name="min_price"
                                />
                              </div>

                              {/* max price */}
                              <div className="col-md-6 col-sm-12 mb-3">
                                <label
                                  htmlFor="max_price"
                                  className="form-label"
                                >
                                  Maximum Price
                                  <sup className="text-danger">*</sup>
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
              </article>
            </div>

            <div className="col-md-4 col-sm-12">
              <article>
                <h5>Bids Received</h5>
                <hr />
                {projectDetail?.bids?.length > 0 ? (
                  <>
                    {projectDetail?.bids?.map((bid) => (
                      <>
                        <div className="mb-3">
                          <article>
                            <h6>
                              {bid?.developer?.email} -{" "}
                              {bid?.developer?.username}
                            </h6>
                            <p className="fw-semibold fst-italic">Proposal</p>
                            <p>{bid?.proposal}</p>
                            {bid?.file ? (
                              <>
                                <p className="mb-0">
                                  File:{" "}
                                  <a
                                    href={bid?.file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Click here
                                  </a>
                                </p>
                              </>
                            ) : null}
                            <p className="fst-italic">
                              Bid Status: {bid?.status}
                            </p>
                            {bid?.status !== "Accepted" && (
                              <Link
                                onClick={() => acceptBid(bid?.slug)}
                                className="btn btn-outline-success"
                              >
                                Accept
                              </Link>
                            )}
                          </article>
                          <hr />
                        </div>
                      </>
                    ))}
                  </>
                ) : (
                  <>
                    <p className="bg-info p-2">No bids placed yet</p>
                  </>
                )}
              </article>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default ProjectDetail;
