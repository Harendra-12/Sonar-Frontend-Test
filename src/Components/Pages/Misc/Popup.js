import React from 'react'

function Popup(props) {
    return (
        <div className='popup'>
            <div className='container h-100'>
                <div className='row h-100 justify-content-center align-items-center'>
                    <div className='row content col-xl-4'>
                        <div className='col-2 px-0'>
                            <div className='iconWrapper'>
                                <i className="fa-duotone fa-triangle-exclamation"></i>
                            </div>
                        </div>
                        <div className='col-10 ps-0'>
                            <h4>Warning!</h4>
                            <p>Are you sure you want to delete this {props.name}: {props.value}?</p>
                            <button className='panelButton m-0'>Confirm</button>
                            <button className='panelButtonWhite m-0 float-end'>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Popup