export const changeColor = (hexColor: string, magnitude: number) => {
  hexColor = hexColor.replace(`#`, ``);

  if (hexColor.length <= 6) {
    const decimalColor = parseInt(hexColor, 16);
    // console.log('r: ', decimalColor >> 16);
    // console.log('g: ', decimalColor & 0x0000ff);
    // console.log('b: ', (decimalColor >> 8) & 0x00ff);
    const maxChange = magnitude;

    // if (magnitude <= 0) {
    //   let smallestValue = decimalColor >> 16;
    //   if (smallestValue > (decimalColor & 0x0000ff))
    //     smallestValue = decimalColor & 0x0000ff;
    //   if (smallestValue > ((decimalColor >> 8) & 0x00ff))
    //     smallestValue = (decimalColor >> 8) & 0x00ff;
    //
    //   if (magnitude > smallestValue) maxChange = smallestValue;
    // }

    let r = (decimalColor >> 16) + maxChange;
    r > 255 && (r = 255);
    r < 0 && (r = 0o0);

    let g = (decimalColor & 0x0000ff) + maxChange;
    g > 255 && (g = 255);
    g < 0 && (g = 0o0);

    let b = ((decimalColor >> 8) & 0x00ff) + maxChange;
    b > 255 && (b = 255);
    b < 0 && (b = 0o0);

    console.log('r: ', r);
    console.log('g: ', g);
    console.log('b: ', b);
    console.log('hexcode: ', `#${(g | (b << 8) | (r << 16)).toString(16)}`);
    return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
  } else {
    return hexColor;
  }
};

export const LightenDarkenColor = (col, amt) => {
  let usePound = false;

  if (col[0] == '#') {
    col = col.slice(1);
    usePound = true;
  }

  const num = parseInt(col, 16);

  let r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  let b = ((num >> 8) & 0x00ff) + amt;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  let g = (num & 0x0000ff) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
};

export const LightenColor = (color: string, percent: number) => {
  const num = parseInt(color.replace('#', ''), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = ((num >> 8) & 0x00ff) + amt,
    G = (num & 0x0000ff) + amt;
  console.log(
    'lightenColor hexcode: ',
    '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
        (G < 255 ? (G < 1 ? 0 : G) : 255)
      )
        .toString(16)
        .slice(1),
  );
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
      (G < 255 ? (G < 1 ? 0 : G) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

export const getAlpha = (hex: string, opacity: number) => {
  // coerce values so it is between 0 and 1.
  const alpha = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);

  return `${hex}${Math.floor(alpha * 255)
    .toString(16)
    .padStart(2, '0')}`;
};
