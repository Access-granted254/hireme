import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { links } from "../constants/links";
import { AuthContext } from "../authContext";
import { Field, Form, Formik } from "formik";
import { LoginSchema } from "../validation/validation";
import { toast } from "react-toastify";
import loginImage from "../assets/images/login/login.jpg";

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);
  return (
    <>
      <div
        className="container-fluid d-flex flex-column align-items-center justify-content-center"
        style={{
          height: "100vh",
          backgroundImage: `url(${loginImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="d-flex align-items-center justify-content-center">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={async (values) => {
              try {
                await loginUser(values);
                toast.success("Login successful");
                navigate(links.Dashboard);
              } catch (error) {
                toast.error("Login failed");
              }
            }}
          >
            {({ errors, touched }) => (
              <Form className="shadow-lg rounded border px-5 pb-5 bg-white pt-3">
                <div>
                  <h5 className="fw-bold">Login</h5>
                  <hr />
                </div>

                {/* email */}
                <div className="mb-3 mt-3">
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
                {/* end of email */}

                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <Field
                    type="password"
                    className="form-control"
                    name="password"
                  />
                  {touched?.password && errors?.password && (
                    <div className="text-danger fst-italic fs-6">
                      {errors.password}
                    </div>
                  )}
                </div>
                {/* end password */}

                <div className="mb-3">
                  <button
                    className="btn w-100 btn-outline-success fw-semibold"
                    type="submit"
                  >
                    Sign In
                  </button>
                </div>

                <div className="mb-3 text-center">
                  <Link className="fst-italic" to={links.Register}>
                    Create an account
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

export default Login;
