// import React from 'react'

// function AddNewContactPopup() {
//     return (
//         <div className='addNewContactPopup'>
//             <div className='row'>
//                 <div className='col-12 heading'>
//                     <i class="fa-light fa-user-plus"></i>
//                     <h3>Add Contact</h3>
//                 </div>
//                 <div class="col-xl-12">
//                     <div class="formLabel">
//                         <label for="">Full Name Of User</label>
//                     </div>
//                     <div class="col-12">
//                         <input type="text" class="formItem" placeholder='Full Name' />
//                     </div>
//                 </div>
//                 <div class="col-xl-12">
//                     <div class="formLabel">
//                         <label for="">Title of User</label>
//                     </div>
//                     <div class="col-12">
//                         <input type="text" class="formItem" placeholder='Title' />
//                     </div>
//                 </div>
//                 <div class="col-xl-12">
//                     <div class="formLabel">
//                         <label for="">Extension Of User</label>
//                     </div>
//                     <div class="col-12">
//                         <input type="text" class="formItem" placeholder='Extension' />
//                     </div>
//                 </div>
//                 <div className='col-xl-12 mt-3'>
//                     <div className='d-flex justify-content-between'>
//                         <button className='formButton ms-0'>Cancel</button>
//                         <button className='formButton me-0'>Create</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default AddNewContactPopup

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  nameValidator,
  numberValidator,
  requiredValidator,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import { generalPostFunction } from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function AddNewContactPopup({ setAddContactToggle }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const account = useSelector((state) => state.account);

  const handleFormSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      ...{
        user_id: account.id,
        title: "Mr",
      },
    };
    const apiData = await generalPostFunction("contact/store", payload);
    if (apiData.status) {
      setAddContactToggle(false);
      toast.success(apiData.message);
    } else {
      console.log(apiData);
      const errorMessage = Object.keys(apiData.errors);
      toast.error(apiData.errors[errorMessage[0]][0]);
    }
  });

  return (
    <div className="addNewContactPopup">
      <div className="row">
        <div className="col-12 heading">
          <i class="fa-light fa-user-plus"></i>
          <h3>Add Contact</h3>
        </div>
        <div class="col-xl-12">
          <div class="formLabel">
            <label for="">Full Name Of User</label>
          </div>
          <div class="col-12">
            <input
              type="text"
              class="formItem"
              placeholder="Full Name"
              {...register("name", { ...requiredValidator, ...nameValidator })}
            />

            {errors.name && <ErrorMessage text={errors.name.message} />}
          </div>
        </div>
        <div class="col-xl-12">
          <div class="formLabel">
            <label for="">DID / Extension</label>
          </div>
          <div class="col-12">
            <input
              type="text"
              class="formItem"
              placeholder="DID"
              {...register("did", {
                ...requiredValidator,
                ...numberValidator,
              })}
            />
            {errors.did && <ErrorMessage text={errors.did.message} />}
          </div>
        </div>

        <div className="col-xl-12 mt-3">
          <div className="d-flex justify-content-between">
            <button
              className="formButton ms-0"
              onClick={() => setAddContactToggle(false)}
            >
              Cancel
            </button>
            <button
              className="formButton me-0"
              onClick={() => handleFormSubmit()}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewContactPopup;
