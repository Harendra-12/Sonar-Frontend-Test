import { useEffect } from "react";

const GoogleTranslate = () => {
    useEffect(() => {
        const addGoogleTranslateScript = () => {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src =
                "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);

            // Initialize Google Translate
            window.googleTranslateElementInit = () => {
                

                // Function to listen for language change and save to localStorage
                const listenForLanguageChange = () => {
                    const iframe = document.querySelector("iframe.goog-te-menu-frame");

                    if (iframe) {
                        const iframeDocument =
                            iframe.contentDocument || iframe.contentWindow.document;

                        // Use MutationObserver to listen for language selection change
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

                // Listen for iframe load and set up mutation observer
                setTimeout(listenForLanguageChange, 1000); // Wait for iframe to load

                // Access and clean up unnecessary elements
                // const $googleDiv = document.querySelector('#google_translate_element .skiptranslate');
                // const $googleDivChild = $googleDiv.querySelector('div');
                // if ($googleDivChild) {
                //     $googleDivChild.nextElementSibling?.remove();
                // }

                // Array.from($googleDiv.childNodes).forEach((node) => {
                //     if (node.nodeType === 3 && node.nodeValue.trim() !== '') {
                //         node.remove();
                //     }
                // });             
            };
        };

        addGoogleTranslateScript();
    }, []);

    return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;
