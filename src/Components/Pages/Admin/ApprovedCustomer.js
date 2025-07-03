import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";
import ContentLoader from "../../Loader/ContentLoader";

/**
 * ApprovedCustomer
 *
 * This component displays a list of all approved users and their respective company details.
 * The component renders a table with the following columns: Company Name, Admin Name, Email, Phone Number, Address, Document Uploaded, Balance.
 * The user can click on a specific row to navigate to the user details page.
 * The component is connected to the Redux store and listens for changes to the user list and the login user.
 */
function ApprovedCustomer() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState();
  const navigate = useNavigate();

  // Getting packes value from inital state
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(
        `/accounts?company_status=approved`
      );
      if (apiData?.status) {
        setLoading(false);
        setAccount(apiData.data);
      } else {
        setLoading(false);
      }
    }
    getData();
  }, []);
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <Header title="Pending Verification" />
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="row px-xl-0" id="detailsHeader">
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
                        <th>Balance</th>
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
                                    navigate(`/user-details?id=${item.id}`)
                                  }
                                  key={index}
                                >
                                  <td>{item.company_name}</td>
                                  <td>{item.admin_name}</td>
                                  <td>{item.email}</td>
                                  <td>{item.contact_no}</td>
                                  <td>{item.unit}</td>
                                  <td>
                                    <label
                                      className={
                                        item.details !== null
                                          ? "tableLabel success"
                                          : "tableLabel fail"
                                      }
                                    >
                                      {item.details !== null ? "True" : "False"}
                                    </label>
                                  </td>
                                  <td>{item?.balance}</td>
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

export default ApprovedCustomer;
