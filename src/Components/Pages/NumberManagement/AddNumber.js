import React from 'react'
import Header from '../../CommonComponents/Header'
import '../../assets/css/components/getDid.css'
import image1 from '../../assets/images/india.png'
import ErrorMessage from '../../CommonComponents/ErrorMessage'
import { useForm } from 'react-hook-form'

const AddNumber = () => {

    const getNumber = [
        {
            image: image1,
            number: "6235258943",
        },
        {
            image: image1,
            number: "6235258943",
        },
        {
            image: image1,
            number: "6235258943",
        },
        {
            image: image1,
            number: "6235258943",
        },
        {
            image: image1,
            number: "6235258943",
        },
        {
            image: image1,
            number: "6235258943",
        },
        {
            image: image1,
            number: "6235258943",
        },

    ]

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm();

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
                                    <h4>Add a New Number</h4>
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
                                <div className='border border-light-subtle rounded-3 p-3 mb-3'>
                                    {/* <h4 className='card_title'>Top countries</h4> */}
                                    <div className='country_card_group numberListGroup'>
                                        {getNumber.map((item, index) => (
                                            <div className='card country_box'
                                                key={index}
                                            >
                                                <div className='card-body flex-row gap-3 justify-content-start w-100'>
                                                    <div className='avatar_img mb-0'>
                                                        <img className=" " src={item.image} alt='logout' />
                                                    </div>
                                                    <div className='card_details'>
                                                        <p className='country_name text-start'>+91 {item.number}</p>
                                                        <div className='d-flex justify-content-center align-content-center gap-2'>
                                                            <button className="text-center badge badge-soft-primary bg-transparent d-inline-flex justify-content-center align-items-center">
                                                                <i class="fa-solid fa-phone"></i>
                                                            </button>
                                                            <button className="text-center badge  badge-soft-primary bg-transparent d-inline-flex justify-content-center align-items-center">
                                                                <i class="fa-regular fa-comments"></i>
                                                            </button>
                                                            <button className="text-center badge  badge-soft-primary bg-transparent d-inline-flex justify-content-center align-items-center">
                                                                <i class="fa-solid fa-fax"></i>
                                                            </button>
                                                            <button className="text-center badge  badge-soft-primary bg-transparent d-inline-flex justify-content-center align-items-center">
                                                                <i class="fa-regular fa-light-emergency-on"></i>
                                                            </button>
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

export default AddNumber