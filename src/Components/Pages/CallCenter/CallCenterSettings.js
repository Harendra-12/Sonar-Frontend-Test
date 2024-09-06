import React, { useState, useEffect } from "react";
import Header from "../../CommonComponents/Header";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from "../../Loader/CircularLoader";
import { useForm } from "react-hook-form";

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

        console.log("API Response:", userData);

        if (userData.status) {
          const data = userData.data;
          setValue("greeting", data.greeting);
          setValue("strategy", data.strategy);
          setValue(
            "record_template",
            data.record_template === 1 ? true : false
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
      record_template: data.record_template === "true" ? 1 : 0,
      time_base_score: data.time_base_score,
      tier_rules_apply: data.tier_rules_apply,
      tier_rule_wait_multiply_level: data.tier_rule_wait_multiply_level,
      account_id: account.account_id,
      created_by: account.id,
      extension: data.extension,
    };

    console.log("Payload:", payload);

    setLoading(true);
    const apiData = await generalPutFunction(
      `/call-center-queue/update/${id}`,
      payload
    );
    setLoading(false);

    if (apiData.status) {
      toast.success(apiData.message);
    } else {
      toast.error(apiData.message);
    }
  });

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="Call Center Settings" />
          <div id="subPageHeader">
            <div className="col-xl-9 my-auto"></div>
            <div className="col-xl-3 ps-2">
              <div className="d-flex justify-content-end">
                <button className="panelButton" onClick={() => navigate(-1)}>
                  Back
                </button>
                <button
                  type="button"
                  className="panelButton"
                  onClick={handleFormSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-12">
          {loading && <CircularLoader />}
          <div className="mx-2" id="detailsContent">
            <form className="row">
              <div className="formRow col-xl-12 px-xl-4">
                <div className="col-12 d-flex justify-content-start">
                  <div className="formLabel pe-2 col-2">
                    <label className="text-dark">Greeting</label>
                  </div>
                  <div className="col-2 pe-2">
                    <select
                      {...register("greeting")}
                      className="formItem me-0"
                      style={{ width: "100%" }}
                    >
                      <option value="say">Say</option>
                      <option value="tone_stream">Tone Stream</option>
                    </select>
                    <label className="formItemDesc">
                      Select the desired Greeting.
                    </label>
                  </div>
                </div>
              </div>
              <div className="formRow col-xl-12 px-xl-4">
                <div className="col-12 d-flex justify-content-start">
                  <div className="formLabel pe-2 col-2">
                    <label className="text-dark">Strategy</label>
                  </div>
                  <div className="col-2 pe-2">
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
                    <label className="formItemDesc">
                      Select the queue ring strategy.
                    </label>
                  </div>
                </div>
              </div>
              <div className="formRow col-xl-12 px-xl-4">
                <div className="col-12 d-flex justify-content-start">
                  <div className="formLabel pe-2 col-2">
                    <label className="text-dark">Record</label>
                  </div>
                  <div className="col-2 pe-2">
                    <select
                      {...register("record_template")}
                      className="formItem me-0"
                      style={{ width: "100%" }}
                    >
                      <option value={true}>True</option>
                      <option value={false}>False</option>
                    </select>
                    <label className="formItemDesc">Save the recording.</label>
                  </div>
                </div>
              </div>
              <div className="formRow col-xl-12 px-xl-4">
                <div className="col-12 d-flex justify-content-start">
                  <div className="formLabel pe-2 col-2">
                    <label className="text-dark">Time Base Score</label>
                  </div>
                  <div className="col-2 pe-2">
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
              </div>
              <div className="formRow col-xl-12 px-xl-4">
                <div className="col-12 d-flex justify-content-start">
                  <div className="formLabel pe-2 col-2">
                    <label className="text-dark">Tier Rules Apply</label>
                  </div>
                  <div className="col-2 pe-2">
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
              </div>
              <div className="formRow col-xl-12 px-xl-4">
                <div className="col-12 d-flex justify-content-start">
                  <div className="formLabel pe-2 col-2">
                    <label className="text-dark">
                      Tier Rule Wait Multiply Level
                    </label>
                  </div>
                  <div className="col-2 pe-2">
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
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CallCenterSettings;
