import React from "react";
import Header from "../../CommonComponents/Header";
import { useNavigate } from "react-router-dom";
import { backToTop } from "../../GlobalFunction/globalFunction";

const Variable = () => {
  const navigate = useNavigate();
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid px-0">
            <Header title="Variable" />
            <div id="subPageHeader">
              <div className="col-xl-9">
                <p>
                  Inbound variable
                </p>
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
        </section>
      </main>
    </>
  );
};

export default Variable;
