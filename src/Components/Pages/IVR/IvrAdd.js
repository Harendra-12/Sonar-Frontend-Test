import React from 'react'
import Header from '../../CommonComponents/Header';
import { backToTop } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';

function IvrAdd() {
  const navigate = useNavigate();
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="IVR Add" />
          <div id="subPageHeader">
            <div className="col-xl-9 my-auto">
              <p className="mb-0">Add an IVR</p>
            </div>
            <div className="col-xl-3 ps-2">
              <div className="d-flex justify-content-end">
                <button
                  effect="ripple"
                  className="panelButton"
                  onClick={() => {
                    navigate(-1);
                    backToTop();
                  }}
                >
                  Back
                </button>
                <button
                  effect="ripple"
                  className="panelButton"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-12" style={{ overflow: "auto" }}>
          <div className="mx-2" id="detailsContent">
            <form action="#" className="row">
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Name</label>
                  {/* <label htmlFor="mail_driver" className="formItemDesc">
                    Select Mail Driver Type
                  </label> */}
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="mail_host"
                    className="formItem"
                  />
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Type</label>
                  <label htmlFor="mail_host" className="formItemDesc">
                    Select the type of IVR
                  </label>
                </div>
                <div className="col-6">
                  <select className="formItem">
                    <option value="">Select</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                  </select>
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Greet Sound (Long)</label>
                  <label htmlFor="mail_host" className="formItemDesc">
                    Upload a long greet sound.
                  </label>
                </div>
                <div className="col-6">
                  <input name="reg" class="formItem" type="file" accept="audio/*"></input>
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Greet Sound (Short)</label>
                  <label htmlFor="mail_host" className="formItemDesc">
                    Upload a short greet sound.
                  </label>
                </div>
                <div className="col-6">
                  <input name="reg" class="formItem" type="file" accept="audio/*"></input>
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Invalid Sound</label>
                  <label htmlFor="mail_host" className="formItemDesc">
                    Upload an invalid sound.
                  </label>
                </div>
                <div className="col-6">
                  <input name="reg" class="formItem" type="file" accept="audio/*"></input>
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Exit Sound</label>
                  <label htmlFor="mail_host" className="formItemDesc">
                    Upload an exit sound.
                  </label>
                </div>
                <div className="col-6">
                  <input name="reg" class="formItem" type="file" accept="audio/*"></input>
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Confirm Macro</label>
                  {/* <label htmlFor="mail_port" className="formItemDesc">
                    Enter Mail Port
                  </label> */}
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="mail_host"
                    className="formItem"
                  />
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Confirm Key</label>
                  {/* <label htmlFor="mail_port" className="formItemDesc">
                    Enter Mail Port
                  </label> */}
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="mail_host"
                    className="formItem"
                  />
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">TTS Engine</label>
                  {/* <label htmlFor="mail_port" className="formItemDesc">
                    Enter Mail Port
                  </label> */}
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="mail_host"
                    className="formItem"
                  />
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">TTS Voice</label>
                  {/* <label htmlFor="mail_port" className="formItemDesc">
                    Enter Mail Port
                  </label> */}
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="mail_host"
                    className="formItem"
                  />
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Confirm Attempts</label>
                  <label htmlFor="mail_port" className="formItemDesc">
                    Enter number of confirm attempts
                  </label>
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    name="mail_host"
                    className="formItem"
                  />
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Timeout</label>
                  <label htmlFor="mail_port" className="formItemDesc">
                    Enter timeout in miliseconds
                  </label>
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    name="mail_host"
                    className="formItem"
                  />
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Max Failure</label>
                  <label htmlFor="mail_port" className="formItemDesc">
                    Enter max failure
                  </label>
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    name="mail_host"
                    className="formItem"
                  />
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Max Timeout</label>
                  <label htmlFor="mail_port" className="formItemDesc">
                    Enter max timeout in miliseconds
                  </label>
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    name="mail_host"
                    className="formItem"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

export default IvrAdd
