import { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    // Define Google's init function globally
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en" },
        "google_translate_element"
      );
    };

    // Load Google Translate script
    const addGoogleTranslateScript = () => {
      if (!document.querySelector("script[src*='translate_a/element.js']")) {
        const script = document.createElement("script");
        script.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    addGoogleTranslateScript();
  }, []);

  // Function to programmatically open the language dropdown
    const openLanguageDropdown = () => {
    const googleSpan = document.querySelector(".goog-te-gadget span");
    if (googleSpan) {
      googleSpan.click();
    }
  };

  return (
    <div className="language-selector me-3" style={{ position: "relative", zIndex: 9999 }} >
      <i className="fa-solid fa-language language-icon"></i>

      <i
        className="fa-solid fa-chevron-down dropdown-icon" onClick={openLanguageDropdown}
       
        style={{ cursor: "pointer", marginLeft: "5px" }}
        title="Change Language"
      ></i>
<div id="google_translate_element" style={{ position: "absolute", top: "0px", opacity:0,  left:"0" }}></div>
      <span className="language-text" style={{ marginLeft: "5px" }}>
        EN
      </span>

      {/* Hidden container for Google Translate widget */}
      
    </div>
  );
};

export default GoogleTranslate;
