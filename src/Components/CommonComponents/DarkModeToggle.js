import React, { useEffect, useRef, useState } from 'react'

function DarkModeToggle({ marginLeft }) {
    const [isDark, setIsDark] = useState(false)
    const darkModeToggle = useRef(null)
    const storedTheme = localStorage.getItem("theme");
    const root = document.documentElement;

    useEffect(() => {
        if (isDark) {
            localStorage.setItem("theme", "dark");
            document.body.classList.add("dark");
            root.classList.add("dark");

            const darkLink = document.createElement("link");
        } else {
            localStorage.setItem("theme", "light");
            root.classList.remove("dark");
            document.body.classList.remove("dark");
        }
    }, [isDark])

    useEffect(() => {
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        const defaultDark = storedTheme === "dark" || (storedTheme === null & prefersDark);
        if (defaultDark) {
            setIsDark(true)
            darkModeToggle.current.checked = true
        }
    }, [])

    const toggleTheme = (e) => {
        if (e.target.checked) {
            setIsDark(true)
        } else {
            setIsDark(false)
        }
    }

    // test


    return (
        <>
            <div class="col-auto mx-2">
                <button class="clearButton2 xl" effect="ripple">
                    <i class={`fa-light fa-${isDark ? "moon" : "sun"}`}></i>
                    <input type="checkbox" onChange={toggleTheme} ref={darkModeToggle} style={{ opacity: 0, width: '100%', height: '100%', position: 'absolute', top: '0' }} />
                </button>
            </div>


            {/* <div className="iconHolder">

            </div>
            <div className="itemTitle customTogle d-flex align-items-center">
                Dark Mode
                <label class={`switch ms-${marginLeft}`}>
                    <input type="checkbox" onChange={toggleTheme} ref={darkModeToggle} />
                    <span class="slider my-auto"></span>
                </label>
            </div> */}
        </>
    )
}

export default DarkModeToggle