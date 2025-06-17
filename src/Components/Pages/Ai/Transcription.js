import React from 'react'

const Transcription = () => {
    return (
        <>
            <div className="accordion accordion-flush transcription_accordion" id="accordionFlushExample">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingOne">
                        <button className="accordion-button collapsed p-1 fs-12 border-0" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne" style={{ color: 'var(--ui-accent)' }}>
                            Node Transition
                        </button>
                    </h2>
                    <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                            <p className='fs-12 mb-0' style={{ color: 'var(--color-subtext)' }}>previous node: begin</p>
                            <p className='fs-12 mb-0' style={{ color: 'var(--color-subtext)' }}>new node: Greetings</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='d-flex justify-content-between align-items-center gap-4'>
                <p className='f-s-14' style={{ color: 'var(--immortalBlack)' }}>The user, Evie Wang, expressed discomfort in sharing personal information for verification but eventually provided her details. The agent confirmed that they could assist her with health and social services and asked about her living situation and food security, to which Evie indicated she does not have a steady place to live but has never worried about running out of food.</p>
                <p className='f-s-14' style={{ color: 'var(--immortalBlack)' }}>0.00</p>
            </div>
            <div className='d-flex justify-content-between align-items-center gap-4'>
                <p className='f-s-14' style={{ color: 'var(--immortalBlack)' }}>Agent: Hi, um, just checking—am I speaking with Evie Wang?</p>
                <p className='f-s-14' style={{ color: 'var(--immortalBlack)' }}>0.22</p>
            </div>
            <div className='d-flex justify-content-between align-items-center gap-4'>
                <p className='f-s-14' style={{ color: 'var(--immortalBlack)' }}>User: Yeah. Yeah. Sorry. My mic is muted. That's why I'm not talking. So, yeah, my name is. And I wanted to know that, uh, how you guys are help.</p>
                <p className='f-s-14' style={{ color: 'var(--immortalBlack)' }}>0.26</p>
            </div>
        </>
    )
}

export default Transcription

