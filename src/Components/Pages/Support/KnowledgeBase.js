import React, { useEffect, useState } from 'react'
import Header from '../../CommonComponents/Header'
import { generalGetFunction, useDebounce } from '../../GlobalFunction/globalFunction'
import { set } from 'react-hook-form';
import { toast } from 'react-toastify';
import ThreeDotedLoader from '../../Loader/ThreeDotedLoader';
import { CircularProgress } from '@mui/material';
import EmptyPrompt from '../../Loader/EmptyPrompt';
import ContentLoader from '../../Loader/ContentLoader';

function KnowledgeBase() {
    const [loading, setLoading] = useState(true);
    const [faqData, setFaqData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 1000);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const getAllFaqData = async () => {
        setLoading(true);
        try {
            const response = await generalGetFunction(`/knowledge-base/all${searchQuery ? `?search=${debouncedSearch}` : ''}`);
            if (response.status) {
                setFaqData(response?.data);
            }
        } catch (err) {
            toast.error(err.response.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllFaqData();
    }, [debouncedSearch])

    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid">
                        <div className="row">
                            <Header title="Support" />
                        </div>
                    </div>
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className="overviewTableWrapper0 px-0">
                                <div className="overviewTableChild0">
                                    <div className="d-flex flex-wrap">
                                        <div className="col-12">
                                            <div className='hero'>
                                                <div className="heading">
                                                    <div className="content mt-5 d-flex align-items-center justify-content-center">
                                                        <h3 style={{ fontSize: "48px", color: "white" }} >How can we help you?</h3>
                                                    </div>
                                                </div>
                                                <div className='col-7 mx-auto'><div className="tableHeader0">
                                                    <div className="searchBoxlable">
                                                        <div className="inputWrappers">
                                                            <input
                                                                type="text"
                                                                placeholder="Search our article"
                                                                className="formItem form-left"
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                            />
                                                            <i className="fas fa-search searchIcon"></i>
                                                        </div>
                                                        <div className='mt-1 text-center'><p style={{ fontSize: "16px", color: "white", fontWeight: 600 }}>Popular help articles :<span className='para-line'> Privacy FAQs,  How to Install Your Hotjar Tracking Code  </span></p></div>
                                                    </div>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12" style={{ overflow: "auto", padding: "25px 20px", }} >
                                            {faqData && faqData.length > 0 ?
                                                faqData.map((group, index) => {
                                                    return (
                                                        <div className='mt-5 align-items-center justify-content-center'>
                                                            <div className="content Additional-font text-center">
                                                                <div>
                                                                    <h5 className='p-3 m-0'>{group?.group_name}</h5>
                                                                    <p>{group?.group_title}</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className='row mt-5 knowledgeDetails'>
                                                                    {
                                                                        group.subs.map((item, index) => {
                                                                            return (
                                                                                <div className="col-xl-4 col-lg-6 col-md-6   mb-3"
                                                                                    style={{ cursor: "pointer" }}>
                                                                                    <div className="itemWrapper hover-shadow  a d-flex align-items-center  justify-content-between " onClick={() => setSelectedQuestion(item)}>
                                                                                        <div className="heading ">
                                                                                            <div className="d-flex align-items-center justify-content-start ">
                                                                                                <div className=" me-3">
                                                                                                    <i className="fa-solid fa-right-to-bracket"></i>
                                                                                                </div>
                                                                                                <h6>{item.sub_question}</h6>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }) : loading ?
                                                    <div className='mt-5 align-items-center justify-content-center'>
                                                        <ContentLoader />
                                                    </div> :
                                                    <EmptyPrompt generic={true} />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {selectedQuestion && (
                <div className="popup">
                    <div className="container h-100">
                        <div className="row h-100 justify-content-center align-items-center">
                            <div className="row content col-xl-4 col-md-5">
                                <div className="col-12 knowledgeDetails">
                                    <div className="itemWrapper ">
                                        <div className="heading ">
                                            <div className="d-flex align-items-center justify-content-start ">
                                                <div className=" me-3">
                                                    <i className="fa-solid fa-right-to-bracket" style={{ color: 'var(--color2)' }}></i>
                                                </div>
                                                <h6>{selectedQuestion.sub_question}</h6>
                                            </div>
                                        </div>
                                        <p className='mt-3'>{selectedQuestion.sub_answer}</p>
                                        <div className='d-flex justify-content-end mt-4'>
                                            <button className="btn btn-secondary " onClick={() => setSelectedQuestion(null)}>
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>


    )
}

export default KnowledgeBase