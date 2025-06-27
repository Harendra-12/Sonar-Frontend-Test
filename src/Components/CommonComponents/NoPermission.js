import React from 'react'

const NoPermission = () => {
    return (
        <>
            <div className="noDataBg" style={{ textAlign: "center" }}>
                <div className="permissionImgBox">
                    <img
                        className="w-100 "
                        src={require("../assets/images/empty1.png")}
                    />
                </div>
                <p>You don't have permission for this module! Please connect with admin!</p>
            </div>
        </>
    )
}

export default NoPermission