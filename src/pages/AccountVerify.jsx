import React from 'react'
import signInImage from "../assets/images/login/signup.jpg";

function AccountVerify() {
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
            <div className="card">
                <div className="card-body text-center">
                    <h5 className="card-title">Glad to have you on board</h5>
                    <p className="card-text">Please Verify Your Account</p>
                    <p className="card-text">Check your email for a verification link</p>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}

export default AccountVerify