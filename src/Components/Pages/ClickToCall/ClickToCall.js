import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { generalGetFunction, generalPostFunction } from '../../GlobalFunction/globalFunction'
import { useLocation } from 'react-router-dom'

function ClickToCall() {
    const [widgetExpanded, setWidgetExpanded] = useState(false)
    const [callFormVisible, setCallFormVisible] = useState(false)
    const [name, setName] = useState("")
    const [number, setNumber] = useState("")
    const queryParams = new URLSearchParams(useLocation().search);
    const value = queryParams.get("id");
    const [companyName, setCompanyName] = useState("")
    const [description, setDescription] = useState("")
    const [logo, setLogo] = useState("")
    const [color, setColor] = useState("")
    const [loading, setLoading] = useState(true)
    const [usages,setUsages] = useState("")
    const [action,setAction] = useState("")
    useEffect(() => {
        if (value) {
            async function getData() {
                const getClickToCall = await generalGetFunction(`/click-to-call/show/${value}`)
                if (getClickToCall?.status) {
                    setLoading(false);
                    setLogo(getClickToCall.data.logo)
                    setCompanyName(getClickToCall.data.company_name)
                    setDescription(getClickToCall.data.description)
                    setColor(getClickToCall.data.primary_color)
                    setUsages(getClickToCall.data.usages)
                    setAction(getClickToCall.data.action)
                } else {
                    setLoading(false);
                }
            }
            getData()
        }
    }, [value])

    async function handleSubmit() {
        if (number === "") {
            toast.error("Please enter number")
        } else if (number < 99999999) {
            toast.error("Please enter valid number")
        } else {
            const parsedData = {
                destination: number,
                usages:usages,
                action:action,
                id:value
            }
            const apiData = await generalPostFunction("/freeswitch/click-to-call-action", parsedData)
            if (apiData.status) {
                toast.success(apiData.message)
            }
        }
    }
    return (
        <>
            <style>
                {`
            body{
            background: transparent;
            }
            `}
            </style>
            <div className="clickToCall" style={{ '--prim-color': color }}>
                {/* <div className="clickToCallButton">
                <button onClick={() => setWidgetExpanded(!widgetExpanded)}>
                    <i className={`fa-solid fa-${!widgetExpanded ? "phone" : "chevron-down"}`}></i>
                </button>
            </div> */}
                    <div className="clickToCallModule">
                    {loading ?(
                    <div className="clickToCallHeader">
                        <div className="wrapper">
                            <button><i className="fa-solid fa-chevron-left"></i></button>
                            <div className="compLogo">
                                <div className='skeleton skeleton-button w-100'></div>
                            </div>
                            <div className="text">
                                <h5><div className='skeleton skeleton-heading w-100'></div></h5>
                                <p><div className='skeleton skeleton-heading-small w-100'></div></p>
                            </div>
                        </div>
                    </div>) :
                       ( <div className="clickToCallHeader">
                            <div className="wrapper">
                                <button onClick={() => setCallFormVisible(false)}><i className="fa-solid fa-chevron-left"></i></button>
                                <div className="compLogo">
                                    <img src={logo} alt=''></img>
                                </div>
                                <div className="text">
                                    <h5>{companyName}</h5>
                                    <p>{description}</p>
                                </div>
                            </div>
                        </div>)}
                        <div className="clickToCallBody">
                            {!callFormVisible ?
                                <>
                                    <div className="callByAudio">
                                        <button onClick={() => setCallFormVisible(true)}>
                                            <i className="fa-solid fa-phone"></i>
                                        </button>
                                        <h5>Arrange an <span>Audio Call</span> with our Agent</h5>
                                    </div>
                                    <div className="callByVideo">
                                        <button onClick={() => setCallFormVisible(true)}>
                                            <i className="fa-solid fa-video"></i>
                                        </button>
                                        <h5>Arrange a <span>Video Call</span> with our Agent</h5>
                                    </div>
                                </> : ""}
                            {callFormVisible ? <div className="callDialogBox">
                                <div className="formBox">
                                    <label className="formLabel">Name</label>
                                    <input type="text" placeholder="Enter your name" onChange={(e) => setName(e.target.value)} value={name} />
                                </div>
                                <div className="formBox">
                                    <label className="formLabel">Number</label>
                                    <input
                                        type="number"
                                        placeholder="Enter your Number"
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 15) {
                                                setNumber(value); // Allow typing up to 15 digits
                                            }
                                        }}
                                        value={number}
                                    />

                                </div>
                                <div>
                                    <button onClick={handleSubmit}>Call Now!</button>
                                </div>
                            </div> : ""}
                        </div>
                    </div>
            </div>
        </>
    )
}

export default ClickToCall