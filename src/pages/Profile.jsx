/* eslint-disable no-useless-concat */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../authContext";
import { Field, Form, Formik } from "formik";
import { localApi } from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { links } from "../constants/links";

function Profile() {
  const { user, tokens } = useContext(AuthContext);
  const [profile, setProfile] = useState([]);
  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: "Bearer" + " " + tokens.access,
      "Content-Type": "multipart/form-data",
    },
  };

  const fetchProfile = async () => {
    if (!user?.user_id) {
      return;
    }
    try {
      const response = await localApi.get(`${user?.user_id}/`, {
        headers: {
          Authorization: `Bearer ${tokens?.access}`,
        },
      });
      setProfile(response?.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return (
    <div className="container py-2">
      <div>
        <p className="text-secondary text-uppercase mb-0">
          What the client sees
        </p>
        <h2 className="fw-bold mb-0">Profile</h2>
        <hr />
      </div>
      <section>
        <Formik
          initialValues={{
            github: profile?.github,
            linkedin: profile?.linkedin,
            twitter: profile?.twitter,
            instagram: profile?.instagram,
            website: profile?.website,
            role: profile?.role,
            resume: profile?.resume,
            skills: profile?.skills,
          }}
          onSubmit={async (values) => {
            const formData = new FormData();
            formData.append("github", values.github);
            formData.append("linkedin", values.linkedin);
            formData.append("twitter", values.twitter);
            formData.append("instagram", values.instagram);
            formData.append("website", values.website);
            formData.append("role", values.role);
            if (values?.resume) {
              formData.append("resume", values?.resume);
            }
            formData.append("skills", values.skills);

            try {
              await localApi.patch(`${user?.user_id}/`, formData, config);
              toast.success("Profile updated");
              navigate(links.Dashboard);
              window.location.reload();
            } catch (error) {
              toast.error(error?.response?.data?.instagram[0]);
            }
          }}
        >
          {({ setFieldValue }) => (
            <>
              <Form>
                <div className="mb-3">
                  <label htmlFor="github" className="form-label">
                    Github
                  </label>
                  <Field
                    type="text"
                    className="form-control"
                    id="github"
                    name="github"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="linkedin" className="form-label">
                    Linkedin
                  </label>
                  <Field
                    type="text"
                    className="form-control"
                    id="linkedin"
                    name="linkedin"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="twitter" className="form-label">
                    Twitter
                  </label>
                  <Field
                    type="text"
                    className="form-control"
                    id="twitter"
                    name="twitter"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="instagram" className="form-label">
                    Instagram
                  </label>
                  <Field
                    type="text"
                    className="form-control"
                    id="instagram"
                    name="instagram"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="website" className="form-label">
                    Website
                  </label>
                  <Field
                    type="text"
                    className="form-control"
                    id="website"
                    name="website"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Role
                  </label>
                  <Field
                    type="text"
                    className="form-control"
                    id="role"
                    name="role"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="resume" className="form-label">
                    Resume
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="resume"
                    onChange={(event) => {
                      setFieldValue("resume", event.currentTarget.files[0]);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="skills" className="form-label">
                    Skills
                  </label>
                  <Field
                    type="text"
                    className="form-control"
                    id="skills"
                    name="skills"
                  />
                </div>

                <div className="mb-3">
                  <button className="btn btn-outline-dark">Save</button>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </section>
    </div>
  );
}

export default Profile;
