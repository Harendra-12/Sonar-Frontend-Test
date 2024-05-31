import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { generalGetFunction } from "../GlobalFunction/globalFunction";

function Header(props) {
  const dispatch = useDispatch()
  const account = useSelector((state) => state.account);
  const [accounName, setAccountName] = useState();
  const [dropDown, setDropDown] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (account === null || account === "") {
      navigate("/");
    } else {
      setAccountName(account.name);
    }
  }, [account, navigate]);

  // Handle log out function
  async function logOut() {
    const apiData = await generalGetFunction("/logout")
    localStorage.clear()
    if (apiData.data) {
      localStorage.clear();
      dispatch({
        type: "SET_ACCOUNT",
        account: null
      })
      navigate("/")
    }
  }

  // Handel outside click from profile picture
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setDropDown(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  return (
    <div
      className="d-flex flex-wrap px-xl-3 py-2 justify-content-between"
      id="detailsHeader"
    >
      <div className="col-auto d-none d-xl-flex align-items-center">
        <h4 className="my-auto">{props.title}</h4>
      </div>
      <div className="col-8 d-flex justify-content-evenly justify-content-xl-end align-items-center">
        <div className="d-flex justify-content-end align-items-center">
          <div className="d-xl-none d-block me-3">
            <button className="clearButton d-flex align-items-center">
              <i className="fa-light fa-bars fs-5" />
            </button>
          </div>
          <div className="my-auto mx-3">
            <button className="getApp" effect="ripple">
              Get Our App
            </button>
          </div>

          <div>
            <Tippy content="Your available balance, click to know more!">
              <div
                // href="#"
                className="clearColorButton"
              >
                <i className="fa-regular fa-wallet" />{" "}
                <span className="d-none d-xl-inline-block">$420.69</span>
              </div>
            </Tippy>
          </div>
        </div>
      </div>
      <div className="col-auto col-xl-auto d-flex justify-content-end align-items-center">
        <Tippy content={accounName}>
          <div className="profileName">{accounName}</div>
        </Tippy>
        <div className="statusProfile" />
        <div
          ref={wrapperRef}
          className="profileHolder"
          onClick={() => setDropDown(!dropDown)}
        >
          <img
            src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg"
            alt="profile"
          />
          {/* <span onclick="togglePhoneSidenav()"><i className="fa-light fa-xmark fs-4" style="display: none"></i></span> */}
        </div>
        {dropDown ? (
          <div ref={wrapperRef} className="profileDropdown">
            <div onClick={() => navigate("/my-profile")}>
              <label className="me-2">
                <i className="fa-duotone fa-user"></i>
              </label>
              <Link to="/my-profile">My Profile</Link>
            </div>
            <div onClick={() => navigate("/change-password")}>
              <label className="me-2">
                <i className="fa-duotone fa-lock"></i>
              </label>
              <Link to={"/change-password"}>Change Password</Link>
            </div>
            <div onClick={logOut} className="d-flex justify-content-center">
              <Link to={"/"} className="logoutBtn">
                <i className="fa-solid fa-power-off me-1"></i> Logout
              </Link>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Header;
