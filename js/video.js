const videoPlayerHtml = `
<div class="spinner"></div>
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

export {videoPlayerHtml};