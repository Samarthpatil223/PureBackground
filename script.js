let uploadedImageElement = document.getElementById('uploadedImage');
let outputCanvas = document.getElementById('outputCanvas');

document.getElementById('upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        uploadedImageElement.src = e.target.result;
        uploadedImageElement.style.display = 'block';
        outputCanvas.style.display = 'none';
    };
    
    reader.readAsDataURL(file);
});

document.getElementById('removeBgBtn').addEventListener('click', async function() {
    const net = await bodyPix.load();
    const segmentation = await net.segmentPerson(uploadedImageElement);

    const ctx = outputCanvas.getContext('2d');
    outputCanvas.width = uploadedImageElement.width;
    outputCanvas.height = uploadedImageElement.height;

    ctx.drawImage(uploadedImageElement, 0, 0);
    const imageData = ctx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);

    for (let i = 0; i < imageData.data.length; i += 4) {
        if (segmentation.data[i / 4] === 0) {
            imageData.data[i + 3] = 0;  // Set alpha to 0
        }
    }

    ctx.putImageData(imageData, 0, 0);
    outputCanvas.style.display = 'block';
});

document.getElementById('resetBtn').addEventListener('click', function() {
    uploadedImageElement.src = '';
    uploadedImageElement.style.display = 'none';
    outputCanvas.style.display = 'none';
});
