import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";
import ContentLoader from "../Misc/ContentLoader";
import { useNavigate } from "react-router-dom";

function PendingDocument() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState();

  const navigate = useNavigate();
  // Getting packes value from inital state
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/accounts?company_status=2`);
      if (apiData.status) {
        setLoading(false);
        setAccount(apiData.data);
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
              <div className="col-12">
                <div className="row px-xl-0" id="detailsHeader">
                  <Header title="Pending Verification" />
                  {/* <div className="mt-4" /> */}
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
                        <th>Company Name</th>
                        <th>Admin Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Address</th>
                        <th>Document Uploaded</th>
                        <th>
                          Verification
                        </th>
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
                          {account &&
                            account.map((item, index) => {
                              return (
                                <tr
                                  onClick={() =>
                                    navigate(`/document-details?id=${item.id}`)
                                  }
                                  key={index}
                                >
                                  <td>{item.company_name}</td>
                                  <td>{item.admin_name}</td>
                                  <td>{item.email}</td>
                                  <td>{item.contact_no}</td>
                                  <td>{item.unit}</td>
                                  <td>
                                    <label className={item.details !== null ? "tableLabel success" : "tableLabel fail"}>{item.details !== null ? "True" : "False"}</label>
                                  </td>
                                  <td>
                                    {item.company_status === "new"
                                      ? "Pending" : ""
                                    }
                                  </td>
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

export default PendingDocument;
