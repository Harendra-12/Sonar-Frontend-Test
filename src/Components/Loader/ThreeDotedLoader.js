import React from 'react';
import '../assets/css/components/loader.css';

const ThreeDotedLoader = ({ col, row }) => {
    return (
        <>

            <div className='main_loader'>
                {/* <div className="three-body">
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                </div> */}
                <div className="Two_loader"></div>
            </div>
        </>
    )
}

export default ThreeDotedLoader