import React, { useCallback, useState } from 'react'

function PromptFunctionPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [resolver, setResolver] = useState(null);

    const confirm = useCallback(() => {
        return new Promise((resolve) => {
            setResolver(() => resolve);
            setIsOpen(true);
        });
    }, []);

    const handleResolve = (result) => {
        setIsOpen(false);
        resolver(result);
    };

    const ModalComponent = ({ task, reference }) =>
        isOpen ? (
            <div className="popup">
                <div className="container h-100">
                    <div className="row h-100 justify-content-center align-items-center">
                        <div className="row content col-xl-4">
                            <div className="col-2 px-0">
                                <div className="iconWrapper">
                                    <i className="fa-duotone fa-triangle-exclamation"></i>
                                </div>
                            </div>
                            <div className="col-10 ps-0">
                                <h4>Warning!</h4>
                                <p>
                                    Are you sure, you want to {task} this {reference}?
                                </p>
                                <div className="mt-2 d-flex justify-content-between">
                                    <button
                                        className="panelButton m-0"
                                        onClick={() => handleResolve(true)}
                                    >
                                        <span className="text">Confirm</span>
                                        <span className="icon">
                                            <i className="fa-solid fa-check"></i>
                                        </span>
                                    </button>
                                    <button
                                        className="panelButton gray m-0 float-end"
                                        onClick={() => handleResolve(false)}
                                    >
                                        <span className="text">Cancel</span>
                                        <span className="icon">
                                            <i className="fa-solid fa-xmark"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null;

    return { confirm, ModalComponent };
}

export default PromptFunctionPopup