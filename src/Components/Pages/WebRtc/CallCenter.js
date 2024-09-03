import React, { useEffect, useState } from "react";
import SideNavbarApp from "./SideNavbarApp";
import { useDispatch, useSelector } from "react-redux";
import { generalPutFunction } from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";
import ActiveCallSidePanel from "./ActiveCallSidePanel";

const CallCenter = () => {
  const sessions = useSelector((state) => state.sessions);
  const dispatch = useDispatch();
  const callCenter = useSelector((state) => state.callCenter);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const account = useSelector((state) => state.account) || {};
  const [assignerCallcenter, setAssignerCallcenter] = useState([]);

  const Id = account?.id || "";

  useEffect(() => {
    dispatch({
      type: "SET_CALLCENTERREFRESH",
      callCenterRefresh: callCenterRefresh + 1,
    });
  }, []);

  useEffect(() => {
    if (callCenter.length > 0) {
      const AssignedCallcenter = [...callCenter].filter((queue) =>
        queue.agents.some((agent) => Number(agent.agent_name) == Id)
      );

      setAssignerCallcenter(AssignedCallcenter);
    }
  }, [Id, callCenter]);

  return (
    <>
    <style>
      {`
        .callDashboardPrimTable{
          height: calc(100vh - 70px);
        }
      `}
    </style>
      <SideNavbarApp />
      <main className="mainContentApp"
      style={{
        marginRight:
          sessions.length > 0 && Object.keys(sessions).length > 0
            ? "250px"
            : "0",
      }}>
        <div className="container-fluid">
          <div className="d-felx flex-column pt-2">
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
                  <table className="callCenter">
                    <thead>
                      <tr>
                        <th className="sl">S.No</th>
                        <th>Name</th>
                        <th className="extension">Extension</th>
                        <th className="options">Options</th>
                        {/* <th className="options">Break</th> */}
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
      {sessions.length > 0 && Object.keys(sessions).length > 0 ? (
          <>
            <section className="activeCallsSidePanel">
              <div className="container">
                <div className="row">
                  {sessions.length > 0 &&
                    sessions.map((session, chennel) => (
                      <ActiveCallSidePanel
                        key={chennel}
                        sessionId={session.id}
                        destination={session.destination}
                        chennel={chennel}
                      />
                    ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          ""
        )}
    </>
  );
};

export default CallCenter;

const CallCenterListItem = ({ item, index, Id }) => {
  console.log("This is id", Id);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [loading, setLoading] = useState(false);

  const refId = item.agents.filter((item) => Number(item.agent_name) == Id)[0].id || "";

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
        <td className="">
          {isLoggedIn ? (
            <div className="d-flex gap-2">
              <label
                className={`tableLabel  ${isOnBreak ? "pending" : "success"}`}
                onClick={() => {
                  if (!isOnBreak) handleLoginLogout(refId, "On Break");
                  else if (isOnBreak) handleLoginLogout(refId, "Available");
                }}
              >
                Break
              </label>
              <label
                className="tableLabel fail"
                onClick={() => handleLoginLogout(refId, "Logged Out")}
              >
                Logout
              </label>
            </div>
          ) : (
            <label
              className="tableLabel success"
              onClick={() => handleLoginLogout(refId, "Available")}
            >
              Login
            </label>
          )}
        </td>
      </tr>
    </>
  );
};
