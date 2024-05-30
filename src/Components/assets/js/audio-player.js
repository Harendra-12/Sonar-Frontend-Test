class CustomAudioPlayer extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
         <style>
            /* Add your custom styles here */
         </style>
         <div id="audio-player-container">
            <button id="play-pause-button"><i class="fa-regular fa-play"></i></button>
            <input type="range" id="volume-slider" max="100" value="100">
            <button id="download-button" title="Download"><i class="fa-regular fa-play"></i></button>
            <button id="archive-button" title="Archive"><i class="fa-regular fa-archive"></i></button>
         </div>
      `;

    this.audio = new Audio();
    this.playPauseButton = this.shadowRoot.getElementById("play-pause-button");
    this.volumeSlider = this.shadowRoot.getElementById("volume-slider");
    this.downloadButton = this.shadowRoot.getElementById("download-button");
    this.archiveButton = this.shadowRoot.getElementById("archive-button");

    this.setupEventListeners();
  }

  connectedCallback() {
    this.audio.src = this.getAttribute("data-src") || "";
  }

  setupEventListeners() {
    this.playPauseButton.addEventListener("click", () =>
      this.togglePlayPause()
    );
    this.volumeSlider.addEventListener("input", () => this.adjustVolume());
    this.downloadButton.addEventListener("click", () => this.downloadAudio());
    this.archiveButton.addEventListener("click", () => this.archiveAudio());
    this.audio.addEventListener("ended", () => this.handleAudioEnd());
  }

  togglePlayPause() {
    if (this.audio.paused) {
      this.audio.play();
      this.playPauseButton.className = "fa-regular fa-pause";
    } else {
      this.audio.pause();
      this.playPauseButton.className = "fa-regular fa-play";
    }
  }

  adjustVolume() {
    this.audio.volume = this.volumeSlider.value / 100;
  }

  downloadAudio() {
    // Implement download functionality if needed
    console.log("Download audio");
  }

  archiveAudio() {
    // Implement archive functionality if needed
    console.log("Archive audio");
  }

  handleAudioEnd() {
    // Reset play/pause button when audio ends
    this.playPauseButton.className = "fa-regular fa-play";
  }
}

customElements.define("custom-audio-player", CustomAudioPlayer);
