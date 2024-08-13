import React from 'react'

function AddNewContactPopup() {
    return (
        <div className='addNewContactPopup'>
            <div className='row'>
                <div className='col-12 heading'>
                    <i class="fa-light fa-user-plus"></i>
                    <h3>Add Contact</h3>
                </div>
                <div class="col-xl-12">
                    <div class="formLabel">
                        <label for="">Full Name Of User</label>
                    </div>
                    <div class="col-12">
                        <input type="text" class="formItem" placeholder='Full Name' />
                    </div>
                </div>
                <div class="col-xl-12">
                    <div class="formLabel">
                        <label for="">Title of User</label>
                    </div>
                    <div class="col-12">
                        <input type="text" class="formItem" placeholder='Title' />
                    </div>
                </div>
                <div class="col-xl-12">
                    <div class="formLabel">
                        <label for="">Extension Of User</label>
                    </div>
                    <div class="col-12">
                        <input type="text" class="formItem" placeholder='Extension' />
                    </div>
                </div>
                <div className='col-xl-12 mt-3'>
                    <div className='d-flex justify-content-between'>
                        <button className='formButton ms-0'>Cancel</button>
                        <button className='formButton me-0'>Create</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddNewContactPopup