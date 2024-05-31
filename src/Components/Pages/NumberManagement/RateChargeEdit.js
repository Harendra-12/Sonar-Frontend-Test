import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generalGetFunction, generalPutFunction } from '../../GlobalFunction/globalFunction';
import CircularLoader from '../Misc/CircularLoader';

function RateChargeEdit() {
    const location = useLocation()
    const locationState = location.state
    const navigate = useNavigate()
    const [selectedVendor,setSelectedVendor]=useState("")
    const [rateType,setRateType]=useState("random")
    const [rate,setRate]=useState("")
    const [vendor,setVendor]=useState()
    const [loading,setLoading]=useState(false)
    useEffect(()=>{
        if(locationState===null || locationState===undefined){
            navigate(-1)
        }else{
      async function getVendor(){
        const apiData = await generalGetFunction("/did/vendors")
        if(apiData.status){
          setVendor(apiData.data)
        }
      }
      setSelectedVendor(locationState.vendor_id)
      setRateType(locationState.rate_type)
      setRate(locationState.rate)
      getVendor()
    }
    },[locationState, navigate])

    async function handleSubmit(){
      if(selectedVendor===""){
        toast.error("Please select a vendor")
      }else if(rate===""){
        toast.error("Please enter rate")
      }else{
        setLoading(true)
        const parsedData = {
          vendor_id:selectedVendor,
          rate_type:rateType,
          rate:rate
        }
        const apidata = await generalPutFunction(`/did/rate/update/${locationState.id}`,parsedData)
        if(apidata.status){
          setLoading(false)
          toast.success(apidata.message)
        }else{
          setLoading(false)
          toast.error(apidata.message)
        }
      }
     
    }


  return (
    <>
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12" id="subPageHeader">
              <div className="row px-xl-3">
                <div className="col-xl-9 my-auto">
                  <h4 className="my-auto">Edit Rate Card</h4>
                  <p className="pt-2 mt-1 mb-0"></p>
                </div>
                <div className="col-xl-3 ps-2">
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      effect="ripple"
                      className="panelButton"
                      onClick={() => navigate(-1)}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      effect="ripple"
                      className="panelButton"
                      onClick={handleSubmit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-2" id="detailsContent">
              <div className="row">
              <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-5">
                      <div>
                        <label className="text-dark">Vendor</label>
                        {/* <label className="status missing">
                            Field Missing
                          </label> */}
                        {/* {packages.nameMissing ? (
                          <label className="status missing">
                            Field Missing
                          </label>
                        ) : (
                          ""
                        )} */}
                      </div>
                      <div>
                        <label
                          htmlFor="data"
                          className="formItemDesc"
                          style={{
                            fontSize: 12,
                            lineHeight: "18px",
                            marginTop: 5,
                          }}
                        >
                         Select Vendor for rate chart
                        </label>
                      </div>
                    </div>
                    <div className="col-3 pe-2">
                      <div className="formLabel"></div>
                      <div className="col-12">
                        <select
                          className="formItem"
                          value={selectedVendor}
                          onChange={(e) =>
                            setSelectedVendor(e.target.value)
                          }
                        >
                          <option value="">Select Vendor</option>
                          {vendor && vendor.map((item)=>{
                            return(
                              <option value={item.id}>{item.vendor_name}</option>
                            )
                          
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-5">
                      <div>
                        <label className="text-dark">Rate Type</label>
                      </div>
                      <div>
                        <label
                          htmlFor="data"
                          className="formItemDesc"
                          style={{
                            fontSize: 12,
                            lineHeight: "18px",
                            marginTop: 5,
                          }}
                        >
                         Rate Type
                        </label>
                      </div>
                    </div>
                    <div className="col-3 pe-2">
                      <div className="formLabel"></div>
                      <div className="col-12">
                        <select
                          className="formItem"
                          value={rateType}
                          onChange={(e)=>{
                            setRateType(e.target.value)
                          }}
                        >
                          <option value="random">Random</option>
                          <option value="blocks">Blocks</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-5">
                      <div>
                        <label className="text-dark">Price</label>
                      </div>
                      <div>
                        <label
                          htmlFor="data"
                          className="formItemDesc"
                          style={{
                            fontSize: 12,
                            lineHeight: "18px",
                            marginTop: 5,
                          }}
                        >
                          Number of users offer in this package.
                        </label>
                      </div>
                    </div>
                    <div className="col-3 pe-2">
                      <div className="formLabel">
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          value={rate}
                          onChange={(e) =>
                            setRate(e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {loading ? <CircularLoader /> : ""}
          </div>
        </div>
      </section>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </main>
  </>
  )
}

export default RateChargeEdit
