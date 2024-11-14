import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  nameValidator,
  numberValidator,
  requiredValidator,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import {
  generalPostFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

function AddNewContactPopup({
  setAddContactToggle,
  editContactToggle,
  setEditContactToggle,
  selectedEditContact,
  setLoading,
  setSelectedEditContact,
  loading,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const account = useSelector((state) => state.account);
  const addContactRefresh = useSelector((state) => state.addContactRefresh);
  const dispatch = useDispatch();
  const handleFormSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const payload = {
      ...data,
      ...{
        user_id: account.id,
        title: "Mr",
      },
    };
    const apiData = await generalPostFunction("contact/store", payload);
    if (apiData?.status) {
      setAddContactToggle(false);
      toast.success(apiData.message);

      dispatch({
        type: "SET_ADDCONTACTREFRESH",
        addContactRefresh: addContactRefresh + 1,
      });
      setLoading(false);
    } else {
      setAddContactToggle(false);
      setLoading(false);
      // const errorMessage = Object.keys(apiData.errors);
      // toast.error(apiData.errors[errorMessage[0]][0]);
    }
  });

  useEffect(() => {
    if (selectedEditContact && editContactToggle) {
      setValue("name", selectedEditContact.name);
      setValue("did", selectedEditContact.did);
    }
  }, [selectedEditContact]);

  const handleEditContactSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const payload = {
      ...selectedEditContact,
      name: data.name,
      did: data.did,
    };
    const apiData = await generalPutFunction(
      `/contact/update/${selectedEditContact.id}`,
      payload
    );
    if (apiData?.status) {
      setEditContactToggle(false);
      toast.success(apiData.message);
      setAddContactToggle(false);
      dispatch({
        type: "SET_ADDCONTACTREFRESH",
        addContactRefresh: addContactRefresh + 1,
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  });
  return (
    <div className="addNewContactPopup">
      <div className="row">
        <div className="col-12 heading">
          <i class="fa-light fa-user-plus"></i>
          <h3>{editContactToggle ? "Edit Contact" : "Add Contact"}</h3>
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
              disabled={loading}
              className="formButton ms-0"
              onClick={() => {
                setAddContactToggle(false);
                setEditContactToggle(false);
                setSelectedEditContact(null);
              }}
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="formButton me-0"
              onClick={() => {
                if (editContactToggle) {
                  handleEditContactSubmit();
                } else {
                  handleFormSubmit();
                }
              }}
            >
              {editContactToggle ? "Save" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewContactPopup;
