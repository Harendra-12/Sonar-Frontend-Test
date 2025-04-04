import React from 'react'
import Header from '../../CommonComponents/Header';
import { backToTop, featureUnderdevelopment } from '../../GlobalFunction/globalFunction';
import { Navigate } from 'react-router-dom';
import ExtensionStore from './ExtensionStore';
import SocialMediaStore from './SocialMediaStore';


function AddOns() {
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid px-0">
                    <Header title="Store" />
                </div>
                <div className="col-xl-12" style={{ overflow: "auto" }}>
                    <div className="overviewTableWrapper">
                        <div className="overviewTableChild">
                            <div className="d-flex flex-wrap">
                                <div className="col-12">
                                    <div className="heading">
                                        <div className="content">
                                            <h4>Store</h4>
                                            <p>Select addons, plugins or upgrade your package here!</p>
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
                                                    <i className="fa-solid fa-caret-left"></i>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 formScroller" style={{ padding: '25px 23px' }}>
                                <>
                                    <nav className="tangoNavs">
                                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                            <button
                                                className="nav-link active px-2"
                                                id="nav-social-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#nav-social"
                                                type="button"
                                                role="tab"
                                                aria-controls="nav-social"
                                                aria-selected="true"
                                            >
                                                Social Media Integration
                                            </button>
                                            <button
                                                className="nav-link px-2"
                                                id="nav-exten-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#nav-exten"
                                                type="button"
                                                role="tab"
                                                aria-controls="nav-exten"
                                                aria-selected="false"
                                            >
                                                Extensions
                                            </button>
                                            <button
                                                className="nav-link px-2"
                                                // id="nav-package-tab"
                                                // data-bs-toggle="tab"
                                                data-bs-target="#nav-package"
                                                type="button"
                                                role="tab"
                                                aria-controls="nav-package"
                                                aria-selected="true"
                                                onClick={() => featureUnderdevelopment()}
                                            >
                                                Packages
                                            </button>
                                            <button
                                                className="nav-link px-2"
                                                id="nav-provision-tab"
                                                // data-bs-toggle="tab"
                                                // data-bs-target="#nav-util"
                                                type="button"
                                                role="tab"
                                                aria-controls="nav-util"
                                                aria-selected="false"
                                                onClick={() => featureUnderdevelopment()}
                                            >
                                                Utilities
                                            </button>
                                        </div>
                                    </nav>
                                    <div className="tab-content mt-4" id="nav-tabContent">
                                        <div
                                            className="tab-pane fade show active"
                                            id="nav-social"
                                            role="tabpanel"
                                            aria-labelledby="nav-social-tab"
                                            tabindex="0"
                                        >
                                            <SocialMediaStore />
                                        </div>
                                        <div
                                            className="tab-pane fade"
                                            id="nav-exten"
                                            role="tabpanel"
                                            aria-labelledby="nav-exten-tab"
                                            tabindex="0"
                                        >
                                            <ExtensionStore />
                                        </div>
                                        <div
                                            className="tab-pane fade"
                                            id="nav-util"
                                            role="tabpanel"
                                            aria-labelledby="nav-util-tab"
                                            tabindex="0"
                                        >

                                        </div>
                                    </div>

                                    <div
                                        className="offcanvas offcanvas-end offcanvas-custom"
                                        tabIndex={-1}
                                        id="offcanvasRight"
                                        aria-labelledby="offcanvasRightLabel"
                                    >
                                        <div className="offcanvas-header">
                                            <h5 className="offcanvas-title text-white fs-4" id="offcanvasRightLabel">
                                                Click to call
                                            </h5>
                                            <button
                                                type="button"
                                                className="btn-close offcanvas_close"
                                                data-bs-dismiss="offcanvas"
                                                aria-label="Close" />
                                        </div>
                                        <div className="offcanvas-body">
                                            <div className="offcanvas-sider">
                                                <div>
                                                    <img
                                                        src="https://www.ringcentral.com/content/dam/rc-www/en_us/images/content/office/voip-phone/devices/Unify_CP700-png-rendition.webp"
                                                        alt="" />
                                                </div>
                                            </div>
                                            <div className="paragrap">
                                                <div className="offcanvas-text-side">
                                                    <div className='d-flex align-items-center justify-content-between'>
                                                        <div>
                                                            <p className=' m-0 p-0 fs-5  fw-semibold'> Click to Call <span className="text-font-small"> (Poly CCX 700)</span></p>
                                                            <div className="test-number m-0 p-0">
                                                                <p className="">$50.00 <span>$29/month</span></p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <button
                                                                effect="ripple"
                                                                className="panelButton" >
                                                                <span className="text fs-6">Buy</span>
                                                                <span className="icon">
                                                                    <i className="fa-solid fa-cart-shopping"></i>
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="para-hading">
                                                    <h4 className='mb-3 '>
                                                        Description
                                                    </h4>
                                                    <p>
                                                        The Unify CP700 brings expanded interoperability, the power of
                                                        simplicity, as well as the high-quality audio you expect.
                                                    </p>
                                                </div>
                                                <div className="canvas_list">
                                                    <ul>
                                                        <li> Color graphical display, 6 line TFT (800*480 pixel), 5’’</li>
                                                        <li>
                                                            Notification LED (green, amber, red), visible from front and
                                                            behind
                                                        </li>
                                                        <li>
                                                            6 permanent free programmable and 6 free programmable favorites
                                                            with LED
                                                        </li>
                                                        <li>5-way navigation key</li>
                                                        <li>
                                                            7 fixed function keys: menu, presence, voicemail, hold, transfer,
                                                            conference, and redial
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </>
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

export default AddOns