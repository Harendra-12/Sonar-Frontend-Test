import { useEffect } from "react";

const GoogleTranslate = () => {
<<<<<<< Updated upstream
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
    
=======
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
          const iframeDocument =
            iframe.contentDocument || iframe.contentWindow.document;

          const observer = new MutationObserver(() => {
            const languageSelect = iframeDocument.querySelector(
              ".goog-te-menu2-item-selected"
            );
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
        script.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    addGoogleTranslateScript();

    // Optional cleanup
    return () => {
      const script = document.querySelector(
        "script[src*='translate_a/element.js']"
      );
      if (script) script.remove();
    };
  }, []);

  return (
    // <Rnd
    //     minWidth={"300px"}
    //     minHeight={"450px"}
    //     maxWidth={"300px"}
    //     maxHeight={"450px"}
    //     dragHandleClassName="drag-handle" // Specify draggable area
    // >
    //     <div
    //         style={{
    //             background: "transparent",
    //             position: "relative",
    //             zIndex: "999",
    //         }}
    //     >
    //         {/* Draggable Top Area */}
    //         <div
    //             id="google_translate_element"
    //             className="drag-handle"
    //             style={{
    //                 position: "absolute",
    //                 top: "35px",
    //                 width: "100%",
    //                 height: "105px",
    //                 zIndex: "999999",
    //                 background: "transparent",
    //                 cursor: "move",
    //             }}
    //         ></div>
    //     </div>
    // </Rnd>

    <div className="sticky-icon">
      <div id="google_translate_element"></div>
      <div class="">
      <i class="fa-solid fa-gears"></i>
      </div>
    </div>
  );
>>>>>>> Stashed changes
};

{/* <div class="sticky-icon">
   <a href="https://www.instagram.com/?hl=en" class="Instagram"><i class="fab fa-instagram"></i> Instagram </a>
     
</div> */}

export default GoogleTranslate;
