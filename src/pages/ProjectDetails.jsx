/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-concat */
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../authContext";
import { Link, useParams } from "react-router-dom";
import { localProjectApi } from "../api/axios";
import { links, urls } from "../constants/links";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";

function ProjectDetails() {
  const { user, tokens } = useContext(AuthContext);
  const { slug } = useParams();
  const [projectDetail, setProjectDetail] = useState([]);
  const [hasBid, setHasBid] = useState(false);

  const config = {
    headers: {
      Authorization: "Bearer" + " " + tokens.access,
      "Content-Type": "multipart/form-data",
    },
  };

  const isProjectInBids = (bids, projectSlug) => {
    return bids.some((bid) => bid.project === projectSlug);
  };

  const fetchProjectDetail = async () => {
    if (!user?.user_id) {
      return;
    }
    try {
      const response = await localProjectApi.get(`all-projects/${slug}/`, {
        headers: {
          Authorization: `Bearer ${tokens?.access}`,
        },
      });
      setProjectDetail(response?.data);
    } catch (error) {}
  };

  const fetchBids = async () => {
    if (!user?.user_id) {
      return;
    }
    try {
      const response = await localProjectApi.get(`bids/`, {
        headers: {
          Authorization: `Bearer ${tokens?.access}`,
        },
      });

      const bids = response?.data?.results;
      const projectInBids = isProjectInBids(bids, projectDetail?.slug);
      setHasBid(projectInBids);
    } catch (error) {}
  };

  useEffect(() => {
    fetchProjectDetail();
  }, [slug, user]);

  useEffect(() => {
    if (projectDetail?.slug) {
      fetchBids();
    }
  }, [projectDetail?.slug, user, fetchBids]);

  return (
    <div className="container">
      <section>
        <h5 className="text-secondary text-uppercase mb-2">
          <span>
            <Link to={links.Dashboard} className="btn">
              <i className="bi bi-arrow-left"></i>
            </Link>
          </span>
          Project Detail
        </h5>
        <h3 className="fw-bold">{projectDetail?.name}</h3>
        <div className="btn-group" role="group">
          <button className="btn btn-sm btn-outline-primary">
            {projectDetail?.project_category}
          </button>
          <button className="btn btn-sm btn-outline-primary">
            {projectDetail?.project_type}
          </button>
          <button className="btn btn-sm btn-outline-primary">
            {projectDetail?.project_duration}
          </button>
        </div>
        <hr />
      </section>

      <section className="mt-3">
        <div className="row">
          <div className="col-md-7 col-sm-12">
            <article className="mb-3">
              <h5 className="fw-bold">Description</h5>
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
            </article>
          </div>

          <div className="col-md-5 col-sm-12">
            <article className="mb-3">
              <h5 className="fw-bold">Place Bid</h5>
              <hr />
              {hasBid ? (
                <>
                  <p className="p-3 bg-success text-white">
                    You have already bid on this project
                  </p>
                </>
              ) : (
                <>
                  {projectDetail.slug && (
                    <Formik
                      initialValues={{
                        project: projectDetail?.slug,
                        proposal: "",
                        file: "",
                      }}
                      onSubmit={async (values) => {
                        const formData = new FormData();

                        formData.append("project", values?.project);
                        formData.append("proposal", values?.proposal);
                        if (values?.file) {
                          formData.append("file", values?.file);
                        }
                        try {
                          await localProjectApi.post(
                            urls?.BID,
                            formData,
                            config
                          );
                          toast.success("Bid created successfully");
                          window.location.reload();
                        } catch (error) {}
                      }}
                    >
                      {({ setFieldValue }) => (
                        <Form>
                          <div className="mb-3">
                            <label htmlFor="proposal" className="form-label">
                              Proposal<sup className="text-danger">*</sup>
                            </label>
                            <Field
                              className="form-control"
                              id="proposal"
                              name="proposal"
                              as="textarea"
                              rows={6}
                            />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="file" className="form-label">
                              File (upload resume, cover letter or past work if
                              any, in .pdf)
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              onChange={(event) => {
                                setFieldValue("file", event.target.files[0]);
                              }}
                            />
                          </div>

                          <div className="text-end">
                            <button
                              type="submit"
                              className="btn btn-sm btn-outline-primary"
                            >
                              Submit
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  )}
                </>
              )}
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProjectDetails;
