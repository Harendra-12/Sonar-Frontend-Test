import React from 'react'

const MissedCallPopup = () => {
    return (
        <>
            <div className='missedCallAlertBox'>
                <button type='button' className='clearButton2'><i className="fa-solid fa-xmark"></i></button>
                <div className='d-flex justify-content-start align-items-center gap-3 position-relative'>
                    <div className='callIfo'>
                        <i className="fa-solid fa-phone-missed"></i>
                    </div>
                    <div className='details'>
                        <h4 className='text-danger '>Missed Call</h4>
                        <p className=' ellipsisText300'>from <strong className='text-danger'>18556961156</strong> ( <strong>webvioTAG123</strong> )</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MissedCallPopup