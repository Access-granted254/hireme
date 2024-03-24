import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { localApi } from "../api/axios";
import { toast } from "react-toastify";
import { links } from "../constants/links";

function VerifyEmail() {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      await localApi?.patch(`verify-email/${uidb64}/${token}/`);
      toast.success("Email Verified");
      navigate(links?.Login);
    } catch (error) {
      toast.error("Token Expired");
    }
  };

  return (
    <>
      <div className="container">
        <h1>Verify Email</h1>
        <button className="btn btn-outline-primary" onClick={handleVerify}>
          Verify
        </button>
      </div>
    </>
  );
}

export default VerifyEmail;
