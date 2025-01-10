import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useForm } from "react-hook-form";
import {
  lengthValidator,
  numberValidator,
  requiredValidator,
  restrictToNumbers,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import CircularLoader from "../../Loader/CircularLoader";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const DidListingAdd = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //   const [loading, setLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [vendorData, setVendorData] = useState([]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const vendorDetails = await generalGetFunction("/did/vendors");
      if (vendorDetails?.status) {
        setLoading(false);
        setVendorData(vendorDetails.data);
      } else {
        setLoading(false);
      }
    }
    getData();
  }, []);
  const handleFormSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const payload = { ...data, did_vendor_id: Number(data.did_vendor_id) };

    const apiData = await generalPostFunction("/did/store", payload);
    if (apiData?.status) {
      setLoading(false);
      toast.success(apiData.message);
      if (data.usages === "pbx") {
        dispatch({
          type: "SET_NEWADDDID",
          newAddDid: apiData.data,
        });                        
        navigate("/did-listing");
      } else {
        navigate(-1);
      }
    } else {
      setLoading(false);
    }
  });

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid px-0">
            <Header title="Number Configuration" />
            {/* <div id="subPageHeader">
              <div className="col-xl-9 my-auto">
                <p className="p-0 m-0">Add a new DID to your account</p>
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
                    <span className="text">Back</span>
                    <span className="icon"><i class="fa-solid fa-caret-left"></i></span>
                  </button>
                  <button
                    effect="ripple"
                    className="panelButton"
                    onClick={handleFormSubmit}
                  >
                    <span className="text">Save</span>
                    <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                  </button>
                </div>
              </div>
            </div> */}
          </div>

          <div className="col-xl-12" style={{ overflow: "auto" }}>
            {loading ? (
              <div colSpan={99}>
                <CircularLoader />
              </div>
            ) : (
              ""
            )}

            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>DID Add</h4>
                        <p>Add a new DID to your account.</p>
                      </div>
                      <div className="buttonGroup">
                        <button
                          onClick={() => {
                            navigate(-1);
                            backToTop();
                          }}
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
                          effect="ripple"
                          className="panelButton"
                          onClick={handleFormSubmit}
                        >
                          <span className="text">Save</span>
                          <span className="icon">
                            <i class="fa-solid fa-floppy-disk"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-12" style={{ padding: "25px 23px" }}>
                    <form>
                      <div className="formRow col-xl-3">
                        <div className="formLabel">
                          <label className="text-dark">
                            Add DID <span className="text-danger">*</span>
                          </label>
                          <label htmlFor="data" className="formItemDesc">
                            Add new DID.
                          </label>
                        </div>
                        <div className="col-6">
                          <input
                            type="text"
                            name="did"
                            className="formItem"
                            minLength="8"
                            maxLength="14"
                            {...register("did", {
                              ...requiredValidator,
                              ...numberValidator,
                              ...lengthValidator(8, 14),
                            })}
                            onKeyDown={restrictToNumbers}
                          />
                          {errors.did && (
                            <ErrorMessage text={errors.did.message} />
                          )}
                        </div>
                      </div>
                      <div className="formRow col-xl-3">
                        <div className="formLabel">
                          <label className="text-dark">
                            DID vendor <span className="text-danger">*</span>
                          </label>
                          <label htmlFor="data" className="formItemDesc">
                            Choose DID vendor.
                          </label>
                        </div>
                        <div className="col-6">
                          <select
                            value={watch().did_vendor_id}
                            className="formItem"
                            name="did_vendor_id"
                            id="selectFormRow"
                            {...register("did_vendor_id", {
                              ...requiredValidator,
                              ...numberValidator,
                            })}
                          >
                            <option disabled value={""}>
                              Chose a vendor
                            </option>
                            {vendorData &&
                              vendorData.map((item) => {
                                return (
                                  <option key={item.id} value={item.id}>
                                    {item.vendor_name}
                                  </option>
                                );
                              })}
                          </select>
                          {errors.did_vendor_id && (
                            <ErrorMessage text={errors.did_vendor_id.message} />
                          )}
                        </div>
                      </div>
                      <div className="formRow col-xl-3">
                        <div className="formLabel">
                          <label className="text-dark">
                            Usage <span className="text-danger">*</span>
                          </label>
                          <label htmlFor="data" className="formItemDesc">
                            Choose Usage for this DID.
                          </label>
                        </div>
                        <div className="col-6">
                          <select
                            value={watch().usages}
                            className="formItem"
                            name="did_vendor_id"
                            id="selectFormRow"
                            defaultValue={""}
                            {...register("usages")}
                          >
                            <option value="">None</option>
                            <option value="pbx">PBX</option>
                            <option value="dialer">Dialer</option>
                          </select>
                          {errors.usages && (
                            <ErrorMessage text={errors.usages.message} />
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default DidListingAdd;
