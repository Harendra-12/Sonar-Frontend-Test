(function () {
    if (window.clickToCallWidgetLoaded) return;
    window.clickToCallWidgetLoaded = true;

    // Create a container for the widget
    const container = document.createElement('div');
    container.id = 'click-to-call-container';
    document.body.appendChild(container);

    // Create the toggle button
    const button = document.createElement('button');
    button.id = 'click-to-call-button';
    // button.textContent = 'Click to Call'; // Customize button text
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.backgroundColor = '#007bff'; // Customize color
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '50%';
    button.style.cursor = 'pointer';
    button.style.zIndex = 1001; // Ensure it's above the iframe
    button.style.width="60px";
    button.style.height="60px";
    button.style.display="flex";
    button.style.justifyContent="center";
    button.style.alignItems="center";   

    const buttonIcon = document.createElement('i');

    buttonIcon.classList.add("fa-solid", "fa-phone");
    buttonIcon.style.fontSize='27px';
    buttonIcon.style.lineHeight='60px';
    buttonIcon.style.color='#fff';

    button.appendChild(buttonIcon);

    // Append the button to the container
    container.appendChild(button);

    // Create the iframe (hidden by default)
    const iframe = document.createElement('iframe');
    
    const scripts = document.getElementsByTagName('script');
    const currentScript = scripts[scripts.length - 1]; // Current script
    const scriptSrc = currentScript.src;
    const params = new URLSearchParams(new URL(scriptSrc).search);
    const dynamicId = params.get('id') || '10'; // Default fallback
    console.log("This is id", dynamicId);

    // Update iframe src to include the dynamic ID
    iframe.src = `https://demo.webvio.in/click-to-call?id=${dynamicId}`;
    iframe.style.position = 'fixed';
    iframe.style.bottom = '70px';
    iframe.style.right = '10px';
    iframe.style.width = "365px";
    iframe.style.height = "430px";
    iframe.style.border = 'none';
    iframe.style.display = 'none'; // Initially hidden
    iframe.style.zIndex = 1000; // Below the button

    // Append the iframe to the container
    container.appendChild(iframe);

    // Add click event to toggle button
    button.addEventListener('click', function () {
        if (iframe.style.display === 'none') {
            iframe.style.display = 'block'; // Show widget
            // button.textContent = 'Close'; // Update button text
            buttonIcon.classList.remove("fa-phone");
            buttonIcon.classList.add("fa-xmark");
        } else {
            iframe.style.display = 'none'; // Hide widget
            // button.textContent = 'Click to Call'; // Restore button text
            buttonIcon.classList.add("fa-phone");
            buttonIcon.classList.remove("fa-xmark");
        }
    });

    const fontAwes = '<link rel="stylesheet" href="https://site-assets.fontawesome.com/releases/v6.7.2/css/all.css">';

    document.head.insertAdjacentHTML('beforeend', fontAwes);
})();
