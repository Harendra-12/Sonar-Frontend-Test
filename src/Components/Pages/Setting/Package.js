import React, { useEffect, useState } from "react";
import EmptyPrompt from "../Misc/EmptyPrompt";
import { Link, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import ContentLoader from "../Misc/ContentLoader";
import Header from "../../CommonComponents/Header";

function Package() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState();

  // Getting packes value from inital state
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/packages`);
      if (apiData.status) {
        setLoading(false);
        setPackages(apiData.data);
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
              <Header title="Packages" />
              <div className="row px-xl-3 py-2" id="detailsHeader">
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
                <div className="col-xl-8 mt-3 mt-xl-0">
                  <div className="d-flex justify-content-end flex-wrap gap-2">
                    <Link
                      to="/admin/package-add"
                      onClick={backToTop}
                      effect="ripple"
                      className="panelButton"
                    >
                      Add
                    </Link>
                    <div className="my-auto position-relative mx-3">
                      <label className="switch">
                        <input type="checkbox" id="showAllCheck" />
                        <span className="slider round" />
                      </label>
                      <span className="position-relative mx-1">Show All</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12" style={{ overflow: "auto" }}>
                <div className="mx-2 tableContainer">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Users</th>
                        <th>Sub. Type</th>
                        <th>Original Price</th>
                        <th>Offer Price</th>
                        <th>Description</th>
                        <th>Add Features</th>
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
                          {packages &&
                            packages.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td
                                    onClick={() =>
                                      navigate(`/admin/package-edit?id=${item.id}`)
                                    }
                                  >
                                    {item.name}
                                  </td>
                                  <td
                                    onClick={() =>
                                      navigate(`/admin/package-edit?id=${item.id}`)
                                    }
                                  >
                                    {item.number_of_user}
                                  </td>
                                  <td
                                    onClick={() =>
                                      navigate(`/admin/package-edit?id=${item.id}`)
                                    }
                                  >
                                    {item.subscription_type}
                                  </td>
                                  <td
                                    onClick={() =>
                                      navigate(`/admin/package-edit?id=${item.id}`)
                                    }
                                  >
                                    {item.regular_price}
                                  </td>
                                  <td
                                    onClick={() =>
                                      navigate(`/admin/package-edit?id=${item.id}`)
                                    }
                                  >
                                    {item.offer_price}
                                  </td>
                                  <td
                                    onClick={() =>
                                      navigate(`/admin/package-edit?id=${item.id}`)
                                    }
                                  >
                                    {item.description}
                                  </td>
                                  <td onClick={() =>
                                    navigate(`/admin/feature`, { state: { name: item.name, price: item.offer_price, feature: item.features, id: item.id } })
                                  }>
                                    <button className='clearButton ps-0 fw-bold text-success'><i className="fa-duotone fa-circle-plus me-1"></i>Feature</button>
                                  </td>

                                </tr>
                              );
                            })}
                        </>
                      )}

                      {packages && packages.length === 0 ? (
                        <td colSpan={99}>
                          <EmptyPrompt name="User" link="users-add" />
                        </td>
                      ) : (
                        ""
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

export default Package;
