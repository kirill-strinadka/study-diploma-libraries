
export const videoCommands = {
    play: (videoElement) => videoElement.play(),
    pause: (videoElement) => videoElement.pause(),
    onset: (videoElement) => { videoElement.currentTime = 0; },
    // Добавляй новые команды сюда
};

export function executeCommandToVideo(videoElement, command) {
    if (videoCommands[command]) {
        videoCommands[command](videoElement);
    } else {
        console.error(`Команда "${command}" не распознана`);
    }
}
