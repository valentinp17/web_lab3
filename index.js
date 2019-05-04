let canvas = document.createElement("canvas");
canvas.width = 500;
canvas.height = 500;
document.body.appendChild(canvas);

let ctx = canvas.getContext("2d");

const FONT_SIZE = 30;
ctx.font = `bold ${FONT_SIZE}px Comic Sans MS`;
ctx.textAlign = 'center';
ctx.verticalAlign = 'middle';
ctx.textBaseline = 'top';

let imageSize = {
    width: 250,
    height: 250
};

let promises = Array(4).fill(0).map(a => new Promise((resolve, reject) => {
    let image = new Image();
    image.onload = () => resolve(image);
    image.crossOrigin = "anonymous";
    image.src = `https://source.unsplash.com/collection/1127156/${imageSize.width}x${imageSize.height}?r=${Math.random()}`
}));

let imageArrayPromise = Promise.all(promises);
let textPromise = $.ajax(`https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&format=text&lang=ru&key=${Math.random()}`);

imageArrayPromise.then(images => {
    ctx.drawImage(images[0], 0, 0);
    ctx.drawImage(images[1], canvas.width / 2, 0);
    ctx.drawImage(images[2], 0, canvas.height / 2);
    ctx.drawImage(images[3], canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    textPromise.then(textResponse => {
      let text = formatText(canvas.getContext("2d"), textResponse, canvas.width*2/3);

      ctx.fillStyle = '#000';

      let middleLineNumber = text.length / 2;
      for (let i = 0; i < text.length; i++) {
          ctx.fillText(text[i], canvas.width / 2, canvas.height / 2 - FONT_SIZE * middleLineNumber + FONT_SIZE * i);
      }

      //Download button
      let link = window.document.createElement('a');
      link.innerHTML = 'download image';
      link.href = canvas.toDataURL();
      link.download = "quote.png";
      window.document.body.appendChild(link);

    })
});

function formatText(context, text, maxWidth) {
    let words = text.split(" ");
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        let word = words[i];
        let width = context.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }

    lines.push(currentLine);
    return lines;
};
