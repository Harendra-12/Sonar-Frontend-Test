import React, { useEffect, useState } from "react";
import SideNavbarApp from "./SideNavbarApp";
import { useDispatch, useSelector } from "react-redux";
import { generalPutFunction } from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";

const CallCenter = () => {
  const dispatch = useDispatch();
  const callCenter = useSelector((state) => state.callCenter);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const account = useSelector((state) => state.account) || {};
  const [assignerCallcenter, setAssignerCallcenter] = useState([]);

  const Id = account?.extension?.id || "";

  useEffect(() => {
    dispatch({
      type: "SET_CALLCENTERREFRESH",
      callCenterRefresh: callCenterRefresh + 1,
    });
  }, []);

  useEffect(() => {
    if (callCenter.length > 0) {
      const AssignedCallcenter = [...callCenter].filter((queue) =>
        queue.agents.some((agent) => agent.agent_name == Id)
      );

      setAssignerCallcenter(AssignedCallcenter);
    }
  }, [Id, callCenter]);

  return (
    <>
      <SideNavbarApp />
      <main className="mainContentApp">
        <div className="container-fluid">
          <div className="d-felx flex-column">
            <div>
              <h3 style={{ fontFamily: "Outfit", color: "rgb(68, 68, 68)" }}>
                Call Center
              </h3>
            </div>
            <div className="mt-4">
              <div
                className="col-12 callDashboardPrimTable"
                style={{ overflow: "auto" }}
              >
                <div className="tableContainer allItems">
                  <table>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Extension</th>
                        <th></th>

                        <th>Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignerCallcenter.length > 0 &&
                        assignerCallcenter.map((item, index) => {
                          return (
                            <CallCenterListItem
                              key={index}
                              index={index}
                              item={item}
                              Id={Id}
                            />
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CallCenter;

const CallCenterListItem = ({ item, index, Id }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [loading, setLoading] = useState(false);

  const refId = item.agents.filter((item) => item.agent_name == Id)[0].id || "";

  async function handleLoginLogout(CallerId, action) {
    const parsedData = {
      status: action,
    };

    const apiData = await generalPutFunction(
      `call-center-agent/update/${CallerId}`,
      parsedData
    );
    if (apiData.status) {
      setLoading(false);
      toast.success(apiData.message);
      if (action == "Logged Out") {
        setIsLoggedIn(false);
      } else if (action == "Available") {
        setIsLoggedIn(true);
        setIsOnBreak(false);
      } else if (action == "On Break") {
        setIsOnBreak(true);
      }
    } else {
      setLoading(false);

      toast.error(apiData.message);
    }
  }

  return (
    <>
      {loading ? <CircularLoader /> : ""}
      <tr>
        <td className="">
          <span className=" ">{index + 1}</span>
        </td>
        <td>{item?.queue_name}</td>
        <td>{item?.extension}</td>
        <td></td>

        <td className="">
          {isLoggedIn ? (
            <div className="d-flex gap-2">
              <button
                className={`btn ${isOnBreak ? "btn-danger" : "btn-success"}`}
                onClick={() => {
                  if (!isOnBreak) handleLoginLogout(refId, "On Break");
                  else if (isOnBreak) handleLoginLogout(refId, "Available");
                }}
              >
                Break
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleLoginLogout(refId, "Logged Out")}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="btn btn-success fs-6"
              onClick={() => handleLoginLogout(refId, "Available")}
            >
              Login
            </button>
          )}
        </td>
      </tr>
    </>
  );
};
