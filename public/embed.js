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
    button.textContent = 'Click to Call'; // Customize button text
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#007bff'; // Customize color
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = 1001; // Ensure it's above the iframe

    // Append the button to the container
    container.appendChild(button);

    // Create the iframe (hidden by default)
    const iframe = document.createElement('iframe');
    // Get dynamic ID from the window object (set by React)
    const dynamicId = window.dynamicId || 10; // Fallback to 10 if undefined

    // Update iframe src to include the dynamic id
    iframe.src = `https://localhost:3000/click-to-call?id=${dynamicId}`;
    iframe.style.position = 'fixed';
    iframe.style.bottom = '10px';
    iframe.style.right = '10px';
    iframe.style.width = "365px";
    iframe.style.height = "500px";
    iframe.style.border = 'none';
    iframe.style.display = 'none'; // Initially hidden
    iframe.style.zIndex = 1000; // Below the button

    // Append the iframe to the container
    container.appendChild(iframe);

    // Add click event to toggle button
    button.addEventListener('click', function () {
        if (iframe.style.display === 'none') {
            iframe.style.display = 'block'; // Show widget
            button.textContent = 'Close'; // Update button text
        } else {
            iframe.style.display = 'none'; // Hide widget
            button.textContent = 'Click to Call'; // Restore button text
        }
    });
})();
