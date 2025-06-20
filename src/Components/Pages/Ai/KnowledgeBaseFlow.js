import React from "react";
import { Link } from "react-router-dom";

const KnowledgeBaseFlow = ({
  allKnowledgeBases,
  llmKnowlwdgeBaseIds,
  setLlmKnowlwdgeBaseIds,
}) => {
  return (
    <>
      <p className="detailText">
        Enable your agent with capabilities such as calendar bookings, call
        termination, etc.
      </p>

      <ul>
        <li>
          {llmKnowlwdgeBaseIds.map((item, index) => {
            return (
              <div class="noticeMessageBox justify-content-between">
                <div className="d-flex align-items-center gap-1">
                  <i class="fa-regular fa-book me-3 iconGray"></i>
                  <p class="mb-0 f-s-14">
                    {" "}
                    {
                      allKnowledgeBases.filter(
                        (item2) => item2.knowledge_base_id === item
                      )?.[0]?.knowledge_base_name
                    }
                  </p>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <button
                    onClick={() => {
                      setLlmKnowlwdgeBaseIds((prev) =>
                        prev.filter((item2) => item2 !== item)
                      );
                    }}
                    className="clearButton text-align-start text-danger"
                  >
                    <i class="fa-regular fa-trash-can "></i>
                  </button>
                </div>
              </div>
            );
          })}
        </li>
      </ul>
      <div class="dropdown">
        <button
          className="panelButton static mt-3 dropdown-toggle"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span class="text">
            <i class="fa-regular fa-plus me-2"></i> Add
          </span>
        </button>
        <ul class="dropdown-menu">
          {allKnowledgeBases
            .filter(
              (item) => !llmKnowlwdgeBaseIds.includes(item.knowledge_base_id)
            )
            .map((item, index) => {
              return (
                <li>
                  <button
                    onClick={() => {
                      setLlmKnowlwdgeBaseIds((prev) => [
                        ...prev,
                        item.knowledge_base_id,
                      ]);
                    }}
                    class="dropdown-item"
                  >
                    {item.knowledge_base_name}
                  </button>
                </li>
              );
            })}

          <li>
            <hr class="dropdown-divider" />
          </li>
          <li>
            <Link to="/ai-knowledge-base" class="dropdown-item">
              <i class="fa-solid fa-arrow-up-right me-2"></i> Create New
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default KnowledgeBaseFlow;
