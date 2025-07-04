import React from "react";
import { Pagination } from "@mui/material";

function PaginationComponent({
  pageNumber,
  totalPage,
  from,
  to,
  total,
  defaultPage,
}) {
  return (
    <>
      <label
        className="col-6"
        style={{
          fontFamily: "Roboto",
          color: "var(--color-subtext)",
          fontWeight: 500,
          fontSize: 12,
        }}
      >
        Showing {from} to {to} of {total} Entries.
      </label>
      <Pagination
        className="pagination_slider col-6 justify-content-end"
        count={totalPage}
        color="primary"
        onChange={(event, value) => {
          pageNumber(value);
        }}
        defaultPage={defaultPage}
        page={defaultPage}
      />
    </>
  );
}

export default PaginationComponent;
