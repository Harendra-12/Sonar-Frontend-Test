import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { backToTop, generalGetFunction } from "../../GlobalFunction/globalFunction";
import ContentLoader from "../Misc/ContentLoader";
import { Link, useNavigate } from "react-router-dom";


function RateCharge() {
  const [loading, setLoading] = useState(true);
  const [rateCard, setRateCard] = useState();

  const navigate = useNavigate();
  // Getting packes value from inital state
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/did/rates`);
      if (apiData.status) {
        setLoading(false);
        setRateCard(apiData.data);
      }
    }
    getData();
  }, []);


  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Rate Cards" />
              <div className="d-flex flex-wrap px-xl-3 py-2" id="detailsHeader">
                <div className="col-xl-4 my-auto">
                  <div className="position-relative searchBox">
                    <input
                      type="search"
                      name="Search"
                      id="headerSearch"
                      placeholder="Search"
                    />
                  </div>
                </div>
                <div className="col-xl-8 pt-3 pt-xl-0">
                  <div className="d-flex justify-content-end">
                    <p

                      onClick={() => { backToTop(); navigate(-1) }}
                      effect="ripple"
                      className="panelButton"
                    >
                      Back
                    </p>
                    <Link
                      to="/did-add-rate"
                      onClick={backToTop}
                      effect="ripple"
                      className="panelButton"
                    >
                      Add
                    </Link>
                  </div>
                  <div className="col-xl-8 mt-3 mt-xl-0">
                    <div className="d-flex justify-content-end flex-wrap gap-2"></div>
                  </div>
                </div>
              </div>
              <div className="col-12" style={{ overflow: "auto" }}>
                <div className="mx-2 tableContainer">
                  <table>
                    <thead>
                      <tr>
                        <th>Vendor Name</th>
                        <th>Rate Type</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={99}>
                            <ContentLoader />
                          </td>
                        </tr>
                      ) : (
                        <>
                          {rateCard &&
                            rateCard.map((item, index) => {
                              return (
                                <tr
                                  key={index}
                                >
                                  <td onClick={() =>
                                    navigate(`/edit-rate-charge`, { state: item })
                                  } >{item.vendor.vendor_name}</td>
                                  <td onClick={() =>
                                    navigate(`/edit-rate-charge`, { state: item })
                                  } >{item.rate_type}</td>
                                  <td onClick={() =>
                                    navigate(`/edit-rate-charge`, { state: item })
                                  } >{item.rate}</td>
                                </tr>
                              );
                            })}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default RateCharge;
