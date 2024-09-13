import React, { useEffect, useState } from "react";
import {
  backToTop,
  generalDeleteFunction,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import { Link, useNavigate } from "react-router-dom";

import ContentLoader from "../../Loader/ContentLoader";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

function PortNumber() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [portData, setPortData] = useState([]);
  const [popup, setPopup] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState();
  const portsAll = useSelector((state) => state.portsAll);
  const dispatch = useDispatch();

  useEffect(() => {
    if (portsAll) {
      setLoading(false);
      setPortData(portsAll);
      async function getData() {
        const apiData = await generalGetFunction(`/ports/all`);
        if (apiData.status) {
          setLoading(false);
          setPortData(apiData.data);
          dispatch({
            type: "SET_PORTSALL",
            portsAll: apiData.data,
          });
        } else {
          setLoading(false);
          navigate(-1);
        }
      }
      getData();
    } else {
      async function getData() {
        const apiData = await generalGetFunction(`/ports/all`);
        if (apiData.status) {
          setLoading(false);
          setPortData(apiData.data);
          dispatch({
            type: "SET_PORTSALL",
            portsAll: apiData.data,
          });
        } else {
          setLoading(false);
          navigate(-1);
        }
      }
      getData();
    }
  }, []);

  const handleDeletePortNumber = async () => {
    setPopup(false);
    setLoading(true);
    const apiData = await generalDeleteFunction(
      `/ports/destroy/${deleteIndex}`
    );
    if (apiData.status) {
      const updatedPortData = portData.filter(
        (item) => item.id !== deleteIndex
      );
      setPortData(updatedPortData);
      setLoading(false);
      toast.success(apiData.success);
    } else {
      setLoading(false);
      const errorMessage = Object.keys(apiData.errors);
      toast.error(apiData.errors[errorMessage[0]][0]);
    }
  };

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid px-0">
            <div id="subPageHeader">
              <div className="col-xl-6 my-auto">
                <h4 className="my-auto">Port Number</h4>
              </div>
              <div className="col-xl-6 ps-2">
                <div className="d-flex justify-content-end">
                  <button
                    effect="ripple"
                    className="panelButton"
                    onClick={() => {
                      navigate(-1);
                      backToTop();
                    }}
                  >
                    Back
                  </button>
                  <Link
                    to="/port-number-add"
                    onClick={backToTop}
                    effect="ripple"
                    className="panelButton"
                  >
                    Add
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-12">
            <div className="col-12" style={{ overflow: "auto" }}>
              <div className="tableContainer">
                {loading ? (
                  <ContentLoader />
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Company Name</th>
                        <th>Billing Address</th>
                        <th>Pin</th>
                        <th>Carrier</th>
                        <th>Account no.</th>
                        <th>Phone no.</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portData.length > 0 &&
                        portData.map((item) => {
                          const handleEditPortNumber = (id) => {
                            navigate(`/port-number-edit?id=${id}`);
                          };
                          return (
                            <tr key={item.id}>
                              <td
                                onClick={() => handleEditPortNumber(item.id)}
                                style={{ cursor: "default" }}
                              >
                                {item.id}
                              </td>
                              <td
                                onClick={() => handleEditPortNumber(item.id)}
                                style={{ cursor: "default" }}
                              >
                                {item.fullname}
                              </td>
                              <td
                                onClick={() => handleEditPortNumber(item.id)}
                                style={{ cursor: "default" }}
                              >
                                {item.company_name}
                              </td>
                              <td
                                onClick={() => handleEditPortNumber(item.id)}
                                style={{ cursor: "default" }}
                              >
                                {item?.billing_address}
                              </td>
                              <td
                                onClick={() => handleEditPortNumber(item.id)}
                                style={{ cursor: "default" }}
                              >
                                {item?.pin}
                              </td>
                              <td
                                onClick={() => handleEditPortNumber(item.id)}
                                style={{ cursor: "default" }}
                              >
                                {item?.carrier}
                              </td>

                              <td
                                onClick={() => handleEditPortNumber(item.id)}
                                style={{ cursor: "default" }}
                              >
                                {item?.account_number}
                              </td>
                              <td
                                onClick={() => handleEditPortNumber(item.id)}
                                style={{ cursor: "default" }}
                              >
                                {item?.phone_number}
                              </td>
                              <td>
                                <i
                                  className="fa-duotone fa-trash text-danger fs-6"
                                  onClick={() => {
                                    setPopup(true);
                                    setDeleteIndex(item.id);
                                  }}
                                ></i>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
          {popup ? (
            <div className="popup">
              <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                  <div className="row content col-xl-4">
                    <div className="col-2 px-0">
                      <div className="iconWrapper">
                        <i className="fa-duotone fa-triangle-exclamation"></i>
                      </div>
                    </div>
                    <div className="col-10 ps-0">
                      <h4>Warning!</h4>
                      <p>
                        Are you sure you want to delete port number linked with
                        company{" "}
                        {portData.find((item) => item.id === deleteIndex)
                          .company_name || ""}
                        ?
                      </p>

                      <button
                        className="panelButton m-0"
                        onClick={() => {
                          handleDeletePortNumber();
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        className="panelButtonWhite m-0 float-end"
                        onClick={() => {
                          setPopup(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </section>
      </main>
    </>
  );
}

export default PortNumber;
