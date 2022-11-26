// ! VIDEO PLAYER

const videoPlayers = document.querySelectorAll('.video-player');
videoPlayers.forEach(videoPlayer => {
    const videoPlayerHtml = `
    <div class="spinner"></div>
    ${videoPlayer.innerHTML}
    <div class="progress-area-time"></div>

    <div class="controls">
        <div class="top">
            <span class="icon speed-btn"><b>1x</b></span>
        </div>

        <div class="middle">
            <span class="icon">
                <i class="material-symbols-rounded rewind">replay_10</i>
            </span>
            <span class="icon">
                <i class="material-symbols-rounded play">play_arrow</i>
            </span>
            <span class="icon">
                <i class="material-symbols-rounded forward">forward_10</i>
            </span>
        </div>

        <div class="bottom">
            <div class="timer">
                <span class="current">0:00</span> / <span class="duration">0:00</span>
            </div>

            <div class="bottom-icons">
                <span class="icon">
                    <i class="material-symbols-rounded captions">subtitles</i>
                </span>
                <span class="icon">
                    <i class="material-symbols-rounded fullscreen">fullscreen</i>
                </span>
            </div>
        </div>

        <div class="progress-area">
            <canvas class="buffered-bar"></canvas>
            <div class="progress-bar"></div>
            <div class="buffered-progress-bar"></div>
        </div>
    </div>
    `;
    // ! ALL ELEMENTS REQUIRED
    videoPlayer.innerHTML = videoPlayerHtml;
    
    const mainVideo = videoPlayer.querySelector('video'),
    progressAreaTime = videoPlayer.querySelector('.progress-area-time'),
    controls = videoPlayer.querySelector('.controls'),
    progressArea = videoPlayer.querySelector('.progress-area'),
    progressBar = videoPlayer.querySelector('.progress-bar'),
    progressBufferedBar = videoPlayer.querySelector('.buffered-progress-bar'),
    captionsBtn = videoPlayer.querySelector('.captions'),
    rewind = videoPlayer.querySelector('.rewind'),
    forward = videoPlayer.querySelector('.forward'),
    playPause = videoPlayer.querySelector('.play'),
    current = videoPlayer.querySelector('.current'),
    totalDuration = videoPlayer.querySelector('.duration'),
    fullscreen = videoPlayer.querySelector('.fullscreen'),
    bufferedBar= videoPlayer.querySelector('.buffered-bar'),
    spinner = videoPlayer.querySelector('.spinner'),
    speedBtn = videoPlayer.querySelector('.speed-btn');

    // ! Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case ' ':
            togglePlay();
            break;
        case 'arrowleft':
            skip(-10);
            break;
        case 'arrowright' :
            skip(10);
            break;
        case 'f':
            toggleFullScreen();
            break;
        case '0':
            skip(-100000000);
            break;
        case 'c':
            toggleCaptions();
            break;
    }
    });

    // * Buffering
    mainVideo.addEventListener('loadeddata',() => {
        setInterval(() =>{
            let bufferedTime = mainVideo.buffered.end(0);
            let duration = mainVideo.duration;
            let width = (bufferedTime / duration) * 100;
            progressBufferedBar.style.width = `${width}%`;
        }, 500);
    });

    mainVideo.addEventListener('waiting', () => {
        spinner.style.display = 'block';
    });

    mainVideo.addEventListener('canplay', () => {
        spinner.style.display = 'none';
    });

    function drawCanvas(canvas, buffered, duration) {
        let context = canvas.getContext('2d', {antialias : false});
        context.fillStyle = '#ded9d9';

        let height = canvas.height;
        let width = canvas.width;

        context.clearRect(0, 0, width, height);
        for (let i = 0; i < buffered.length; i++) {
            let leadingEdge = buffered.start(i) / duration * width;
            let trailingEdge = buffered.end(i) / duration * width;
            context.fillRect(leadingEdge, 0, trailingEdge - leadingEdge, height);
        }
    }

    mainVideo.addEventListener('progress', () => {
        drawCanvas(bufferedBar, mainVideo.buffered, mainVideo.duration);
    }, false);

    // * Captions
    const captions = mainVideo.textTracks[0];
    captions.mode = "hidden";

    captionsBtn.addEventListener('click', toggleCaptions);

    function toggleCaptions() {
        const isHidden = captions.mode === "hidden";
        captions.mode = isHidden ? "showing" : "hidden";
        captionsBtn.classList.toggle('active', isHidden);
    }

    // * Play/Pause
    function playVideo() {
        playPause.innerHTML = "pause";
        videoPlayer.classList.add("pause");
        mainVideo.play();
    }

    mainVideo.addEventListener('play', () => playVideo());
    mainVideo.addEventListener('pause', () => pauseVideo());

    function pauseVideo() {
        playPause.innerHTML = "play_arrow";
        videoPlayer.classList.remove("pause");
        mainVideo.pause();
    }

    function togglePlay() {
        const isVideoPaused = videoPlayer.classList.contains('pause');
        isVideoPaused ? pauseVideo() : playVideo();
    }

    playPause.addEventListener('click', () => {
        togglePlay();
    });

    // * Forward/Rewind
    function skip(time) {
        mainVideo.currentTime += time;
    }

    forward.addEventListener('click', () => skip(10));
    rewind.addEventListener('click', () => skip(-10));

    // * Video Duration
    mainVideo.addEventListener("loadeddata", (e) => {
        let videoDuration = e.target.duration;
        let totalMin = Math.floor(videoDuration / 60);
        let totalSec = Math.floor(videoDuration % 60);

        totalSec < 10 ? totalSec = "0" + totalSec : totalSec;
        totalDuration.innerHTML = `${totalMin}:${totalSec}`;
    });

    // * Current Duration
    mainVideo.addEventListener("timeupdate", (e) => {
        let currentVideoTime = e.target.currentTime;
        let currentMin = Math.floor(currentVideoTime / 60);
        let currentSec = Math.floor(currentVideoTime % 60);

        currentSec < 10? currentSec = "0" + currentSec : currentSec;
        current.innerHTML = `${currentMin}:${currentSec}`;

        let videoDuration = e.target.duration;
        let progressWidth = (currentVideoTime / videoDuration) * 100;
        progressBar.style.width = `${progressWidth}%`;
    });

    // * For current Time on hovering on progress bar
    progressArea.addEventListener('mousedown', (e) => {
        setTimelinePosition(e);
        progressArea.addEventListener("mousemove", setTimelinePosition);
        progressArea.addEventListener("mouseup", () => {
            progressArea.removeEventListener("mousemove", setTimelinePosition);
        });
    });

    function setTimelinePosition(e) {
        let videoDuration = mainVideo.duration;
        let progressWidthVal = progressArea.clientWidth + 2;
        let clickOffsetX = e.offsetX;
        mainVideo.currentTime = (clickOffsetX / progressWidthVal) * videoDuration;

        let progressWidth = (mainVideo.currentTime / videoDuration) * 100;
        progressBar.style.width = `${progressWidth}%`;

        let currentVideoTime = mainVideo.currentTime;
        let currentMin = Math.floor(currentVideoTime / 60);
        let currentSec = Math.floor(currentVideoTime % 60);

        currentSec < 10? currentSec = "0" + currentSec : currentSec;
        current.innerHTML = `${currentMin}:${currentSec}`;
    }

    // * Progress Time Area
    progressArea.addEventListener('mousemove', (e) => {
        let progressWidthVal = progressArea.clientWidth;
        let x = e.offsetX;
        progressAreaTime.style.setProperty('--x', `${x + 25}px`);
        progressAreaTime.style.display = `block`;

        let videoDuration = mainVideo.duration;
        let progressTime = Math.floor((x / progressWidthVal) * videoDuration);
        let currentMin = Math.floor(progressTime / 60);
        let currentSec = Math.floor(progressTime % 60);

        currentSec < 10? currentSec = "0" + currentSec : currentSec;
        progressAreaTime.innerHTML = `${currentMin}:${currentSec}`
    });

    progressArea.addEventListener('mouseleave', (e) => {
        progressAreaTime.style.display = `none`;
    });

    // * Full Screen
    function toggleFullScreen() {
        if(!videoPlayer.classList.contains('openFullScreen')) {
            videoPlayer.classList.add('openFullScreen');
            fullscreen.innerHTML = 'fullscreen_exit';
            videoPlayer.requestFullscreen();
        } else {
            videoPlayer.classList.remove('openFullScreen');
            fullscreen.innerHTML = 'fullscreen';
            document.exitFullscreen();
        }
    }

    if (screen.width > 1024) {
        function toggleFullScreen() {
            if(!videoPlayer.classList.contains('openFullScreen')) {
                videoPlayer.classList.add('openFullScreen');
                fullscreen.innerHTML = 'fullscreen_exit';
                videoPlayer.requestFullscreen();
            } else {
                videoPlayer.classList.remove('openFullScreen');
                fullscreen.innerHTML = 'fullscreen';
                document.exitFullscreen();
            }
        }
    } else {
        function toggleFullScreen() {
            if(!videoPlayer.classList.contains('openFullScreen')) {
                videoPlayer.classList.add('openFullScreen');
                fullscreen.innerHTML = 'fullscreen_exit';
                videoPlayer.requestFullscreen();
                screen.orientation.lock('landscape');
            } else {
                videoPlayer.classList.remove('openFullScreen');
                fullscreen.innerHTML = 'fullscreen';
                document.exitFullscreen();
                screen.orientation.unlock();
            }
        }

        videoPlayer.addEventListener('dblclick', toggleFullScreen);
    }

    fullscreen.addEventListener('click', () => {
        toggleFullScreen();
    });

    // Playback Speed
    speedBtn.addEventListener('click', () => changePlaybackSpeed());

    function changePlaybackSpeed() {
        let newplaybackRate = mainVideo.playbackRate + 0.25;
        if (newplaybackRate > 2) newplaybackRate = 0.5;
        mainVideo.playbackRate = newplaybackRate;
        speedBtn.textContent = newplaybackRate + "x";
    }

    // Store video duration in local storage
    window.addEventListener('unload', () => {
        let setDuration = localStorage.setItem('duration', `${mainVideo.currentTime}`);
        let setSrc = localStorage.setItem('src', `${mainVideo.getAttribute('src')}`);
    });

    window.addEventListener('load', () => {
        let getDuration = localStorage.getItem('duration');
        let getSrc = localStorage.getItem('src');
        if(getSrc) {
            mainVideo.src = getSrc;
            mainVideo.currentTime = getDuration;
        }
    });

    // * Show/Hide controls
    mainVideo.addEventListener('contextmenu', (e) => e.preventDefault());

    let timeout;
    function hideControls() {
        if(mainVideo.classList.contains('pause')) return;
        timeout = setTimeout(() => {
            controls.classList.remove('active');
        }, 2500);
    }

    hideControls();

    videoPlayer.addEventListener("mousemove", () => {
        controls.classList.add('active');
        clearTimeout(timeout);
        hideControls();
    });
});