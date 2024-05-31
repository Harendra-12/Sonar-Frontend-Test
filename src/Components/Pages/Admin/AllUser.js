import React, { useState } from 'react'
import Header from '../../CommonComponents/Header';
import { Link } from 'react-router-dom';
import { backToTop } from '../../GlobalFunction/globalFunction';
import ContentLoader from '../Misc/ContentLoader';
import EmptyPrompt from '../Misc/EmptyPrompt';

function AllUser() {
  const [loading,setLoading]=useState(true)
  return (
    <>
     <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="row px-xl-0" id="detailsHeader">
                  <Header title="Pending Verification" />
                  {/* <div className="mt-4" /> */}
                  <div className="col-xl-8 mt-3 mt-xl-0">
                    <div className="d-flex justify-content-end flex-wrap gap-2">
                      {/* <Link
                        to="/admin/package-add"
                        onClick={backToTop}
                        effect="ripple"
                        className="panelButton"
                      >
                        Add
                      </Link> */}
                      {/* <div className="my-auto position-relative mx-3">
                        <label className="switch">
                          <input type="checkbox" id="showAllCheck" />
                          <span className="slider round" />
                        </label>
                        <span className="position-relative mx-1">Show All</span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12" style={{ overflow: "auto" }}>
                <div className="mx-2 tableContainer">
                  <table>
                    <thead>
                      <tr>
                        <th>Company Name</th>
                        <th>Admin Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Address</th>
                        {/* <th>Description</th>
                        <th>Add Features</th> */}
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
                          {/* {packages &&
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
                                    navigate(`/admin/feature`,{state:{name:item.name,price:item.offer_price,feature:item.features,id:item.id}})
                                  }>
                                    <button className='clearButton ps-0 fw-bold text-success'><i className="fa-duotone fa-circle-plus me-1"></i>Feature</button>
                                  </td>

                                </tr>
                              );
                            })} */}
                        </>
                      )}

                      {/* {packages && packages.length === 0 ? (
                        <td colSpan={99}>
                          <EmptyPrompt name="User" link="users-add" />
                        </td>
                      ) : (
                        ""
                      )} */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default AllUser
