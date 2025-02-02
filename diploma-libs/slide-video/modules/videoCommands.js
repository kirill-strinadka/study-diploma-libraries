
export const videoButtons = [
    { label: '▶️', command: 'play', title: 'Play' },
    { label: '⏪ 2.5s', command: 'skipBackward', title: 'Skip backward' },
    { label: '🔙', command: 'onset', title: 'Rewind to start' },
    { label: '⏩ 2.5s', command: 'skipForward', title: 'Skip forward' },
    { label: '+0.2x', command: 'speedUp', title: 'Speed up' },
    { label: '-0.2x', command: 'slowDown', title: 'Slow down' }
];

export const videoCommands = {
    play: (videoElement) => videoElement.play(),
    pause: (videoElement) => videoElement.pause(),
    onset: (videoElement) => { videoElement.currentTime = 0; },
    skipForward: (videoElement) => { videoElement.currentTime += 2.5; },
    skipBackward: (videoElement) => { videoElement.currentTime -= 2.5; },
    speedUp: (videoElement) => {videoElement.playbackRate =
        Math.min(3.0, videoElement.playbackRate + 0.2); },
    slowDown: (videoElement) => {videoElement.playbackRate =
        Math.max(0.2, videoElement.playbackRate - 0.2);}

    // Добавляй новые команды сюда
};

export function executeCommandToVideo(videoElement, command) {
    if (videoCommands[command]) {
        videoCommands[command](videoElement);
    } else {
        console.error(`Команда "${command}" не распознана`);
    }
}
