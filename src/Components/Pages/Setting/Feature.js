import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from "../Misc/CircularLoader";
import {
  generalDeleteFunction,
  generalGetFunction,
  generalPostFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";

function Feature() {
  const navigate = useNavigate();
  const location = useLocation();
  const [feature, setFeature] = useState();
  const [loading, setLoading] = useState(false);
  const [editName, setEditName] = useState("");
  const [editNameMissing, setEditNameMissing] = useState(false);
  const [editId, setEditId] = useState();
  const [name, setName] = useState("");
  const [nameMissing, setNameMissing] = useState(false);

  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    } else {
      setFeature(location.state.feature);
    }
  }, [location, navigate]);

  //   Handle name update
  async function handleUpdate(id) {
    if (editName === "") {
      setEditNameMissing(true);
    } else {
      setEditNameMissing(false);
    }
    if (editName !== "") {
      setLoading(true);
      const parsedData = {
        name: editName,
        package_id: location.state.id,
      };
      const apiData = await generalPutFunction(
        `/feature/update/${id}`,
        parsedData
      );
      if (apiData.status) {
        setLoading(false);
        toast.success(apiData.message);
      } else {
        setLoading(false);
        toast.error(apiData.message);
      }
    }
  }

  // Handel delete feature
  async function deleteFeature(id, index) {
    setLoading(true);
    const apiData = await generalDeleteFunction(`/feature/destroy/${id}`);
    if (apiData.status) {
      setLoading(false);
      const newArray = feature.filter((item, ind) => ind !== index);
      setFeature(newArray);
      toast.success(apiData.message);
    } else {
      setLoading(false);
      toast.error(apiData.message);
    }
  }

  // Handel add new feature
  async function addNewFeature(index) {
    if (name === "") {
      setNameMissing(true);
    } else {
      setNameMissing(false);
    }
    if (name !== "") {
      setLoading(true);
      const parseDdata = {
        name: name,
        package_id: location.state.id,
      };
      const apiData = await generalPostFunction(`/feature/store`, parseDdata);
      if (apiData.status) {
        const getFeature = await generalGetFunction(
          `/package/details/${location.state.id}`
        );
        if (getFeature.status) {
          setLoading(false);
          toast.success("Added a new feature");
          setName("");
          setFeature(getFeature.data.features);
        } else {
          setLoading(false);
          toast.error(apiData.message);
        }
      } else {
        setLoading(false);
        toast.error(apiData.message);
      }
    }
  }
  console.log("This is edit name", editName);
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-12" id="subPageHeader">
                <div className="row px-xl-3">
                  <div className="col-xl-9 my-auto">
                    <h4 className="my-auto">Add Features</h4>
                    <p className="pt-2 mt-1 mb-0">
                      Package name:- {location.state.name} <br />
                      Package Price:- {location.state.price}
                    </p>
                  </div>
                  <div className="col-xl-3 ps-2">
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        effect="ripple"
                        className="panelButton"
                        onClick={() => navigate(-1)}
                      >
                        Back
                      </button>
                      {/* <button
                        type="button"
                        effect="ripple"
                        className="panelButton"
                        onClick={handleSubmit}
                      >
                        Save
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12" style={{ overflow: "auto" }}>
                <div className="tableContainer">
                  <table>
                    <thead>
                      <tr>
                        <th>Serial No.</th>
                        <th>Feature</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      <>
                        {feature &&
                          feature.map((item, key) => {
                            return (
                              <tr key={key}>
                                <td>{key + 1}.</td>
                                <td>
                                  <input
                                    type="text"
                                    placeholder={item.name}
                                    className="formItem m-0"
                                    style={{ height: 25 }}
                                    onChange={(e) =>
                                      setEditName(e.target.value)
                                    }
                                    disabled={editId === item.id ? false : true}
                                  />
                                  {editId === item.id && editNameMissing ? (
                                    <label className="status missing">
                                      field missing
                                    </label>
                                  ) : (
                                    ""
                                  )}
                                </td>
                                <td
                                  onClick={() => {
                                    setEditId(item.id);
                                    handleUpdate(item.id);
                                  }}
                                >
                                  <button className="clearButton ps-0 fw-bold">
                                    <i className="fa-duotone fa-pen-to-square me-1"></i>
                                    {editId === item.id ? "Save" : "Edit"}
                                  </button>
                                </td>
                                <td onClick={() => deleteFeature(item.id, key)}>
                                  <button className="clearButton ps-0 text-danger fw-bold">
                                    <i className="fa-duotone fa-trash me-1"></i>
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mx-2" id="detailsContent">
                <div className="row">
                  <div className="formRow col-xl-12 px-xl-4">
                    <div className="col-12 d-flex justify-content-start align-items-center">
                      <div className="formLabel my-0 p-0 col-5">
                        <label className="text-dark">Package Feature</label>
                        {/* {packages.nameMissing? <label className="status missing">
                              Field Missing
                            </label>:""} */}
                      </div>
                      <div className="col-3 pe-2">
                        <div className="formLabel p-0">
                          {nameMissing ? (
                            <label className="status missing">
                              field missing
                            </label>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="col-12">
                          <input
                            type="text"
                            className="formItem m-0"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <button
                          type="button"
                          className="panelButton"
                          onClick={() => addNewFeature()}
                        >
                          <i className="fa-duotone fa-circle-plus"></i> Add More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {loading ? <CircularLoader /> : ""}
            </div>
          </div>
        </section>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </main>
    </>
  );
}

export default Feature;
