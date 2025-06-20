import React from 'react'

const KnowledgeBaseFlow = () => {
  return (
    <>
      <p className='detailText'>Enable your agent with capabilities such as calendar bookings, call termination, etc.</p>

      <ul>
        <li>
          <div class="noticeMessageBox justify-content-between">
            <div className='d-flex align-items-center gap-1'>
             <i class="fa-regular fa-book me-3 iconGray"></i>
              <p class="mb-0 f-s-14">Instruction To Give the flight Deatils</p>
            </div>
            <div className='d-flex align-items-center gap-1'>
            
              <button className="clearButton text-align-start text-danger" >
                <i class="fa-regular fa-trash-can "></i>
              </button>
            </div>
          </div>
        </li>
      </ul>
       <div class="dropdown">
                <button className="panelButton static mt-3 dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <span class="text"><i class="fa-regular fa-plus me-2"></i> Add</span>
                </button>
                <ul class="dropdown-menu">
                  <li><button class="dropdown-item" >url</button></li>
                  <li><button class="dropdown-item"> New Knowledge</button></li>
               
                  <li><hr class="dropdown-divider" /></li>
                  <li><button class="dropdown-item" ><i class="fa-solid fa-arrow-up-right me-2"></i> Create New</button></li>
                </ul>
              </div>
    </>
  )
}

export default KnowledgeBaseFlow