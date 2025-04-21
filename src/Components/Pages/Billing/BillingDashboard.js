import React from "react";
import Header from "../../CommonComponents/Header";

function BillingDashboard() {
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Dashboard" />
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="row">
                  <div className="col-12">
                    <div className="heading d-block">
                      <div className=" tangoNavs">
                        <nav>
                          <div
                            className="nav nav-tabs"
                            id="nav-tab"
                            role="tablist"
                          >
                            <button
                              className="nav-link active ms-1"
                              id="nav-customer-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#nav-customer"
                              type="button"
                              role="tab"
                              aria-controls="nav-customer"
                              aria-selected="false"
                            >
                              All Calls Billing
                            </button>

                            <button
                              className="nav-link ms-1"
                              id="nav-contact-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#nav-billing"
                              type="button"
                              role="tab"
                              aria-controls="nav-billing"
                              aria-selected="false"
                            >
                              Addon Billing
                            </button>
                            <button
                              className="nav-link ms-1"
                              id="nav-contact-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#nav-billing"
                              type="button"
                              role="tab"
                              aria-controls="nav-billing"
                              aria-selected="false"
                            >
                              AI Token Billing
                            </button>
                            <button
                              className="nav-link ms-1"
                              id="nav-contact-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#nav-billing"
                              type="button"
                              role="tab"
                              aria-controls="nav-billing"
                              aria-selected="false"
                            >
                              Third Party Subscription Billing
                            </button>
                            <button
                              className="nav-link ms-1"
                              id="nav-contact-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#nav-billing"
                              type="button"
                              role="tab"
                              aria-controls="nav-billing"
                              aria-selected="false"
                            >
                              Agent Flow Billing
                            </button>

                            
                          </div>
                        </nav>
                      </div>
                      <div className="container-fluid">
                <div className="row ">
                  <div className="col-xl-12 mt-xl-4">
                    <div className="row">
                      <div className="col-xl-4 mb-3 mb-xl-0">
                        <div className="itemWrapper a">
                          <div className="heading">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h5>Monthly</h5>
                                <p>This month invoices</p>
                              </div>
                              <div className="col-3">
                                <i className="fa-duotone fa-file-invoice" />
                              </div>
                            </div>
                          </div>
                          <div className="data-number2">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-12">
                                <ul>
                                  <li>
                                    <div className="d-flex align-items-center justify-content-between">
                                      <h6>Monthly</h6>

                                      <h6>Inbound</h6>
                                      <h6>Outbound </h6>
                                      <h6>View</h6>
                                      <h6>Download</h6>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="d-flex align-items-center justify-content-between">
                                      <span>January</span>

                                      <span>$1000</span>
                                      <span>$500 </span>
                                      <span>
                                        <button className="tableButton edit mx-auto">
                                          <i class="fa-solid fa-eye"></i>
                                        </button>
                                      </span>
                                      <span>
                                        <button className="tableButton mx-auto blue">
                                          <i className="fa-solid fa-download" />
                                        </button>
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="d-flex align-items-center justify-content-between">
                                      <span>January</span>

                                      <span>$1000</span>
                                      <span>$500 </span>
                                      <span>
                                        <button className="tableButton edit mx-auto">
                                          <i class="fa-solid fa-eye"></i>
                                        </button>
                                      </span>
                                      <span>
                                        <button className="tableButton mx-auto blue">
                                          <i className="fa-solid fa-download" />
                                        </button>
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="d-flex align-items-center justify-content-between">
                                      <span>January</span>

                                      <span>$1000</span>
                                      <span>$500 </span>
                                      <span>
                                        <button className="tableButton edit mx-auto">
                                          <i class="fa-solid fa-eye"></i>
                                        </button>
                                      </span>
                                      <span>
                                        <button className="tableButton mx-auto blue">
                                          <i className="fa-solid fa-download" />
                                        </button>
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="d-flex align-items-center justify-content-between">
                                      <span>January</span>

                                      <span>$1000</span>
                                      <span>$500 </span>
                                      <span>
                                        <button className="tableButton edit mx-auto">
                                          <i class="fa-solid fa-eye"></i>
                                        </button>
                                      </span>
                                      <span>
                                        <button className="tableButton mx-auto blue">
                                          <i className="fa-solid fa-download" />
                                        </button>
                                      </span>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 mb-3 mb-xl-0">
                        <div className="itemWrapper a">
                          <div className="heading">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h5>Annually</h5>
                                <p>This month invoices</p>
                              </div>
                              <div className="col-3">
                                <i className="fa-duotone fa-file-invoice" />
                              </div>
                            </div>
                          </div>
                          <div className="data-number2">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-12">
                                <ul>
                                  <li>
                                    <div className="d-flex align-items-center justify-content-between">
                                      <h6>Annually</h6>

                                      <h6>Inbound</h6>
                                      <h6>Outbound </h6>
                                      <h6>View</h6>
                                      <h6>Download</h6>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="d-flex align-items-center justify-content-between">
                                      <span>2025</span>

                                      <span>$1000</span>
                                      <span>$500 </span>
                                      <span>
                                        <button className="tableButton edit mx-auto">
                                          <i class="fa-solid fa-eye"></i>
                                        </button>
                                      </span>
                                      <span>
                                        <button className="tableButton mx-auto blue">
                                          <i className="fa-solid fa-download" />
                                        </button>
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="d-flex align-items-center justify-content-between">
                                      <span>2024</span>

                                      <span>$1000</span>
                                      <span>$500 </span>
                                      <span>
                                        <button className="tableButton edit mx-auto">
                                          <i class="fa-solid fa-eye"></i>
                                        </button>
                                      </span>
                                      <span>
                                        <button className="tableButton mx-auto blue">
                                          <i className="fa-solid fa-download" />
                                        </button>
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="d-flex align-items-center justify-content-between">
                                      <span>2023</span>

                                      <span>$1000</span>
                                      <span>$500 </span>
                                      <span>
                                        <button className="tableButton edit mx-auto">
                                          <i class="fa-solid fa-eye"></i>
                                        </button>
                                      </span>
                                      <span>
                                        <button className="tableButton mx-auto blue">
                                          <i className="fa-solid fa-download" />
                                        </button>
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="d-flex align-items-center justify-content-between">
                                      <span>2022</span>

                                      <span>$1000</span>
                                      <span>$500 </span>
                                      <span>
                                        <button className="tableButton edit mx-auto">
                                          <i class="fa-solid fa-eye"></i>
                                        </button>
                                      </span>
                                      <span>
                                        <button className="tableButton mx-auto blue">
                                          <i className="fa-solid fa-download" />
                                        </button>
                                      </span>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 chartWrapper mb-3 mb-xl-0">
                        <div className="itemWrapper c">
                          <div className="heading h-auto">
                            <div className="d-flex flex-wrap justify-content-between align-items-center">
                              <div className="col-auto">
                                <h5>Call Billed Per Hour</h5>
                              </div>
                              <div className="col-auto">
                                <ul className="chart_tabs">
                                  <li className="nav-item">
                                    <input
                                      className="nav-link"
                                      type="radio"
                                      name="graphCostFilter"
                                      defaultValue={1}
                                    />
                                    <button className="nav-link">1 Hr</button>
                                  </li>
                                  <li className="nav-item">
                                    <input
                                      className="nav-link"
                                      type="radio"
                                      name="graphCostFilter"
                                      defaultValue={3}
                                    />
                                    <button className="nav-link">3 Hr</button>
                                  </li>
                                  <li className="nav-item">
                                    <input
                                      className="nav-link"
                                      type="radio"
                                      name="graphCostFilter"
                                      defaultValue={6}
                                    />
                                    <button className="nav-link">6 Hr</button>
                                  </li>
                                  <li className="nav-item">
                                    <input
                                      className="nav-link"
                                      type="radio"
                                      name="graphCostFilter"
                                      defaultValue={12}
                                    />
                                    <button className="nav-link">12 Hr</button>
                                  </li>
                                  <li className="nav-item">
                                    <input
                                      className="nav-link"
                                      type="radio"
                                      name="graphCostFilter"
                                      defaultValue={24}
                                      defaultChecked=""
                                    />
                                    <button className="nav-link">24 Hr</button>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex flex-wrap justify-content-between mt-1">
                            <div
                              style={{
                                width: "100%",
                                height: 320,
                                position: "relative",
                                margin: "0px auto",
                              }}
                            >
                              <canvas
                                role="img"
                                height={320}
                                width={399}
                                style={{
                                  display: "block",
                                  boxSizing: "border-box",
                                  height: 320,
                                  width: 399,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                    </div>
                  </div>
                </div>
              </div>

              

              
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BillingDashboard;
