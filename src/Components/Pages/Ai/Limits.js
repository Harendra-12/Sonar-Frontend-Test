import React from 'react'

const Limits = () => {
  return (
    <>
   <div className='row'>
                <div className='col-lg-6 col-sm-12 mb-3'>
                    <div className='card usage_card shadow-none'>
                        <div className='card-body d-flex justify-content-center flex-column'>
                            <p className='f-s-14 mb-1' style={{ color: 'var(--color-subtext)' }}>Concurrent Calls Limit</p>
                            <h4>20</h4>
                        </div>
                    </div>
                </div>
                <div className='col-lg-6 col-sm-12 mb-3'>
                    <div className='card usage_card shadow-none'>
                        <div className='card-body d-flex justify-content-center flex-column'>
                            <p className='f-s-14 mb-1' style={{ color: 'var(--color-subtext)' }}>LLM Token Limit</p>
                            <h4>32768</h4>
                        </div>
                    </div>
                </div>
               
                
            </div>
    </>
  )
}

export default Limits