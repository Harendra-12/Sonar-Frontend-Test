/* eslint-disable react-hooks/exhaustive-deps */

// This file is used to store the global calls, and It will refresh the data in global state
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { generalGetFunction } from "./globalFunction";

function GlobalCalls() {
  const account = useSelector((state) => state.account);
  const navigate = useNavigate();
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
  const domainRefresh = useSelector((state) => state.domainRefresh);
  const usersRefresh = useSelector((state) => state.usersRefresh);

  const rolesAndPermissionRefresh = useSelector(
    (state) => state.rolesAndPermissionRefresh
  );

  const dispatch = useDispatch();
  useEffect(() => {
    if (account && account?.account_id) {
      async function getData() {
        const apiData = await generalGetFunction(
          `/call-details?account_id=${account.account_id}`
        );
        if (apiData.status) {
          dispatch({
            type: "SET_ALLCALL",
            allCall: apiData.data,
          });
        }
      }

      if (callDetailsRefresh > 0) {
        getData();
      }
    } else {
      navigate("/");
    }
  }, [account, callDetailsRefresh]);

  // Getting all card details
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(
        `/card/all?account_id=${account.account_id}`
      );
      if (apiData.status) {
        dispatch({
          type: "SET_CARDLIST",
          cardList: apiData.data,
        });
        localStorage.setItem("cardList", JSON.stringify(apiData.data));
      }
    }
    // getData();
    if (cardListRefresh > 0) {
      getData();
    }
  }, [account?.account_id, cardListRefresh]);

  // Getting all billing address details
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(
        `/billing-address/all?account_id=${account.account_id}`
      );
      if (apiData.status) {
        dispatch({
          type: "SET_BILLINGLIST",
          billingList: apiData.data,
        });
        localStorage.setItem("billingList", JSON.stringify(apiData.data));
      }
    }
    // getData();
    if (billingListRefresh > 0) {
      // console.log("This is billing refresh", billingListRefresh);
      getData();
    }
  }, [billingListRefresh]);

  // Getting account details
  useEffect(() => {
    async function getData() {
      const accountData = await generalGetFunction(
        `/account/${account.account_id}`
      );
      if (accountData.status) {
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
      const apiData = await generalGetFunction(`/call-center-queues`);
      if (apiData.status) {
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

  // Getting extension details
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(
        `/extension/search?account=${account.account_id}`
      );
      if (apiData.status) {
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

  // Getting ring group details
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(
        `/ringgroup?account=${account.account_id}`
      );
      if (apiData.status) {
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
      if (apiData.status) {
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

  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/role/all`);
      const permissionData = await generalGetFunction("/permission");
      if (apiData.status) {
        dispatch({
          type: "SET_ROLES",
          roles: apiData.data,
        });
      }
      if (permissionData.status) {
        dispatch({
          type: "SET_PERMISSIONS",
          permissions: permissionData.data,
        });
      }
    }
    if (rolesAndPermissionRefresh > 0) {
      getData();
    }
  }, [rolesAndPermissionRefresh]);

  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(
        `/domain/search?account=${account.account_id}`
      );
      if (apiData.status) {
        dispatch({
          type: "SET_DOMAIN",
          domain: apiData.data[0],
        });
      }
    }
    if (domainRefresh > 0) {
      getData();
    }
  }, [domainRefresh]);

  return <div></div>;
}

export default GlobalCalls;
