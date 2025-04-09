import React from 'react'
import Header from '../../CommonComponents/Header'
import '../../assets/css/components/getDid.css'
import image1 from '../../assets/images/india.png'
import image2 from '../../assets/images/canada.png'
import image3 from '../../assets/images/united-kingdom.png'

const NewGetDid = () => {

    const countryCode = [
        {
            image: image1,
            title: "India",
            code: "+91"
        },
        {
            image: image2,
            title: "Canada",
            code: "+1"
        },
        {
            image: image3,
            title: "United Kingdom",
            code: "+44"
        },
        {
            image: image1,
            title: "India",
            code: "+91"
        },
        {
            image: image3,
            title: "United Kingdom",
            code: "+44"
        },
        {
            image: image1,
            title: "India",
            code: "+91"
        },
        {
            image: image3,
            title: "United Kingdom",
            code: "+44"
        },
        {
            image: image1,
            title: "India",
            code: "+91"
        },
    ]

    return (
        <>
            <main className='mainContent'>
                <section >
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <Header title="DID Management" />
                        </div>
                        <div className='card mt-4 shadow-sm border-0'>
                            <div className="heading card-header d-flex justify-content-between align-items-center gap-2 bg-transparent border-light-subtle">
                                <div className="content">
                                    <h4>Buy A Number</h4>
                                    <p className='mb-0'>You can purchase a DID here</p>
                                </div>
                                <div className="buttonGroup">
                                    <button
                                        effect="ripple"
                                        className="panelButton gray"
                                    // onClick={() => {
                                    //     navigate(-1);
                                    //     backToTop();
                                    // }}
                                    >
                                        <span className="text">Back</span>
                                        <span className="icon">
                                            <i className="fa-solid fa-caret-left"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className='card-body '>
                               
                                <div className='border border-light-subtle rounded-3 p-3'>
                                    <h4 className='card_title'>All countries</h4>
                                    <div className='country_card_group'>
                                        {countryCode.map((item, index) => (
                                            <div key={index} className='card country_box'>
                                                <div className='card-body'>
                                                    <div className='avatar_img'>
                                                        <img className=" " src={item.image} alt='logout' />
                                                    </div>
                                                    <div className='card_details'>
                                                        <p className='country_name'>{item.title}</p>
                                                        <div className="text-center badge rounded-pill badge-soft-primary bg-transparent d-inline-flex justify-content-center align-items-center">
                                                            <p className="text-center mb-0">{item.code}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default NewGetDid