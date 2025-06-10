import React from 'react';
import '../assets/css/components/loader.css';

const ThreeDotedLoader = ({ col, row }) => {
    return (
        <>

            <div className='main_loader'>
                {/* <div class="three-body">
                    <div class="three-body__dot"></div>
                    <div class="three-body__dot"></div>
                    <div class="three-body__dot"></div>
                </div> */}
                <div class="Two_loader"></div>
            </div>
        </>
    )
}

export default ThreeDotedLoader