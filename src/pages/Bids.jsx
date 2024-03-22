/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-concat */
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../authContext";
import { localProjectApi } from "../api/axios";
import { links, urls } from "../constants/links";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function Bids() {
  const { user, tokens } = useContext(AuthContext);
  const [bids, setBids] = useState([]);
  const [bidProjects, setBidProjects] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const config = {
    headers: {
      Authorization: "Bearer" + " " + tokens.access,
      "Content-Type": "multipart/form-data",
    },
  };

  const fetchBids = async () => {
    if (!user?.user_id) {
      return;
    }
    try {
      const response = await localProjectApi.get(urls.BID, {
        headers: {
          Authorization: `Bearer ${tokens?.access}`,
        },
      });
      setBids(response?.data);
    } catch (error) {}
  };

  const fetchProjectBid = async (project) => {
    if (!user?.user_id) {
      return;
    }
    try {
      const response = await localProjectApi.get(`all-projects/${project}/`, {
        headers: {
          Authorization: `Bearer ${tokens?.access}`,
        },
      });
      setBidProjects(response?.data);
      handleShow();
    } catch (error) {}
  };

  useEffect(() => {
    fetchBids();
    fetchProjectBid();
  }, [user]);

  return (
    <>
      <div className="container-fluid page">
        <div className="container">
          <section>
            <h5 className="text-secondary text-uppercase mb-2">
              <span>
                <Link to={links.Dashboard} className="btn">
                  <i className="bi bi-arrow-left"></i>
                </Link>
              </span>
              Bids
            </h5>
            <h3 className="fw-bold">Your Bids</h3>
            <p className="fst-italic">Bids Placed: {bids?.count}</p>
            <hr />
            {bids?.results?.map((bid) => (
              <>
                <div className="mb-3">
                  <article>
                    <h6 className="font-monospace">Bid Proposal - {bid?.id}</h6>
                    <p className="fst-italic">Status: {bid?.status}</p>

                    <p>{bid?.proposal}</p>
                    <div>
                      <Button
                        variant="outline-primary btn-sm"
                        onClick={() => fetchProjectBid(bid?.project)}
                      >
                        Project Detail
                      </Button>
                    </div>
                  </article>
                  <hr />
                </div>
              </>
            ))}

            <Modal show={show} onHide={handleClose}>
              <div className="modal-header">
                <h5 className="modal-title">{bidProjects?.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body">
                <p className="fst-italic">
                  Ksh {bidProjects?.min_price} - Ksh {bidProjects?.max_price}
                </p>
                <p>{bidProjects?.description}</p>
                <div className="btn-group" role="group">
                  <button className="btn btn-sm btn-outline-dark">
                    {bidProjects?.project_category}
                  </button>
                  <button className="btn btn-sm btn-outline-dark">
                    {bidProjects?.project_type}
                  </button>
                  <button className="btn btn-sm btn-outline-dark">
                    {bidProjects?.project_duration}
                  </button>
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
          </section>
        </div>
      </div>
    </>
  );
}

export default Bids;
