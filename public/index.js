let bufferState = '';

const price = new IMask(
    document.querySelector('.price'),
    {
      mask: '00[000][,][00]',
      overwrite: 'shift'
    }
)

const number = new IMask(
    document.querySelector('.number'),
    {
        mask: '[000][ ][000][ ][000]',
      min: 0,
      max: 1000000,
    }
)

const przelew = {
    number: '',
    price: 0,
}


function generateImgPrzelew() {
    przelew.price = `${price.value.includes(',') ? price.value : price.value + ',00'}`
    przelew.number = PrzelewForm.querySelector('.number').value;

    const obj = {
        "files": [ 
            "https://raw.githubusercontent.com/mamut1112/p/main/assets/1.2.psd"
        ],
        "resources": [
            "https://raw.githubusercontent.com/mamut1112/p/main/assets/0.otf",
            "https://raw.githubusercontent.com/mamut1112/p/main/assets/1.ttf"
        ],
        "environment": {
    
        },
        "script" : `
        a = app.activeDocument.layers.getByName('price'); a.textItem.contents = '${przelew.price}';
        a = app.activeDocument.layers.getByName('number'); a.textItem.contents = '${przelew.number}';
        app.echoToOE('przelew');
        app.activeDocument.saveToOE("png");`
    }
    const url = encodeURI(`https://www.photopea.com#${JSON.stringify(obj)}`)
    console.log(url)
    // delete and create new iframe el
    // downloadBtn.style.display = "none"
    //     copyBtn.style.display = "none"
    if (document.querySelector('.iframe')) {
        document.querySelector('.iframe').remove()
    }
    const iframe = document.createElement('iframe')
    iframe.className = "iframe"
    iframe.style.display = "none"
    iframe.src = url
    const place = document.querySelector(".iframe-place-check")
    place.append(iframe)
}

window.addEventListener("message", function(e) {
    console.log(e.target.tagName) 
    if (e.data != 'done') {
        switch (e.data) {
            case 'przelew':
                bufferState = 'przelew'
                break;
        }
        var arrayBufferView = new Uint8Array(e.data);
        var blob = new Blob([arrayBufferView], {type: "image/jpeg"});
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(blob);
        switch (bufferState) {
            case 'przelew':
                var img = document.querySelector("#photoPrzelew");
                img.src = imageUrl;
                // downloadBtn.style.display = "inline-block"
                // copyBtn.style.display = "inline-block"
                linkPrzelew.download = `${przelew.price}`
                linkPrzelew.href = imageUrl;
                console.log(imageUrl)
                break;
        }
    }
    console.log(e) 
});

let linkPrzelew = document.querySelector("#linkPrzelew");

const img = new Image();
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

PrzelewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    generateImgPrzelew();
});

photoPrzelew.addEventListener("click", function (e) {
    copyToClipboard(linkPrzelew.href);
})

async function copyToClipboard(src) {
    const image = await writeToCanvas(src);
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          [image.type]: image,
        })
      ]);
  
      console.log("Success copy");
    } catch(e) {
      console.log("Copy failed: " + e);
    }
}

function writeToCanvas(src) {
    return new Promise((res, rej) => {
      img.src = src;
      img.onload = function() {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img,0,0)
        canvas.toBlob((blob) => {
          res(blob);
        }, 'image/png');
      }
    });
}
