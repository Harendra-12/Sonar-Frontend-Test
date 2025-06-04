import React from 'react'

const DetailLogs = () => {
    return (
        <>
            <div className=' mb-2'>
                <p className='f-s-14 mb-0' style={{ color: 'var(--immortalBlack)' }}>2025-06-03 09:10:09.198 call_ddac4e7635daa1881a14ef1a7a7 info: Starting call: call_ddac4e7635daa1881a14ef1a7a7</p>
                <p className='f-s-14 mb-0' style={{ color: 'var(--immortalBlack)' }}>2025-06-03 09:10:12.000 call_ddac4e7635daa1881a14ef1a7a7 info: Transitioning from node begin (name: begin) to node start-node-1735866339701 (name: Greetings)
                    2025-06-03 09:10:48.133 call_ddac4e7635daa1881a14ef1a7a7 info: Transitioning from node start-node-1735866339701 (name: Greetings) to node node-1735871022246 (name: Indentity )</p>
            </div>
        </>
    )
}

export default DetailLogs