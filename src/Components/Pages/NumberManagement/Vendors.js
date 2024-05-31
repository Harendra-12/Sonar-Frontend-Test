import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { backToTop, generalGetFunction, generalPutFunction } from "../../GlobalFunction/globalFunction";
import ContentLoader from "../Misc/ContentLoader";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Vendors() {
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState();
  const [changeState, setChnageState] = useState(0)
  const [popup,setPopup] =useState(false)
  const [activeVendor,setActiveVendor]=useState()
  const [newVendor,setNewVendor]=useState()
  const navigate = useNavigate();
  // Getting packes value from inital state
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/did/vendors`);
      if (apiData.status) {
        setActiveVendor(apiData.data.filter((item)=>item.status === "active"))
        setLoading(false);
        setVendor(apiData.data);
      }
    }
    getData();
  }, [changeState]);

  console.log("This is active vendor",activeVendor);
  //   Status change
  async function handleStatusChange(id, status) {
    setLoading(true)
    const parsedData = {
      status: "active"
    }
    const apiData = await generalPutFunction(`/did/vendor/update/${id}`, parsedData)
    if (apiData.status) {
      setChnageState(changeState + 1)
      setLoading(false)
      toast.success(apiData.message)
    } else {
      setLoading(false)
      toast.error(apiData.message)
    }
  }
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Available Vendors" />
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
                    <p

                      onClick={() => { backToTop(); navigate(-1) }}
                      effect="ripple"
                      className="panelButton"
                    >
                      Back
                    </p>
                    <Link
                      to="/add-vendor"
                      onClick={backToTop}
                      effect="ripple"
                      className="panelButton"
                    >
                      Add
                    </Link>
                  </div>
                  <div className="col-xl-8 mt-3 mt-xl-0">
                    <div className="d-flex justify-content-end flex-wrap gap-2"></div>
                  </div>
                </div>
              </div>
              <div className="col-12" style={{ overflow: "auto" }}>
                <div className="mx-2 tableContainer">
                  <table>
                    <thead>
                      <tr>
                        <th>Vendor Name</th>
                        <th>Vendor Username</th>
                        <th>Token</th>
                        <th>Status</th>
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
                        <>
                          {vendor &&
                            vendor.map((item, index) => {
                              return (
                                <tr
                                  key={index}
                                >
                                  <td onClick={() =>
                                    navigate(`/edit-vendor`, { state: item })
                                  } >{item.vendor_name}</td>
                                  <td onClick={() =>
                                    navigate(`/edit-vendor`, { state: item })
                                  } >{item.username}</td>
                                  <td onClick={() =>
                                    navigate(`/edit-vendor`, { state: item })
                                  } >{item.token}</td>
                                  <td onClick={() =>{setPopup(true);setNewVendor(item)}}>
                                    <label className={item.status === 'active' ? "tableLabel success" : "tableLabel fail"}>{item.status}</label>
                                  </td>
                                </tr>
                              );
                            })}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {popup? <div className='popup'>
            <div className='container h-100'>
                <div className='row h-100 justify-content-center align-items-center'>
                    <div className='row content col-xl-4'>
                        <div className='col-2 px-0'>
                            <div className='iconWrapper'>
                                <i className="fa-duotone fa-triangle-exclamation"></i>
                            </div>
                        </div>
                        <div className='col-10 ps-0'>
                            <h4>Warning!</h4>
                            <p>Are you sure you want to active {newVendor.vendor_name} vendor previously active vendor was {activeVendor?.[0]?.vendor_name}?</p>
                            <button className='panelButton m-0' onClick={()=>{setPopup(false);handleStatusChange(newVendor.id,"active")}}>Confirm</button>
                            <button className='panelButtonWhite m-0 float-end' onClick={()=>setPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>:""}
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
    </>
  );
}

export default Vendors;
