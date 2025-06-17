import React from 'react'
import Header from '../../CommonComponents/Header';
import { Navigate } from 'react-router-dom';
import { backToTop } from '../../GlobalFunction/globalFunction';

function ExtensionStore() {
  return (
    <div className="allpackages0 row">
      {/* 10 Extensions Package */}
      <div className='col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-12 packages_card'>
        <div className="package">
          {/* <div className="badge0 ribbon">
                                                            <span>Popular</span>
                                                        </div> */}
          <div className="badge_ribbon">
            <span>Popular</span>
          </div>
          <h2>10 Extensions</h2>
          <p>Perfect for small teams</p>
          <div className='d-flex align-items-center justify-content-start'>
            <div className='total-discount'>
              <span>$30 / month</span>
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
      </div>

      {/* 20 Extensions Package */}

      <div className='col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-12 packages_card'>
        <div className="package">
          <h2>20 Extensions</h2>
          <p>Great for growing teams</p>
          <div className='d-flex align-items-center justify-content-start'>
            <div className='total-discount'>
              <span >$30 / month</span>
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
          <div className="storeBtnGroup">
            <button type='btn' className='btn btn-sm btn-primary mt-2 btns-hover-after'>Buy Now</button>
          </div>
        </div>
      </div>
      <div className='col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-12 packages_card'>
        {/* 30 Extensions Package */}
        <div className="package">
          <h2>30 Extensions</h2>
          <p>Ideal for large teams</p>
          <div className='d-flex align-items-center justify-content-start'>
            <div className='total-discount'>
              <span>$30 / month</span>
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
          <div className="storeBtnGroup">
            <button type='btn' className='btn btn-sm btn-primary  mt-2 btns-hover-after'>Buy Now</button>
          </div>
        </div>
      </div>
      <div className='col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-12 packages_card'>
        {/* Custom Package */}
        <div className="package">
          <h2>Custom</h2>
          <p>Tailored to your needs</p>
          <div className='d-flex align-items-center justify-content-start'>
            <div className='total-discount'>
              <span>$30 / month</span>
            </div>
            <div className='total-save ms-2'>
              <p className='m-0 p-0'>
                save 10%
              </p>
            </div>
          </div>
          <p className="price">Custom pricing</p>
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
          <div className='storeBtnGroup'>
            <button type='btn' className='btn btn-sm btn-primary btns-hover-after'>Contact Us</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExtensionStore