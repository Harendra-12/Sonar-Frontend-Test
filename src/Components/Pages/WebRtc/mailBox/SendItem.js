import React from "react";

const SendItem = () => {
  const data = [
    {
      id: "12345",
      from: "sender@example.com",
      to: "your-email@gmail.com",
      subject: "Meeting Reminder",
      date: "Wed, 11 Jun 2025 10:30:00 +0000",
      body: "Hello, just a reminder about our meeting at 3 PM today.",
      attachments: [
        {
          filename: "agenda.pdf",
          size: "245KB",
          mime_type: "application/pdf",
        },
      ],
    },
    {
      id: "12346",
      from: "another.sender@example.com",
      to: "your-email@gmail.com",
      subject: "Project Update",
      date: "Wed, 11 Jun 2025 12:00:00 +0000",
      body: "Here is the latest update on the project.",
      attachments: [],
    },
  ];

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <div className="overviewTableWrapper p-0">
        <div
          className="tableContainer e mail_table mt-0 w-100 border-0 mb-0"
          style={{ height: "calc(100vh - 204px)", overflow: "auto" }}
        >
          <table>
            <thead>
              <tr>
                <th></th>
                <th>From</th>
                <th>Subject</th>
                <th> Received </th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      {" "}
                      <input type="checkbox" />
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="tableProfilePicHolder">
                          <img
                            alt="profile"
                            src={require("../../../assets/images/placeholder-image.webp")}
                          />
                        </div>
                        <div className="ms-2">{item?.from.split("@")[0]}</div>
                      </div>
                    </td>
                    <td>
                      <p className="ellipsisText300 mb-0">
                        <strong>
                          {item?.subject.length > 20
                            ? item?.subject.slice(0, 20) + "..."
                            : item?.subject}
                        </strong>
                        <span className="text_muted">
                          {" "}
                          {item?.body.length > 50
                            ? item?.body.slice(0, 50) + "..."
                            : item?.body}
                        </span>
                      </p>
                    </td>
                    <td>
                      <p className="mb-0 fw-semibold">
                        {formatTime(item?.date)}
                      </p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SendItem;
