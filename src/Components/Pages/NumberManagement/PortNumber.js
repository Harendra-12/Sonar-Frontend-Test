import React, { useEffect, useState } from "react";
import {
  backToTop,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import { Link, useNavigate } from "react-router-dom";

import ContentLoader from "../../Loader/ContentLoader";

function PortNumber() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [portData, setPortData] = useState([]);

  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/ports/all`);
      if (apiData.status) {
        setLoading(false);
        setPortData(apiData.data);
      } else {
        setLoading(false);
        navigate(-1);
      }
    }
    getData();
  }, []);

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid px-0">
            <div className="row justify-content-center" id="subPageHeader">
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
                      </tr>
                    </thead>
                    <tbody>
                      {portData.length > 0 &&
                        portData.map((item) => {
                          return (
                            <tr
                              key={item.id}
                              onClick={() =>
                                navigate(`/port-number-edit?id=${item.id}`)
                              }
                            >
                              <td style={{ cursor: "default" }}>{item.id}</td>
                              <td style={{ cursor: "default" }}>
                                {item.fullname}
                              </td>
                              <td style={{ cursor: "default" }}>
                                {item.company_name}
                              </td>
                              <td style={{ cursor: "default" }}>
                                {item?.billing_address}
                              </td>
                              <td style={{ cursor: "default" }}>{item?.pin}</td>
                              <td style={{ cursor: "default" }}>
                                {item?.carrier}
                              </td>

                              <td style={{ cursor: "default" }}>
                                {item?.account_number}
                              </td>
                              <td style={{ cursor: "default" }}>
                                {item?.phone_number}
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
        </section>
      </main>
    </>
  );
}

export default PortNumber;
