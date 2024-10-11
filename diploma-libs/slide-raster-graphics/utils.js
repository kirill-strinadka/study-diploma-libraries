export function norm(XY, width, height) {
    return [Math.ceil((10000 * XY[0]) / width), Math.ceil((10000 * XY[1]) / height)];
}

export function denorm(xy, width, height) {
    return [Math.ceil((xy[0] * width) / 10000), Math.ceil((xy[1] * height) / 10000)];
}