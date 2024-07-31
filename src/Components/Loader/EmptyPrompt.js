import React from 'react'
import { useNavigate } from 'react-router-dom'
import { backToTop } from '../../GlobalFunction/globalFunction';

function EmptyPrompt(props) {
    const navigate = useNavigate()
    return (
        <>
            <style>
                {`
                   .imgWrapper.loader{
                    width: 150px;
                    height: 150px;
                   } 
                   
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
            <div className='mt-5'>
                <div className='imgWrapper loader'>
                    <img src={require('../../assets/images/empty-box.png')} />
                </div>
                <div className='text-center mt-3'>
                    <h5>Please add a <b>{props.name}</b> to continue <span style={{ color: 'var(--ui-accent)', cursor: "pointer" }} onClick={() => { navigate(`/${props.link}`); backToTop() }}>setting up the environment</span>.</h5>
                </div>
            </div>
        </>
    )
}

export default EmptyPrompt