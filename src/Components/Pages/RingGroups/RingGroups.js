import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import ContentLoader from "../../Loader/ContentLoader";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import Header from "../../CommonComponents/Header";

const RingGroups = () => {
  const [ringGroup, setRingGroup] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [popUp, setPopUp] = useState(false);
  const account = useSelector((state) => state.account);
  const allUser = useSelector((state) => state.allUser);
  const [error, setError] = useState("");
  const [redirectRoutes, setRedirectRoutes] = useState("");
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const { data: usersData = [] } = allUser;
  useEffect(() => {
    dispatch({
      type: "SET_ALLUSERREFRESH",
      allUserRefresh: allUserRefresh + 1,
    });
    if (account && account.id) {
      async function getData() {
        const apidata = await generalGetFunction(
          `/ringgroup?account=${account.account_id}`
        );
        if (apidata.status) {
          setRingGroup(apidata.data);
          setLoading(false);
        } else {
          navigate("/");
        }
      }
      getData();
    } else {
      navigate("/");
    }
  }, []);
  console.log(allUser);
  const handleRingGroupAddValidation = (e) => {
    e.preventDefault();

    if (usersData.length === 0) {
      setPopUp(true);
      setError("Please add users to create a queue");
      setRedirectRoutes("/users");
      return;
    }

    const hasExtension = usersData.some((item) => item.extension_id);

    if (!hasExtension) {
      setPopUp(true);
      setError("Please add an extension to the users to create a queue");
      setRedirectRoutes("/extensions");
      return;
    }

    navigate("/ring-groups-add");
    backToTop();
  };
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Ring Groups" />
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
                  {/* <button
                    onClick={() => window.location.reload()}
                    effect="ripple"
                    className="panelButton"
                  >
                    Refresh
                  </button> */}
                  <Link
                    // to="/ring-groups-add"
                    // onClick={backToTop}
                    onClick={handleRingGroupAddValidation}
                    effect="ripple"
                    className="panelButton"
                  >
                    Add
                  </Link>
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
            <div className="col-12" style={{ overflow: "auto" }}>
              <div className="tableContainer">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Extension</th>
                      <th>Strategy</th>
                      <th>Members</th>
                      <th>Status</th>
                      <th>Description</th>
                      <th>Setting</th>
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
                      ""
                    )}
                    {ringGroup &&
                      ringGroup.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td
                              onClick={() =>
                                navigate(`/ring-groups-edit?id=${item.id}`)
                              }
                            >
                              {item.name}
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/ring-groups-edit?id=${item.id}`)
                              }
                            >
                              {item.extension}
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/ring-groups-edit?id=${item.id}`)
                              }
                            >
                              {item.strategy}
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/ring-groups-edit?id=${item.id}`)
                              }
                            >
                              {item.ring_group_destination.length}
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/ring-groups-edit?id=${item.id}`)
                              }
                            >
                              <label
                                className={
                                  item.status === "active"
                                    ? "tableLabel success"
                                    : "tableLabel fail"
                                }
                              >
                                {item.status}
                              </label>
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/ring-groups-edit?id=${item.id}`)
                              }
                              className="ellipsis"
                              id="detailBox"
                            >
                              {item.description}
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/ring-groups-settings?id=${item.id}`)
                              }
                            >
                              <i className="fa-duotone fa-gear text-success"></i>
                            </td>
                          </tr>
                        );
                      })}
                    {ringGroup && ringGroup.length === 0 ? (
                      <td colSpan={99}>
                        <EmptyPrompt name="Ring Group" link="ring-groups-add" />
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
      {popUp ? (
        <div className="popup">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div className="row content col-xl-4">
                <div className="col-2 px-0">
                  <div className="iconWrapper">
                    <i className="fa-duotone fa-triangle-exclamation"></i>
                  </div>
                </div>
                <div className="col-10 ps-0">
                  <h4>Warning!</h4>
                  <p>{error}</p>
                  <button
                    className="panelButton m-0"
                    onClick={() => {
                      // setForce(true);
                      setPopUp(false);
                      navigate(`${redirectRoutes}`);
                    }}
                  >
                    Lets Go!
                  </button>
                  <button
                    className="panelButtonWhite m-0 float-end"
                    onClick={() => setPopUp(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </main>
  );
};

export default RingGroups;
