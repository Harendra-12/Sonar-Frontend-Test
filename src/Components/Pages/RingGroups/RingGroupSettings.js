import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from "../../Loader/CircularLoader";
import { useForm } from "react-hook-form";
import Header from "../../CommonComponents/Header";

const RingGroupSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const [loading, setLoading] = useState(true);
  const queryParams = new URLSearchParams(useLocation().search);
  const value = queryParams.get("id");
  const [successMessage, setSuccessMessage] = useState("");
  const [prevDestinations, setprevDestinations] = useState([]);
  const [ringBack, setRingBack] = useState();
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setSuccessMessage("");
    }
  }, [successMessage]);

  useEffect(() => {
    if (account && account.id) {
      setLoading(true);
      async function getData() {
        const ringData = await generalGetFunction(`/ringgroup/${value}`);
        const ringBack = await generalGetFunction("/sound/all?type=ringback");
        if (ringData.status) {
          console.log("data:", ringData.data);
          const {
            ring_group_destination,
            description,
            status,
            name,
            extension,
          } = ringData.data[0];
          setprevDestinations(ring_group_destination);

          const updatedEditData = {
            description: ringData.data[0].description || "",
            status: status === "active",
            strategy: ringData.data[0].strategy || "",
            ring_back: ringData.data[0].ring_back || "",
          };
          reset(updatedEditData);
          setValue("name", name || "");
          setValue("extension", extension || "");
          setLoading(false);
        } else {
          setLoading(false);
          navigate("/");
        }
        if (ringBack.status) {
          setRingBack(ringBack.data);
        } else {
          navigate("/");
        }
      }
      getData();
    } else {
      navigate("/");
    }
  }, [account, navigate, value]);

  const handleFormSubmit = handleSubmit(async (data) => {
    const updatedData = {
      // followme: data.followme,
      description: data.description,
      status: data.status ? "active" : "inactive",
      strategy: data.strategy,
      ring_back: data.ring_back,
      name: data.name,
      extension: data.extension,
    };

    setLoading(true);
    const apiData = await generalPutFunction(
      `/ringgroup/${value}`,
      updatedData
    );
    if (apiData.status) {
      setLoading(false);
      setSuccessMessage(apiData.message);
    } else {
      setLoading(false);
      const errorMessage = Object.keys(apiData.errors);
      toast.error(apiData.errors[errorMessage[0]][0]);
    }
  });

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid px-0">
            <Header title="Ring Group Edit" />
            <div className="row justify-content-center" id="subPageHeader">
              <div className="col-xl-9 my-auto">
                <p className="pt-2 mt-1 mb-0">
                  A ring group is a set of destinations that can be called with
                  a ring strategy.
                </p>
              </div>
              <div className="col-xl-3 ps-2">
                <div className="d-flex justify-content-end">
                  <button
                    onClick={() => navigate(-1)}
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
                    onClick={handleFormSubmit}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-12" style={{ overflow: "auto" }}>
            {loading && (
              <div colSpan={99}>
                <CircularLoader />
              </div>
            )}
            <div className="mx-2" style={{ width: "98%", margin: "0 auto" }}>
              <form onSubmit={handleFormSubmit} id="ringGroupForm">
                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-2">
                      <label className="text-dark" htmlFor="strategy">
                        Strategy
                      </label>
                    </div>
                    <div className="col-2 pe-2">
                      <select
                        className="formItem me-0"
                        style={{ width: "100%" }}
                        {...register("strategy")}
                        id="strategy"
                      >
                        <option value="enterprise">Enterprise</option>
                        <option value="sequence">Sequence</option>
                        <option value="simultaneously">Simultaneous</option>
                        <option value="random">Random</option>
                        <option value="rollover">Rollover</option>
                      </select>
                      <br />
                      <label htmlFor="strategy" className="formItemDesc">
                        Select the ring strategy.
                      </label>
                    </div>
                  </div>
                </div>
                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-2">
                      <label className="text-dark" htmlFor="ring_back">
                        Ring Back
                      </label>
                    </div>
                    <div className="col-2 pe-2">
                      <div className="formLabel">
                        <label htmlFor="ring_back">Status</label>
                      </div>
                      <select
                        className="formItem me-0"
                        style={{ width: "100%" }}
                        {...register("ring_back")}
                        id="ring_back"
                      >
                        <option value="null">None</option>
                        {/* <option value="us-ring">us-ring</option>
                        <option value="uk-ring">uk-ring</option>
                        <option value="eu-ring">eu-ring</option> */}
                        {ringBack &&
                          ringBack.map((ring) => {
                            return (
                              <option key={ring.id} value={ring.id}>
                                {ring.name}
                              </option>
                            );
                          })}
                      </select>
                      <br />
                      <label htmlFor="ring_back" className="formItemDesc">
                        Defines what the caller will hear while the destination
                        is being called.
                      </label>
                    </div>
                  </div>
                </div>
                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-2">
                      <label className="text-dark" htmlFor="description">
                        Description
                      </label>
                    </div>
                    <div className="col-2 pe-2">
                      <input
                        type="text"
                        name="extension"
                        className="formItem me-0"
                        style={{ width: "100%" }}
                        {...register("description")}
                        id="description"
                      />
                      <br />
                      <label htmlFor="description" className="formItemDesc">
                        Enter the description.
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default RingGroupSettings;
