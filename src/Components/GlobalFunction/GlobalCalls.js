/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
// This file is used to store the global calls, and It will refresh the data in global state
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generalGetFunction } from "./globalFunction";
import { useNavigate } from "react-router-dom";

function GlobalCalls() {
  const account = useSelector((state) => state.account);
  const Id = account?.id || "";
  const allCallCenterIds = useSelector((state) => state.allCallCenterIds);
  const cardListRefresh = useSelector((state) => state.cardListRefresh);
  const billingListRefresh = useSelector((state) => state.billingListRefresh);
  const accountDetailsRefresh = useSelector(
    (state) => state.accountDetailsRefresh
  );
  const callDetailsRefresh = useSelector((state) => state.callDetailsRefresh);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const extensionRefresh = useSelector((state) => state.extensionRefresh);
  const ringGroupRefresh = useSelector((state) => state.ringGroupRefresh);
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const extensionAllRefresh = useSelector((state) => state.extensionAllRefresh);
  const timeZoneRefresh = useSelector((state) => state.timeZoneRefresh);
  const ivrRefresh = useSelector((state) => state.ivrRefresh);
  const updateBalance = useSelector((state) => state.updateBalance);
  const logout = useSelector((state) => state.logout);

  const navigate = useNavigate();
  const deviceProvisioningRefresh = useSelector(
    (state) => state.deviceProvisioningRefresh
  );

  // const rolesAndPermissionRefresh = useSelector(
  //   (state) => state.rolesAndPermissionRefresh
  // );
  const rolesRefresh = useSelector((state) => state.rolesRefresh);
  const permissionRefresh = useSelector((state) => state.permissionRefresh);
 
  const dispatch = useDispatch();
  useEffect(() => {
    if (account && account?.account_id) {
      async function getData() {
        const apiData = await generalGetFunction(`/call-details?account=${account.account_id}`);
        if (apiData?.status) {
          dispatch({
            type: "SET_ALLCALL",
            allCall: apiData.data,
          });
        }
      }

      if (callDetailsRefresh > 0) {
        getData();
      }
    }
  }, [account, callDetailsRefresh]);

  // Getting all card details
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(
        // `/card/all?account_id=${account?.account_id}`
        `/card/all`
      );
      if (apiData?.status) {
        dispatch({
          type: "SET_CARDLIST",
          cardList: apiData.data,
        });
        localStorage.setItem("cardList", JSON.stringify(apiData.data));
      }
    }
    if (cardListRefresh > 0) {
      getData();
    }
  }, [account?.account_id, cardListRefresh]);

  // Getting all billing address details
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(
        // `/billing-address/all?account_id=${account?.account_id}`
        `/billing-address/all`
      );
      if (apiData?.status) {
        dispatch({
          type: "SET_BILLINGLIST",
          billingList: apiData.data,
        });
        localStorage.setItem("billingList", JSON.stringify(apiData.data));
      }
    }
    if (billingListRefresh > 0) {
      getData();
    }
  }, [billingListRefresh]);

  // Getting account details
  useEffect(() => {
    async function getData() {
      const accountData = await generalGetFunction(
        `/account/${account?.account_id}`
      );
      if (accountData?.status) {
        dispatch({
          type: "SET_ACCOUNTDETAILS",
          accountDetails: accountData.data,
        });
        localStorage.setItem(
          "accountDetails",
          JSON.stringify(accountData.data)
        );
      }
    }
    // getData();
    if (accountDetailsRefresh > 0) {
      getData();
    }
  }, [account?.account_id, accountDetailsRefresh]);

  // Getting call center details
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/call-center-queues/all`);
      if (apiData?.status) {
        dispatch({
          type: "SET_CALLCENTER",
          callCenter: apiData.data,
        });
      }
    }
    // getData();
    if (callCenterRefresh > 0) {
      getData();
    }
  }, [callCenterRefresh]);

  // refresh allCallCenterIds
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/call-center-queues/all`);
      const details = apiData.data;
      if (apiData?.status) {
        const AssignedCallcenter = [...details].filter((queue) =>
          queue.agents.some((agent) => Number(agent.agent_name) == Id)
        );
        let CallerId = null; 
        if (AssignedCallcenter.length > 0) {
          dispatch({
            type: "SET_OPEN_CALLCENTER_POPUP",
            openCallCenterPopUp: true,
          });
          AssignedCallcenter.forEach((item) => {
            const foundAgent = item.agents.find(
              (agent) =>
                Number(agent.agent_name) === Id && agent.status === "Available"
            );

            if (foundAgent && foundAgent?.id) {
              CallerId = foundAgent.id; // Assign only if found
              if (!allCallCenterIds.includes(CallerId)) {
                dispatch({
                  type: "SET_ALL_CALL_CENTER_IDS",
                  CallerId,
                });
              }
            }
          });
        }
      }
    }
    if (callCenterRefresh > 0) {
      getData();
    }
  }, [callCenterRefresh]);

  // Getting extension details
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(
        `/extension/search?account=${account?.account_id}`
      );
      if (apiData?.status) {
        dispatch({
          type: "SET_EXTENSION",
          extension: apiData.data,
        });
      }
    }
    // getData();
    if (extensionRefresh > 0) {
      getData();
    }
  }, [extensionRefresh]);

  // Getting extension all details
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(
        `/extension/search?account=${account?.account_id}`
      );
      if (apiData?.status) {
        dispatch({
          type: "SET_EXTENSIONALL",
          extensionAll: apiData,
        });
      }
    }
    // getData();
    if (extensionAllRefresh > 0) {
      getData();
    }
  }, [extensionAllRefresh]);

  // Getting timezone details
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction("/timezones");
      if (apiData?.status) {
        dispatch({
          type: "SET_TIMEZONE",
          timeZone: apiData.data,
        });
      }
    }
    // getData();
    if (timeZoneRefresh > 0) {
      getData();
    }
  }, [timeZoneRefresh]);

  // Getting ring group details
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(
        `/ringgroup?account=${account?.account_id}`
      );
      if (apiData?.status) {
        dispatch({
          type: "SET_RINGGROUP",
          ringGroup: apiData.data,
        });
      }
    }
    // getData();
    if (ringGroupRefresh > 0) {
      getData();
    }
  }, [ringGroupRefresh]);

  // Getting all user details
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/user/all`);
      if (apiData?.status) {
        // console.log(apiData);
        dispatch({
          type: "SET_ALLUSER",
          allUser: apiData.data,
        });
      }
    }
    // getData();
    if (allUserRefresh > 0) {
      getData();
    }
  }, [allUserRefresh]);

  // Getting roles and permission details
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/role/all`);
      // const permissionData = await generalGetFunction("/permission");
      if (apiData?.status) {
        dispatch({
          type: "SET_ROLES",
          roles: apiData.data,
        });
      }
      // if (permissionData?.status) {
      //   dispatch({
      //     type: "SET_PERMISSIONS",
      //     permissions: permissionData.data,
      //   });
      // }
    }
    if (rolesRefresh > 0) {
      getData();
    }
  }, [rolesRefresh]);
  useEffect(() => {
    async function getData() {
      // const apiData = await generalGetFunction(`/role/all`);
      const permissionData = await generalGetFunction("/permission");
      // if (apiData?.status) {
      //   dispatch({
      //     type: "SET_ROLES",
      //     roles: apiData.data,
      //   });
      // }
      if (permissionData?.status) {
        dispatch({
          type: "SET_PERMISSIONS",
          permissions: permissionData.data,
        });
      }
    }
    if (permissionRefresh > 0 &&localStorage.getItem("token")) {
      getData();
    }
  }, [permissionRefresh]);

  // Getting account balance
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction("/account-balance");
      if (apiData?.status) {
        dispatch({
          type: "SET_BALANCE",
          balance: apiData,
        });
      }
    }
    if (account) {
      getData();
    }
  }, [updateBalance]);

  // Getting ivr details
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(
        "/ivr-master/all?row_per_page=50"
      );
      if (apiData?.status) {
        dispatch({
          type: "SET_IVR",
          ivr: apiData.data.data,
        });
      }
    }
    if (ivrRefresh > 0) {
      getData();
    }
  }, [ivrRefresh]);

  // Getting device provisioning details
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction("/provision/all");
      if (apiData?.status) {
        dispatch({
          type: "SET_DEVICE_PROVISIONING",
          deviceProvisioning: apiData.data,
        });
      }
    }
    if (deviceProvisioningRefresh > 0) {
      getData();
    }
  }, [deviceProvisioningRefresh]);

  // useEffect(() => {
  //   async function getData() {
  //     const apiData = await generalGetFunction(
  //       `/domain/search?account=${account?.account_id}`
  //     );
  //     if (apiData.status) {
  //       dispatch({
  //         type: "SET_DOMAIN",
  //         domain: apiData.data[0],
  //       });
  //     }
  //   }
  //   if (domainRefresh > 0) {
  //     getData();
  //   }
  // }, [domainRefresh,account]);

  useEffect(() => {
    const getLoginInfo = async () => {
      const profile = await generalGetFunction("/user");
      if (profile?.status) {
        dispatch({
          type: "SET_ACCOUNT",
          account: profile.data,
        });

        localStorage.setItem("account", JSON.stringify(profile.data));
      }
    };
    if (account) {
      getLoginInfo();
    }
  }, []);


 
  useEffect(() => {
    async function logOut() {
      const apiData = await generalGetFunction("/logout");
      // localStorage.clear();
      navigate("/");
      if (apiData?.status) {
        localStorage.clear();
        dispatch({
          type: "SET_ACCOUNT",
          account: null,
        });
        dispatch({ type: "SET_LOGOUT", logout: 0 })

      }
    }
    if (logout > 0) {
      logOut()
    }
  }, [logout])
  return <div></div>;
}

export default GlobalCalls;
