/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { generalGetFunction } from "./globalFunction";

function GlobalCalls() {
  const account = useSelector((state) => state.account);
  const navigate = useNavigate();
  const cardListRefresh = useSelector((state) => state.cardListRefresh);
  const billingListRefresh = useSelector((state) => state.billingListRefresh);
  const accountDetailsRefresh = useSelector((state)=>state.accountDetailsRefresh)

  const dispatch = useDispatch();
  useEffect(() => {
    if (account && account?.account_id) {
      async function getData() {
        const apiData = await generalGetFunction(
          `/call-details?account=${account.account_id}`
        );
        if (apiData.status) {
          dispatch({
            type: "SET_ALLCALL",
            allCall: apiData.data,
          });
        }
      }
      getData();
    } else {
      navigate("/");
    }
  }, [account]);

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
        localStorage.setItem("cardList",JSON.stringify(apiData.data))
      }
    }
    if(cardListRefresh>0){
        getData();
    }
   
  }, [account?.account_id, cardListRefresh]);

  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/billing-address/all`);
      if (apiData.status) {
        dispatch({
          type: "SET_BILLINGLIST",
          billingList: apiData.data,
        });
        localStorage.setItem("billingList",JSON.stringify(apiData.data))
      }
    }
    if(billingListRefresh>0){
      console.log("This is billing refresh",billingListRefresh);
        getData();
    }
    
  }, [billingListRefresh]);

  useEffect(()=>{
    async function getData(){
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
    if(accountDetailsRefresh>0){
      getData()
    }
  
  },[account?.account_id, accountDetailsRefresh])
  return <div></div>;
}

export default GlobalCalls;
