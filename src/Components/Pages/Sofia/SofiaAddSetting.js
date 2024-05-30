import React, { useEffect, useState } from 'react'
import { backToTop, generalPostFunction } from '../../GlobalFunction/globalFunction'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function SofiaAddSetting() {
  const navigate = useNavigate()
  const account = useSelector((state) => state.account)
  if (account === null) {
    navigate("/")
  }
  const [sofia, setSofia] = useState({
    name: "",
    value: "",
    status: "true",
    desc: "",
    nameMissing: false,
    valueMissing: false,
  })
  async function handleSubmit() {
    if (sofia.name === "") {
      setSofia(prevState => ({
        ...prevState,
        nameMissing: true
      }))
    } else {
      setSofia(prevState => ({
        ...prevState,
        nameMissing: false
      }))
    }
    if (sofia.value === "") {
      setSofia(prevState => ({
        ...prevState,
        valueMissing: true
      }))
    } else {
      setSofia(prevState => ({
        ...prevState,
        valueMissing: false
      }))
    }
    if (sofia.name.length > 0 && sofia.value.length > 0) {
      const parsedData = {
        name: sofia.name,
        value: sofia.value,
        description: sofia.desc,
        enabled: sofia.status === "false" ? false : true,
        created_by: account.id
      }
      console.log("This is parsed data", parsedData);
      const apiData = await generalPostFunction("/sofia-global-settings/store", parsedData)
      if (apiData.status) {
        toast.success(apiData.message)
      } else {
        toast.error(apiData.message)
      }
    }
  }
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12" id="subPageHeader">
              <div className="row px-xl-3">
                <div className="col-xl-9 my-auto">
                  <h4 className="my-auto">Add new Sofia Setting</h4>
                </div>
                <div className="col-xl-3 ps-2">
                  <div className="d-flex justify-content-end">
                    <button
                      onClick={() => {
                        navigate(-1);
                        backToTop();
                      }}
                      type="button"
                      effect="ripple"
                      className="panelButton"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      effect="ripple"
                      className="panelButton"
                      onClick={() => handleSubmit()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-12" style={{ overflow: "auto" }}>
              <div className="mx-2" id="detailsContent">
                <form className="row">
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Name</label>
                      {sofia.nameMissing ? <label className="status missing">field missing</label> : ""}

                    </div>
                    <div className="col-12">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        required="required"
                        value={sofia.name}
                        onChange={(e) => {
                          setSofia(prevState => ({
                            ...prevState,
                            name: e.target.value
                          }))
                        }}
                      />
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Enter the global setting name.
                      </label>
                    </div>
                  </div>
                  {/* <div/> */}
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Value</label>
                      {sofia.valueMissing ? <label className="status missing">field missing</label> : ""}

                    </div>
                    <div className="col-12">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        required="required"
                        value={sofia.value}
                        onChange={(e) => {
                          setSofia(prevState => ({
                            ...prevState,
                            value: e.target.value
                          }))
                        }}
                      />
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Enter the global setting value.
                      </label>
                    </div>
                  </div>
                  {/* <div/> */}
                  <div className="formRow col-xl-2">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Enabled</label>
                    </div>
                    <div className="col-12">
                      <select
                        className="formItem"
                        id="selectFormRow"
                        value={sofia.status}
                        onChange={(e) => {
                          setSofia(prevState => ({
                            ...prevState,
                            status: e.target.value
                          }))
                        }}
                      >
                        <option value={true}>True</option>
                        <option value={false}>False</option>
                      </select>
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Enter the global setting enabled.
                      </label>
                    </div>
                  </div>
                  {/* <div/> */}
                  <div className="formRow col-xl-4">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Description</label>
                    </div>
                    <div className="col-12">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        required="required"
                        value={sofia.desc}
                        onChange={(e) => {
                          setSofia(prevState => ({
                            ...prevState,
                            desc: e.target.value
                          }))
                        }}
                      />
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Enter the global setting description.
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            </div>
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
  )
}

export default SofiaAddSetting
