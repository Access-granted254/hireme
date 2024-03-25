import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { links, urls } from "../constants/links";
import { Field, Form, Formik } from "formik";
import { RegistrationSchema } from "../validation/validation";
import { localApi } from "../api/axios";
import { toast } from "react-toastify";
import signInImage from "../assets/images/login/signup.jpg";

function Register() {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="container-fluid d-flex flex-column align-items-center justify-content-center"
        style={{
          height: "100vh",
          backgroundImage: `url(${signInImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="d-flex align-items-center justify-content-center">
          <Formik
            initialValues={{
              email: "",
              username: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={RegistrationSchema}
            onSubmit={async (values) => {
              try {
                await localApi.post(urls.REGISTER, values);
                toast.success("Account created successfully");
                navigate(links?.AccountVerify);
              } catch (error) {
                toast.error("Account creation failed");
              }
            }}
          >
            {({ errors, touched }) => (
              <Form className="shadow-lg rounded border px-5 pb-5 pt-3 bg-white">
                <div>
                  <h5 className="fw-bold">Create an account</h5>
                  <hr />
                </div>

                {/* email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <Field type="email" className="form-control" name="email" />
                  {touched?.email && errors?.email && (
                    <div className="text-danger fst-italic fs-6">
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* username */}
                <div className="mb-3 mt-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <Field className="form-control" name="username" />
                  {touched.username && errors.username && (
                    <div className="text-danger fst-italic fs-6">
                      {errors.username}
                    </div>
                  )}
                </div>

                {/* password */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <Field
                    className="form-control"
                    name="password"
                    type="password"
                  />
                  {touched.password && errors.password && (
                    <div className="text-danger fst-italic fs-6">
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* confirm password */}
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <Field
                    className="form-control"
                    name="confirmPassword"
                    type="password"
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <div className="text-danger fst-italic fs-6">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                {/* buttons */}
                <div className="mb-3">
                  <button className="btn w-100 btn-outline-dark" type="submit">
                    Sign Up
                  </button>
                </div>

                <div className="mb-3 text-center">
                  <Link className="fst-italic" to={links.Developer}>
                    Developer's Account
                  </Link>
                </div>
                <div className="mb-3 text-center">
                  <Link className="fst-italic" to={links.Login}>
                    Already have an account
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default Register;
