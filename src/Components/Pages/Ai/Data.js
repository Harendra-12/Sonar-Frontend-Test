import React from 'react'

const Data = () => {
    return (
        <>
            <div className='mb-3'>
                <div className='d-flex align-items-center gap-2 mb-2'>
                    <i class="fa-regular fa-brackets-curly" style={{ color: 'var(--color-subtext)' }}></i> <p className='f-s-14 mb-0' style={{ color: 'var(--immortalBlack)' }}> Dynamic Variables</p>
                </div>
                <div className='dataBox mb-2'>
                    <p className='f-s-14 mb-0' style={{ color: 'var(--immortalBlack)' }}>No Dynamic Variables</p>
                </div>
            </div>
            <div className='mb-2'>
                <div className='d-flex align-items-center gap-2 mb-2'>
                    <i class="fa-regular fa-tag" style={{ color: 'var(--color-subtext)' }}></i> <p className='f-s-14 mb-0' style={{ color: 'var(--immortalBlack)' }}>Metadata</p>
                </div>
                <div className='dataBox mb-2'>
                    <p className='f-s-14 mb-0' style={{ color: 'var(--immortalBlack)' }}>No Metadata</p>
                </div>
            </div>
        </>
    )
}

export default Data