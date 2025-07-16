import { useEffect } from "react";
import { Rnd } from "react-rnd";

const GoogleTranslate = () => {
  useEffect(() => {
    // Define the callback globally
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en" },
        "google_translate_element"
      );

      const listenForLanguageChange = () => {
        const iframe = document.querySelector("iframe.goog-te-menu-frame");

        if (iframe) {
          const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

          const observer = new MutationObserver(() => {
            const selectedOption = iframeDocument.querySelector(".goog-te-menu2-item-selected a");
            if (selectedOption) {
              const href = selectedOption.getAttribute("href");
              if (href) {
                const langCode = href.split("/").pop();
                localStorage.setItem("selected_language", langCode);
              }
            }
          });

          observer.observe(iframeDocument.body, {
            childList: true,
            subtree: true,
          });
        }
      };

      setTimeout(listenForLanguageChange, 1000);
    };

    const addGoogleTranslateScript = () => {
      if (!document.querySelector("script[src*='translate_a/element.js']")) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    addGoogleTranslateScript();

    // Optional cleanup
    return () => {
      const script = document.querySelector("script[src*='translate_a/element.js']");
      if (script) script.remove();
    };
  }, []);


  return (
    <>
       <div className="language-selector me-3" style={{ position: "relative", zIndex: 9999 }}>
      <i className="fa-solid fa-language language-icon"></i>

      <i
        className="fa-solid fa-chevron-down dropdown-icon"
        style={{ cursor: "pointer", marginLeft: "5px" }}
        title="Change Language"
      ></i>

      <div
        id="google_translate_element"
        style={{ position: "absolute", top: "0px", opacity: 0, left: "0" }}
      ></div>
    </div>
    </>
  );
};

export default GoogleTranslate;