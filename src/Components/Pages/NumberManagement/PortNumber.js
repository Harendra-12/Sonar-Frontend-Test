import React, { useEffect, useState } from "react";
import {
  backToTop,
  featureUnderdevelopment,
  generalDeleteFunction,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import { Link, useNavigate } from "react-router-dom";

import ContentLoader from "../../Loader/ContentLoader";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../CommonComponents/Header";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
import EmptyPrompt from "../../Loader/EmptyPrompt";

function PortNumber() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [portData, setPortData] = useState([]);
  const [popup, setPopup] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState();
  const portsAll = useSelector((state) => state.portsAll);
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const [noPermissionToRead, setNoPermissionToRead] = useState(false);
  useEffect(() => {
    if (portsAll) {
      // setLoading(false);
      setPortData(portsAll);
      async function getData() {
        const apiData = await generalGetFunction(`/ports/all`);
        if (apiData?.status) {
          setLoading(false);
          setPortData(apiData.data);
          dispatch({
            type: "SET_PORTSALL",
            portsAll: apiData.data,
          });
        } else {
          setLoading(false);
          // navigate(-1);
          if (apiData.response.status === 403) {
            setNoPermissionToRead(true);
          }
        }
      }
      getData();
    } else {
      async function getData() {
        const apiData = await generalGetFunction(`/ports/all`);
        if (apiData?.status) {
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
    if (apiData?.status) {
      const updatedPortData = portData.filter(
        (item) => item.id !== deleteIndex
      );
      setPortData(updatedPortData);
      setLoading(false);
      toast.success(apiData.success);
    } else {
      setLoading(false);
      // const errorMessage = Object.keys(apiData.errors);
      // toast.error(apiData.errors[errorMessage[0]][0]);
    }
  };

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <Header title="Port Number" />
              {/* <div
                className="d-flex flex-wrap justify-content-end px-xl-3 py-2 position-relative"
                style={{ zIndex: 1 }}
                id="detailsHeader"
              >
                <div className="col-xl-8 pt-3 pt-xl-0">
                  <div className="d-flex justify-content-end">
                    <button
                      effect="ripple"
                      className="panelButton"
                      onClick={() => {
                        navigate(-1);
                        backToTop();
                      }}
                    >
                      <span className="text">Back</span>
                      <span className="icon"><i class="fa-solid fa-caret-left"></i></span>
                    </button>
                    <Link
                      to="/port-number-add"
                      onClick={backToTop}
                      effect="ripple"
                      className="panelButton"
                    >
                      <span className="text">Add</span>
                      <span className="icon"><i class="fa-solid fa-plus"></i></span>
                    </Link>
                  </div>
                </div>
              </div> */}

              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>Port Number</h4>
                          <p>Port a number</p>
                        </div>
                        <div className="buttonGroup">
                          <button
                            effect="ripple"
                            className="panelButton gray"
                            onClick={() => {
                              navigate(-1);
                              backToTop();
                            }}
                          >
                            <span className="text">Back</span>
                            <span className="icon">
                              <i class="fa-solid fa-caret-left"></i>
                            </span>
                          </button>
                          {account?.permissions?.includes(310) ? (
                            <Link
                              to="/port-number-add"
                              onClick={backToTop}
                              effect="ripple"
                              className="panelButton"
                            >
                              <span className="text">Add</span>
                              <span className="icon">
                                <i class="fa-solid fa-plus"></i>
                              </span>
                            </Link>
                          ) : (
                            <button
                              effect="ripple"
                              className="panelButton "
                              disabled
                              style={{ cursor: "not-allowed" }}
                            >
                              <span className="text">Add</span>
                              <span className="icon">
                                <i class="fa-solid fa-plus"></i>
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-12"
                      style={{ overflow: "auto", padding: "25px 20px 0" }}
                    >
                      <div className="tableHeader">
                        <div className="showEntries">
                          <label>Show</label>
                          <select className="formItem">
                            <option>Max</option>
                          </select>
                          <label>entries</label>
                        </div>
                        <div className="searchBox">
                          <label>Search:</label>
                          <input
                            type="search"
                            className="formItem"
                            onChange={() => featureUnderdevelopment()}
                          />
                        </div>
                      </div>
                      <div className="tableContainer">
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
                              <th>Edit</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {noPermissionToRead ? (
                              <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td> No Permission</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                            ) : loading ?
                              (<SkeletonTableLoader col={10} row={15} />)
                              : (
                                <>
                                  {portData.length > 0 &&
                                    portData.map((item) => {
                                      const handleEditPortNumber = (id) => {
                                        navigate(`/port-number-edit?id=${id}`);
                                      };
                                      return (
                                        <tr key={item.id}>
                                          <td
                                            onClick={() =>
                                              handleEditPortNumber(item.id)
                                            }
                                            style={{ cursor: "default" }}
                                          >
                                            {item.id}
                                          </td>
                                          <td
                                            onClick={() =>
                                              handleEditPortNumber(item.id)
                                            }
                                            style={{ cursor: "default" }}
                                          >
                                            {item.fullname}
                                          </td>
                                          <td
                                            onClick={() =>
                                              handleEditPortNumber(item.id)
                                            }
                                            style={{ cursor: "default" }}
                                          >
                                            {item.company_name}
                                          </td>
                                          <td
                                            onClick={() =>
                                              handleEditPortNumber(item.id)
                                            }
                                            style={{ cursor: "default" }}
                                          >
                                            {item?.billing_address}
                                          </td>
                                          <td
                                            onClick={() =>
                                              handleEditPortNumber(item.id)
                                            }
                                            style={{ cursor: "default" }}
                                          >
                                            {item?.pin}
                                          </td>
                                          <td
                                            onClick={() =>
                                              handleEditPortNumber(item.id)
                                            }
                                            style={{ cursor: "default" }}
                                          >
                                            {item?.carrier}
                                          </td>

                                          <td
                                            onClick={() =>
                                              handleEditPortNumber(item.id)
                                            }
                                            style={{ cursor: "default" }}
                                          >
                                            {item?.account_number}
                                          </td>
                                          <td
                                            onClick={() =>
                                              handleEditPortNumber(item.id)
                                            }
                                            style={{ cursor: "default" }}
                                          >
                                            {item?.phone_number}
                                          </td>
                                          <td>
                                            <button
                                              className="tableButton edit"
                                              onClick={() =>
                                                handleEditPortNumber(item.id)
                                              }
                                            >
                                              <i class="fa-solid fa-pencil"></i>
                                            </button>
                                          </td>
                                          <td>
                                            <button
                                              className="tableButton delete"
                                              onClick={() => {
                                                setPopup(true);
                                                setDeleteIndex(item.id);
                                              }}
                                            >
                                              <i className="fa-solid fa-trash"></i>
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  {portData && Object.keys(portData).length === 0 ? (
                                    <td colSpan={99}>
                                      <EmptyPrompt
                                        name="Port Number"
                                        link="port-number-add"
                                      />
                                    </td>
                                  ) : (
                                    ""
                                  )}
                                </>
                              )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
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

                      <div className="d-flex justify-content-between">
                        <button
                          className="panelButton m-0"
                          onClick={() => {
                            handleDeletePortNumber();
                          }}
                        >
                          <span className="text">Confirm</span>
                          <span className="icon">
                            <i class="fa-solid fa-check"></i>
                          </span>
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
