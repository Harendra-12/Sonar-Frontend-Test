import React, { useEffect } from "react";
import Header from "../../CommonComponents/Header";
import { Link } from "react-router-dom";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
import EmptyPrompt from "../../Loader/EmptyPrompt";

function AccessControl() {
  const [accessControlList, setAccessControlList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const apiData = await generalGetFunction("/")
      if (apiData.status) {
        setAccessControlList(apiData.data)
        setLoading(false)
      } else {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  return (
    <>
      <div className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Access Control List" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>
                            Access Control
                            <button className="clearButton">
                            </button>
                          </h4>
                          <p>You can see all list of access control</p>
                        </div>
                        <div className="buttonGroup">
                          <button effect="ripple" className="panelButton gray">
                            <span className="text">Back</span>
                            <span className="icon">
                              <i className="fa-solid fa-caret-left"></i>
                            </span>
                          </button>
                          <Link
                            to="/access-control-list-add"
                            effect="ripple"
                            className="panelButton"
                          >
                            <span className="text">Add</span>
                            <span className="icon">
                              <i className="fa-solid fa-plus"></i>
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-12"
                      style={{ overflow: "auto", padding: "10px 20px 0px" }}
                    >
                      <div className="tableContainer">
                        <div className="utilPopup" />
                        <div className="utilPopup" />
                        <table>
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>List</th>
                              <th className="text-center">Edit</th>
                              <th className="text-center">Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <SkeletonTableLoader col={4} row={15} />
                            ) : (
                              <>
                                {
                                  accessControlList.length > 0 ?
                                    <>
                                      {
                                        accessControlList.map((item, key) => {
                                          return (
                                            <tr key={key}>
                                              <td>{item.name}</td>
                                              <td>
                                                {item.description}
                                              </td>
                                              <td>
                                                <button className="tableButton edit mx-auto">
                                                  <i className="fa-solid fa-pencil" />
                                                </button>
                                              </td>
                                              <td>
                                                <button className="tableButton delete mx-auto">
                                                  <i className="fa-solid fa-trash" />
                                                </button>
                                              </td>
                                            </tr>
                                          )
                                        })
                                      }
                                    </>
                                    : <td colSpan={99}>
                                      <EmptyPrompt
                                        name="Access Control List"
                                        link="access-control-list-add"
                                      />
                                    </td>
                                }
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
        </section>
      </div>
    </>
  );
}

export default AccessControl;
