import React from 'react'
import Header from '../../CommonComponents/Header';
import { Navigate } from 'react-router-dom';
import { backToTop } from '../../GlobalFunction/globalFunction';

function ExtensionStore() {
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="Extension " />
        </div>
        <div className="col-xl-12" style={{ overflow: "auto" }}>
          <div className="overviewTableWrapper">
            <div className="overviewTableChild">
              <div className="d-flex flex-wrap">
                <div className="col-12">
                  <div className="heading">
                    <div className="content">
                      <h4>Extension Package</h4>
                      <p>All extension package</p>
                    </div>
                    <div className="buttonGroup">
                      <button
                        onClick={() => { Navigate('-1'); backToTop() }}
                        type="button"
                        effect="ripple"
                        className="panelButton gray"
                      >
                        <span className="text">Back</span>
                        <span className="icon">
                          <i class="fa-solid fa-caret-left"></i>
                        </span>
                      </button>
                      <button
                        type="button"
                        effect="ripple"
                        className="panelButton"
                      >
                        <span className="text">Save</span>
                        <span className="icon">
                          <i class="fa-solid fa-floppy-disk"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 formScroller" style={{ padding: '25px 23px' }}>
                <div className="allpackages">
                  {/* 10 Extensions Package */}
                  <div className="package">
                    <div className="badge0 ribbon">
                      <span>Popular</span></div>
                    <h2>10 Extensions</h2>
                    <p>Perfect for small teams</p>
                    <div className='d-flex align-items-center justify-content-start'>
                      <div className='total-discount'>

                        <div>
                          <span className='discount-price'>$30/month</span>
                          <span className='discount'></span>
                        </div>

                      </div>
                      <div className='total-save ms-2'>
                        <p className='m-0 p-0'>
                          save 10%
                        </p>

                      </div>
                    </div>




                    <p className="price">$20 </p>



                    <div>
                      <p>
                        /user/month* <span>paid annually</span>
                      </p>
                    </div>

                    <ul>
                      <li>Unlimited domestic calling</li>
                      <li>Business SMS and MMS</li>
                      <li>Call menu (IVR)</li>
                      <li>HD video meetings (100 participants)</li>
                      <li>Google, Microsoft integrations</li>
                    </ul>

                    <div className="d-flex align-items-center justify-content-between ">
                      {/* <button type='btn' className='btn btn-sm btn-outline-primary '>try now </button> */}
                      <button type='btn' className='btn btn-sm btn-primary mt-2  btns-hover-after  '>Buy Now</button>
                      {/* <div className="try-add-btn2">Buy Now</div> */}
                    </div>
                  </div>
                  {/* 20 Extensions Package */}
                  <div className="package">
                    <h2>20 Extensions</h2>
                    <p>Great for growing teams</p>
                    <div className='d-flex align-items-center justify-content-start'>
                      <div className='total-discount'>

                        <div>
                          <span className='discount-price'>$30/month</span>
                          <span className='discount'></span>
                        </div>

                      </div>
                      <div className='total-save ms-2'>
                        <p className='m-0 p-0'>
                          save 10%
                        </p>

                      </div>
                    </div>
                    <p className="price">$40 </p>
                    <div>
                      <p>
                        /user/month* <span>paid annually</span>
                      </p>
                    </div>

                    <ul>
                      <li>Unlimited domestic calling</li>
                      <li>Business SMS and MMS</li>
                      <li>Call menu (IVR)</li>
                      <li>HD video meetings (200 participants)</li>
                      <li>Single sign-on</li>
                    </ul>
                    <div className="d-flex align-items-center justify-content-between ">
                      {/* <button type='btn' className='btn btn-sm btn-outline-primary '>try now </button> */}
                      <button type='btn' className='btn btn-sm btn-primary mt-2 btns-hover-after'>Buy Now</button>
                      {/* <div className="try-add-btn2">Buy Now</div> */}
                    </div>
                  </div>
                  {/* 30 Extensions Package */}
                  <div className="package">
                    <h2>30 Extensions</h2>
                    <p>Ideal for large teams</p>
                    <div className='d-flex align-items-center justify-content-start'>
                      <div className='total-discount'>

                        <div>
                          <span className='discount-price'>$30/month</span>
                          <span className='discount'></span>
                        </div>

                      </div>
                      <div className='total-save ms-2'>
                        <p className='m-0 p-0'>
                          save 10%
                        </p>

                      </div>
                    </div>
                    <p className="price">$60 </p>
                    <div>
                      <p>
                        /user/month* <span>paid annually</span>
                      </p>
                    </div>

                    <ul>
                      <li>Unlimited domestic calling</li>
                      <li>Business SMS and MMS</li>
                      <li>Call menu (IVR)</li>
                      <li>HD video meetings (500 participants)</li>
                      <li>Priority support</li>
                    </ul>
                    <div className="d-flex align-items-center justify-content-between ">
                      {/* <button type='btn' className='btn btn-sm btn-outline-primary '>try now </button> */}

                      <button type='btn' className='btn btn-sm btn-primary  mt-2 btns-hover-after'>Buy Now</button>
                      {/* <div className="try-add-btn2">Buy Now</div> */}
                    </div>
                  </div>
                  {/* Custom Package */}
                  <div className="package">
                    <h2>Custom</h2>
                    <p>Tailored to your needs</p>
                    <div className='d-flex align-items-center justify-content-start'>
                      <div className='total-discount'>

                        <div>
                          <span className='discount-price'>$30/month</span>
                          <span className='discount'></span>
                        </div>

                      </div>
                      <div className='total-save ms-2'>
                        <p className='m-0 p-0'>
                          save 10%
                        </p>

                      </div>
                    </div>
                    <p className="price">Contact Us</p>

                    <div>
                      <p>
                        /user/month* <span>paid annually</span>
                      </p>
                    </div>

                    <ul>
                      <li>All features included</li>
                      <li>Customizable integrations</li>
                      <li>Dedicated support</li>
                      <li>Unlimited scalability</li>
                      <li>API access</li>
                    </ul>
                    <div className="d-flex align-items-center justify-content-between ">
                      {/* <button type='btn' className='btn btn-sm btn-outline-primary '>try now </button> */}
                      <button type='btn' className='btn btn-sm btn-primary  btns-hover-after'>Buy Now</button>
                      {/* <div className="try-add-btn2">Buy Now</div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        {/* {popUp ? (
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
        <p>
          No Extension is currently asigned! Please add an
          extension first!
        </p>
        <button
          className="panelButton m-0"
          onClick={() => {
            // setForce(true);
            setPopUp(false);
            navigate("/extensions-add");
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
)} */}
      </section>

      {/* <ToastContainer
position="bottom-right"
autoClose={false}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
/> */}
    </main>
  )
}

export default ExtensionStore