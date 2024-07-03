import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { generalGetFunction } from "./globalFunction";

function GlobalCalls() {
  const account = useSelector((state) => state.account);
  const navigate = useNavigate();
  const cardListRefresh = useSelector((state) => state.cardListRefresh);
  console.log("Card refresh from global",cardListRefresh);
  const billingListRefresh = useSelector((state) => state.billingListRefresh);

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
  }, [account, dispatch, navigate]);

  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(
        `/all-cards?account_id=${account.account_id}`
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
   
  }, [account?.account_id, cardListRefresh, dispatch]);

  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/billing-address`);
      if (apiData.status) {
        dispatch({
          type: "SET_BILLINGLIST",
          billingList: apiData.data,
        });
        localStorage.setItem("billingList",JSON.stringify(apiData.data))
      }
    }
    if(billingListRefresh>0){
        getData();
    }
    
  }, [billingListRefresh, dispatch]);
  return <div></div>;
}

export default GlobalCalls;
