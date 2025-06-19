import React, { useState } from 'react'
import Header from '../../CommonComponents/Header'
import Tippy from '@tippyjs/react'
import WelcomeMessage from './WelcomeMessage'
import FlowAccordionContent from './FlowAccordionContent'
import TestCallChat from './TestCallChat'

const ConversationsFlow = () => {
    const [refreshState, setRefreshState] = useState(false)
    const [addKnowledgeBase, setKnowledgeBase] = useState(false)
    const [idCopy, setIdCopy] = useState(false)
    const [deletePopup, setDeletePopup] = useState(false);

    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRtl, setIsRtl] = useState(false);
    const [value, setValue] = useState();
    const [selectedOption, setSelectedOption] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState("Natty.v2");

    const handleRefreshBtnClicked = () => {
        setRefreshState(true)
        // const shouldLoad = false
        // getData(shouldLoad);
    }

    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid">
                        <div className="row">
                            <Header title="Conversations Flow" />
                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild">
                                    <div className="d-flex flex-wrap">
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <div className="editable-title d-flex justify-content-start align-items-center gap-2 mb-3">
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                className="formItem"
                                                                value={title}
                                                                onChange={(e) => setTitle(e.target.value)}
                                                                onBlur={() => setIsEditing(false)}
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <h4>{title}</h4>
                                                        )}

                                                        <button
                                                            className="aitable_button bg-transparent"
                                                            onClick={() => setIsEditing(true)}
                                                        >
                                                            <i className="fa-regular fa-pen"></i>
                                                        </button>
                                                    </div>
                                                    <div className='d-flex justify-content-start align-items-center gap-3'>
                                                        <p className='mb-0'>Agent ID: <span>agent_90ea9449c2e5e7c51f5bd7e80e</span>
                                                            <button
                                                                className="clearButton"
                                                                onClick={() => { setIdCopy(!idCopy) }}
                                                            >
                                                                <i
                                                                    className={
                                                                        idCopy
                                                                            ? "fa-solid fa-check text_success"
                                                                            : "fa-solid fa-clone"
                                                                    }
                                                                ></i>

                                                            </button>
                                                        </p>
                                                        <p className='mb-0'> <span>$0.12/min</span>
                                                            <Tippy content={
                                                                <>
                                                                    <ul className='toolTripContext'>
                                                                        <li>Cost per minute <strong>$0.12/min</strong></li>
                                                                        <li>- Voice Engine: 11labs <strong>$0.07/min</strong></li>
                                                                        <li>- LLM: gpt-4o <strong>$0.05/min</strong></li>
                                                                    </ul>
                                                                </>
                                                            }>
                                                                <button className="clearButton text-align-start" >
                                                                    <i class="fa-regular fa-chart-pie-simple"></i>
                                                                </button>

                                                            </Tippy>


                                                        </p>

                                                    </div>
                                                </div>
                                                <div>
                                                    {/* <p className='text-end mb-2 f-s-14'>Last Update on : <strong> 5/26/2025</strong></p> */}
                                                    <div className="buttonGroup">
                                                        <button className="panelButton static" >
                                                            <span className="text">Update</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12'>
                                            <div className='row p-3'>
                                                <div className='col-xxl-6 '>
                                                    <div className='KnowledgeLeftinfo'>
                                                        <div className='heightAuto'>
                                                            <WelcomeMessage />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-xxl-3 '>
                                                    <div className='KnowledgeLeftinfo'>
                                                        <div className='heightAuto'>
                                                            <FlowAccordionContent />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-xxl-3 '>
                                                    <div className='KnowledgeLeftinfo p-0'>
                                                        <div className='h-100'>
                                                            <TestCallChat />

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>



            </main >
        </>
    )
}

export default ConversationsFlow