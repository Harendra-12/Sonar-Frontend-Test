import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from "../Misc/CircularLoader";
import { generalPostFunction } from "../../GlobalFunction/globalFunction";

function PackageAdd() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState({
    name: "Basic",
    nameMissing: false,
    number_of_user: "",
    userNumberMissing: false,
    description: "",
    descriptionMissing: false,
    subscription_type: "monthly",
    regular_price: "",
    regularPriceMissing: false,
    offer_price: "",
    offerPriceMissing: false,
  });

  // Function for add package
  async function handleSubmit() {
    if (packages.name === "") {
      setPackages((prevState) => ({
        ...prevState,
        nameMissing: true,
      }));
    } else {
      setPackages((prevState) => ({
        ...prevState,
        nameMissing: false,
      }));
    }
    if (packages.number_of_user === "") {
      setPackages((prevState) => ({
        ...prevState,
        userNumberMissing: true,
      }));
    } else {
      setPackages((prevState) => ({
        ...prevState,
        userNumberMissing: false,
      }));
    }
    if (packages.description === "") {
      setPackages((prevState) => ({
        ...prevState,
        descriptionMissing: true,
      }));
    } else {
      setPackages((prevState) => ({
        ...prevState,
        descriptionMissing: false,
      }));
    }
    if (packages.regular_price === "") {
      setPackages((prevState) => ({
        ...prevState,
        regularPriceMissing: true,
      }));
    } else {
      setPackages((prevState) => ({
        ...prevState,
        regularPriceMissing: false,
      }));
    }
    if (packages.offer_price === "") {
      setPackages((prevState) => ({
        ...prevState,
        offerPriceMissing: true,
      }));
    } else {
      setPackages((prevState) => ({
        ...prevState,
        offerPriceMissing: false,
      }));
    }

    if (
      packages.name !== "" &&
      packages.description !== "" &&
      packages.number_of_user !== "" &&
      packages.regular_price !== "" &&
      packages.offer_price !== ""
    ) {
      setLoading(true);
      const parsedData = {
        name: packages.name,
        number_of_user: packages.number_of_user,
        description: packages.description,
        subscription_type: packages.subscription_type,
        regular_price: packages.regular_price,
        offer_price: packages.offer_price,
      };

      const apiData = await generalPostFunction("/package/store", parsedData);
      if (apiData.status) {
        setLoading(false);
        toast.success(apiData.message);
      } else {
        setLoading(false);
        toast.error(apiData.message);
      }
    }
  }
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-12" id="subPageHeader">
                <div className="row px-xl-3">
                  <div className="col-xl-9 my-auto">
                    <h4 className="my-auto">Add Package</h4>
                    <p className="pt-2 mt-1 mb-0">Add Custom Package.</p>
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
                      <button
                        type="button"
                        effect="ripple"
                        className="panelButton"
                        onClick={handleSubmit}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mx-2" id="detailsContent">
                <form className="row">
                  <div className="formRow col-xl-12 px-xl-4">
                    <div className="col-12 d-flex justify-content-start">
                      <div className="formLabel pe-2 col-5">
                        <div>
                          <label className="text-dark">Package Name</label>
                          {packages.nameMissing ? (
                            <label className="status missing">
                              Field Missing
                            </label>
                          ) : (
                            ""
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="data"
                            className="formItemDesc"
                            style={{
                              fontSize: 12,
                              lineHeight: "18px",
                              marginTop: 5,
                            }}
                          >
                            Packages name.
                          </label>
                        </div>
                      </div>
                      <div className="col-3 pe-2">
                        <div className="formLabel"></div>
                        <div className="col-12">
                          <select
                            className="formItem"
                            value={packages.name}
                            onChange={(e) =>
                              setPackages((prevState) => ({
                                ...prevState,
                                name: e.target.value,
                              }))
                            }
                          >
                            <option>Basic</option>
                            <option>Standard</option>
                            <option>Advanced</option>
                          </select>
                          {/* <input
                            type="text"
                            name="extension"
                            className="formItem"
                            value={packages.name}
                            onChange={(e) => setPackages(prevState=>({
                                ...prevState,
                                name:e.target.value
                            }))}
                          /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="formRow col-xl-12 px-xl-4">
                    <div className="col-12 d-flex justify-content-start">
                      <div className="formLabel pe-2 col-5">
                        <div>
                          <label className="text-dark">Number Of Users</label>
                          {packages.userNumberMissing ? (
                            <label className="status missing">
                              Field Missing
                            </label>
                          ) : (
                            ""
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="data"
                            className="formItemDesc"
                            style={{
                              fontSize: 12,
                              lineHeight: "18px",
                              marginTop: 5,
                            }}
                          >
                            Number of users offer in this package.
                          </label>
                        </div>
                      </div>
                      <div className="col-3 pe-2">
                        <div className="formLabel">
                          {/* <label htmlFor="">Destinations</label> */}
                        </div>
                        <div className="col-12">
                          <input
                            type="text"
                            name="extension"
                            className="formItem"
                            value={packages.number_of_user}
                            onChange={(e) =>
                              setPackages((prevState) => ({
                                ...prevState,
                                number_of_user: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="formRow col-xl-12 px-xl-4">
                    <div className="col-12 d-flex justify-content-start">
                      <div className="formLabel pe-2 col-5">
                        <div>
                          <label className="text-dark">Description</label>
                          {packages.descriptionMissing ? (
                            <label className="status missing">
                              Field Missing
                            </label>
                          ) : (
                            ""
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="data"
                            className="formItemDesc"
                            style={{
                              fontSize: 12,
                              lineHeight: "18px",
                              marginTop: 5,
                            }}
                          >
                            Description about the package
                          </label>
                        </div>
                      </div>
                      <div className="col-3 pe-2">
                        <div className="formLabel">
                          {/* <label htmlFor="">Destinations</label> */}
                        </div>
                        <div className="col-12">
                          <input
                            type="text"
                            name="extension"
                            className="formItem"
                            value={packages.description}
                            onChange={(e) =>
                              setPackages((prevState) => ({
                                ...prevState,
                                description: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="formRow col-xl-12 px-xl-4">
                    <div className="col-12 d-flex justify-content-start">
                      <div className="formLabel pe-2 col-5">
                        <div>
                          <label className="text-dark">Subscription Type</label>
                        </div>
                        <div>
                          <label
                            htmlFor="data"
                            className="formItemDesc"
                            style={{
                              fontSize: 12,
                              lineHeight: "18px",
                              marginTop: 5,
                            }}
                          >
                            Select the Subscription type for the package
                          </label>
                        </div>
                      </div>
                      <div className="col-3 pe-2">
                        <div className="formLabel">
                          {/* <label htmlFor="">Destinations</label> */}
                        </div>
                        <div className="col-12">
                          <select
                            type="text"
                            name="extension"
                            className="formItem"
                            value={packages.subscription_type}
                            onChange={(e) =>
                              setPackages((prevState) => ({
                                ...prevState,
                                subscription_type: e.target.value,
                              }))
                            }
                          >
                            <option value="monthly">Monthly</option>
                            <option value="annually">Annually</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="formRow col-xl-12 px-xl-4">
                    <div className="col-12 d-flex justify-content-start">
                      <div className="formLabel pe-2 col-5">
                        <div>
                          <label className="text-dark">Original Price</label>
                          {packages.regularPriceMissing ? (
                            <label className="status missing">
                              Field Missing
                            </label>
                          ) : (
                            ""
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="data"
                            className="formItemDesc"
                            style={{
                              fontSize: 12,
                              lineHeight: "18px",
                              marginTop: 5,
                            }}
                          >
                            Original Price without offer
                          </label>
                        </div>
                      </div>
                      <div className="col-3 pe-2">
                        <div className="formLabel">
                          {/* <label htmlFor="">Destinations</label> */}
                        </div>
                        <div className="col-12">
                          <input
                            type="text"
                            name="extension"
                            className="formItem"
                            value={packages.regular_price}
                            onChange={(e) =>
                              setPackages((prevState) => ({
                                ...prevState,
                                regular_price: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="formRow col-xl-12 px-xl-4">
                    <div className="col-12 d-flex justify-content-start">
                      <div className="formLabel pe-2 col-5">
                        <div>
                          <label className="text-dark">Offer Price</label>
                          {packages.offerPriceMissing ? (
                            <label className="status missing">
                              Field Missing
                            </label>
                          ) : (
                            ""
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="data"
                            className="formItemDesc"
                            style={{
                              fontSize: 12,
                              lineHeight: "18px",
                              marginTop: 5,
                            }}
                          >
                            Offer Price dor the customer
                          </label>
                        </div>
                      </div>
                      <div className="col-3 pe-2">
                        <div className="formLabel">
                          {/* <label htmlFor="">Destinations</label> */}
                        </div>
                        <div className="col-12">
                          <input
                            type="text"
                            name="extension"
                            className="formItem"
                            value={packages.offer_price}
                            onChange={(e) =>
                              setPackages((prevState) => ({
                                ...prevState,
                                offer_price: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
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

export default PackageAdd;
