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
                        const languageSelect = iframeDocument.querySelector(".goog-te-menu2-item-selected");
                        if (languageSelect) {
                            const selectedLang = languageSelect.textContent.trim();
                            localStorage.setItem("selected_language", selectedLang);
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
                script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
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

    return <div id="google_translate_element"></div>;
    
};

{/* <div class="sticky-icon">
   <a href="https://www.instagram.com/?hl=en" class="Instagram"><i class="fab fa-instagram"></i> Instagram </a>
     
</div> */}

export default GoogleTranslate;
