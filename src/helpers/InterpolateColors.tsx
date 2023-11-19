const interpolateRGBA = (color1: number[], color2: number[], factor: number): string => {
    const interpolatedColor = color1.map((channel, index) => Math.ceil(channel + factor * (color2[index] - channel)));
    return `rgba(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]}, 0.8)`;
};
  
const calculateRGBA = (srm: number): string => {
    const srmColors = [
      [255, 204, 102],
      [255, 191, 51],
      [255, 179, 0],
      [255, 153, 0],
      [255, 128, 0],
      [245, 123, 0],
      [235, 118, 0],
      [224, 112, 0],
      [214, 107, 0],
      [204, 102, 0],
      [194, 97, 0],
      [184, 92, 0],
      [173, 87, 0],
      [163, 82, 0],
      [153, 77, 0],
      [143, 71, 0],
      [133, 66, 0],
      [123, 61, 0],
      [113, 56, 0],
    ];
  
    const scale = srmColors.length - 1;
    const factor = (srm / 40) * scale;
    const colorIndex = Math.floor(factor);
    const remainder = factor - colorIndex;
  
    const color1 = srmColors[colorIndex];
    const color2 = srmColors[colorIndex + 1] || srmColors[colorIndex]; // Use the last color if we're at the end
  
    return interpolateRGBA(color1, color2, remainder);
};
  
export const getRGBAArrayForSRM = (size: number): string[] => {
    const rgbaArray = [];

    for (let i = 0; i < size; i++) {
        const srmValue = (i / size) * 40; // Distribute SRM values across the array
        const rgba = calculateRGBA(srmValue);
        rgbaArray.push(rgba);
    }

    return rgbaArray;
};
  