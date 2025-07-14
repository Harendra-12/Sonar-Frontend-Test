import { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    // Define the init function globally
    window.googleTranslateElementInit = () => {
      if (!document.getElementById("google_translate_element").innerHTML.trim()) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en" },
          "google_translate_element"
        );
      }
    };

    const addGoogleTranslateScript = () => {
      const existingScript = document.querySelector("script[src*='translate_a/element.js']");
      
      if (existingScript) {
        // If script is already there, just re-trigger the callback
        window.googleTranslateElementInit();
      } else {
        const script = document.createElement("script");
        script.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    // Cleanup previously inserted Translate element on re-renders (optional)
    const translateDiv = document.getElementById("google_translate_element");
    if (translateDiv) {
      translateDiv.innerHTML = "";
    }

    addGoogleTranslateScript();
  }, []);

  const openLanguageDropdown = () => {
    const googleSpan = document.querySelector(".goog-te-gadget span");
    if (googleSpan) {
      googleSpan.click();
    }
  };

  return (
    <div className="language-selector me-3" style={{ position: "relative", zIndex: 9999 }}>
      <i className="fa-solid fa-language language-icon"></i>

      <i
        className="fa-solid fa-chevron-down dropdown-icon"
        onClick={openLanguageDropdown}
        style={{ cursor: "pointer", marginLeft: "5px" }}
        title="Change Language"
      ></i>

      <div
        id="google_translate_element"
        style={{ position: "absolute", top: "0px", opacity: 0, left: "0" }}
      ></div>
    </div>
  );
};

export default GoogleTranslate;
