import React from "react";

const WelcomeMessage = ({
  beginMessage,
  generalPrompt,
  setBeginMessage,
  setGeneralPrompt,
}) => {
  return (
    <>
      <div>
        <div className="formRow flex-column align-items-start px-0 ">
          <div className="formLabel">
            <label>Welcome Message</label>
          </div>
          <div className="col-12">
            <textarea
              type="text"
              className="formItem h-auto"
              rows={3}
              placeholder="Type the message that will be sent to the user when the agent is started."
              value={beginMessage}
              onChange={(e) => setBeginMessage(e.target.value)}
            />
          </div>
        </div>
        <div className="formRow flex-column align-items-start px-0 ">
          <div className="formLabel">
            <label>General prompt</label>
          </div>
          <div className="col-12">
            <textarea
              type="text"
              className="formItem"
              rows={12}
              style={{ minHeight: "400px" }}
              placeholder="Type the message that will be sent to the user when the agent is started."
              value={generalPrompt}
              onChange={(e) => setGeneralPrompt(e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomeMessage;
