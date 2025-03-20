/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Header from "../../CommonComponents/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import SkeletonFormLoader from "../../Loader/SkeletonFormLoader";

const CallCenterSettings = () => {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(useLocation().search);
  const id = queryParams.get("id");
  const account = useSelector((state) => state.account);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const userData = await generalGetFunction(`/call-center-queue/${id}`);
        setLoading(false);
        if (userData?.status) {
          const data = userData.data;
          setValue("greeting", data.greeting);
          setValue("strategy", data.strategy);
          setValue(
            "recording_enabled",
            data.recording_enabled === 1 ? true : false
          );
          setValue("time_base_score", data.time_base_score);
          setValue("tier_rules_apply", data.tier_rules_apply);
          setValue(
            "tier_rule_wait_multiply_level",
            data.tier_rule_wait_multiply_level
          );
          setValue("extension", data.extension);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data.");
      }
    }

    getData();
  }, []);

  const handleFormSubmit = handleSubmit(async (data) => {
    const payload = {
      greeting: data.greeting,
      strategy: data.strategy,
      recording_enabled: data.recording_enabled === "true" ? 1 : 0,
      time_base_score: data.time_base_score,
      tier_rules_apply: data.tier_rules_apply,
      tier_rule_wait_multiply_level: data.tier_rule_wait_multiply_level,
      account_id: account.account_id,
      created_by: account.id,
      extension: data.extension,
    };

    setLoading(true);
    const apiData = await generalPutFunction(
      `/call-center-queue/update/${id}`,
      payload
    );

    if (apiData.status) {
      setLoading(false);
      toast.success(apiData.message);
      navigate(-1);
    } else {
      setLoading(false);
      // toast.error(apiData.message);
    }
  });

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="Call Center Settings" />
          {/* <div id="subPageHeader">
            <div className="col-xl-9 my-auto"></div>
            <div className="col-xl-3 ps-2">
              <div className="d-flex justify-content-end">
                <button className="panelButton" onClick={() => navigate(-1)}>
                  <span className="text">Back</span>
                  <span className="icon"><i className="fa-solid fa-caret-left"></i></span>
                </button>
                <button
                  type="button"
                  className="panelButton"
                  onClick={handleFormSubmit}
                >
                  <span className="text">Save</span>
                  <span className="icon"><i className="fa-solid fa-floppy-disk"></i></span>
                </button>
              </div>
            </div>
          </div> */}
        </div>
        <div className="col-xl-12">
          {loading && <SkeletonFormLoader />}
          <div className="overviewTableWrapper">
            <div className="overviewTableChild">
              <div className="d-flex flex-wrap">
                <div className="col-12">
                  <div className="heading">
                    <div className="content">
                      <h4>Call Center Settings</h4>
                    </div>
                    <div className="buttonGroup">
                      <button
                        onClick={() => {
                          navigate(-1);
                        }}
                        type="button"
                        effect="ripple"
                        className="panelButton gray"
                      >
                        <span className="text">Back</span>
                        <span className="icon"><i className="fa-solid fa-caret-left"></i></span>
                      </button>
                      <button
                        effect="ripple"
                        className="panelButton"
                        onClick={handleFormSubmit}
                      >
                        <span className="text">Save</span>
                        <span className="icon"><i className="fa-solid fa-floppy-disk"></i></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12" style={{ padding: '25px 23px', borderBottom: '1px solid #ddd' }}>
                <form>
                  {/* <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label className="text-dark">Greeting</label>
                  <label className="formItemDesc">
                    Select the desired Greeting.
                  </label>
                </div>
                <div className="col-6">
                  <select
                    {...register("greeting")}
                    className="formItem me-0"
                    style={{ width: "100%" }}
                  >
                    <option value="say">Say</option>
                    <option value="tone_stream">Tone Stream</option>
                  </select>
                </div>
              </div> */}
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label className="text-dark">Strategy</label>
                      <label className="formItemDesc">
                        Select the queue ring strategy.
                      </label>
                    </div>
                    <div className="col-6">
                      <select
                        {...register("strategy")}
                        className="formItem me-0"
                        style={{ width: "100%" }}
                      >
                        <option value="ring-all">Ring All</option>
                        <option value="longest-idle-agent">
                          Longest Idle Agent
                        </option>
                        <option value="round-robin">Round Robin</option>
                        <option value="top-down">Top Down</option>
                        <option value="agent-with-least-talk-time">
                          Agent with least talk time
                        </option>
                        <option value="agent-with-fewest-calls">
                          Agent with fewest calls
                        </option>
                        <option value="sequentially-by-aget-order">
                          Sequentially by agent order
                        </option>
                        <option value="ring-progressively">
                          Ring Progressively
                        </option>
                        <option value="random">Random</option>
                      </select>
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label className="text-dark">Record</label>
                      <label className="formItemDesc">Save the recording.</label>
                    </div>
                    <div className="col-6">
                      <select
                        {...register("recording_enabled")}
                        className="formItem me-0"
                        style={{ width: "100%" }}
                      >
                        <option value={true}>True</option>
                        <option value={false}>False</option>
                      </select>
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label className="text-dark">Time Base Score</label>
                    </div>
                    <div className="col-6">
                      <select
                        {...register("time_base_score")}
                        className="formItem me-0"
                        style={{ width: "100%" }}
                      >
                        <option value="queue">Queue</option>
                        <option value="system">System</option>
                      </select>
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label className="text-dark">Tier Rules Apply</label>
                    </div>
                    <div className="col-6">
                      <select
                        {...register("tier_rules_apply")}
                        className="formItem me-0"
                        style={{ width: "100%" }}
                      >
                        <option value={1}>True</option>
                        <option value={0}>False</option>
                      </select>
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label className="text-dark">
                        Tier Rule Wait Multiply Level
                      </label>
                    </div>
                    <div className="col-6">
                      <select
                        {...register("tier_rule_wait_multiply_level")}
                        className="formItem me-0"
                        style={{ width: "100%" }}
                      >
                        <option value={1}>True</option>
                        <option value={0}>False</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CallCenterSettings;
