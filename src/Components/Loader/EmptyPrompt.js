import React from 'react'
import { useNavigate } from 'react-router-dom'
import { backToTop } from '../GlobalFunction/globalFunction';

function EmptyPrompt(props) {
    const navigate = useNavigate()
    return (
        <>
            <style>
                {`                   
                   .imgWrapper.loader img{
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                   }

                   h5{
                    color: var(--color-subtext);
                    font-weight: 400;
                   }

                `}
            </style>
            <div className={props.nomargin ? '' : 'mt-5'}>
                <div className='imgWrapper loader' style={{ width: props.small ? '80px' : '150px', height: props.small ? '80px' : '150px' }}>
                    <img src={require('../assets/images/empty-box.png')} alt="Empty" />
                </div>
                <div className='text-center mt-3'>
                    {!props.generic ? <h5 style={{ fontSize: props.small ? '0.75rem' : 'inherit' }}>Please add a <b>{props.name}</b> to continue <span style={{ color: 'var(--ui-accent)', cursor: "pointer" }} onClick={() => { if (props.link) { navigate(`/${props.link}`); backToTop() } }}>setting up the environment</span>.</h5> : <h5>There is <span style={{ color: 'var(--ui-accent)', fontWeight: '700' }}>no data</span> to be shown!</h5>}
                </div>
            </div>
        </>
    )
}

export default EmptyPrompt