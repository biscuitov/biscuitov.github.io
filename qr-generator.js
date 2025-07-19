class QRGenerator {
    constructor() {
        this.currentQRCode = null;
        this.currentSVG = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateRangeValues();
    }

    bindEvents() {
        const generateBtn = document.getElementById('generate-btn');
        const qrText = document.getElementById('qr-text');
        const sizeRange = document.getElementById('qr-size');
        const marginRange = document.getElementById('qr-margin');
        const downloadSVG = document.getElementById('download-svg');
        const downloadPNG = document.getElementById('download-png');

        generateBtn.addEventListener('click', () => this.generateQR());
        qrText.addEventListener('input', () => this.toggleGenerateButton());
        
        sizeRange.addEventListener('input', () => this.updateRangeValues());
        marginRange.addEventListener('input', () => this.updateRangeValues());

        downloadSVG.addEventListener('click', () => this.downloadSVG());
        downloadPNG.addEventListener('click', () => this.downloadPNG());

        this.bindColorPickers();
        this.toggleGenerateButton();
    }

    bindColorPickers() {
        const colorPickers = document.querySelectorAll('.color-picker');
        
        colorPickers.forEach(picker => {
            const options = picker.querySelectorAll('.color-option');
            const hiddenInput = picker.parentElement.querySelector('input[type="hidden"]');
            
            options.forEach(option => {
                option.addEventListener('click', () => {
                    options.forEach(opt => opt.setAttribute('data-active', 'false'));
                    option.setAttribute('data-active', 'true');
                    hiddenInput.value = option.getAttribute('data-color');
                });
            });
        });
    }

    updateRangeValues() {
        const sizeValue = document.getElementById('size-value');
        const marginValue = document.getElementById('margin-value');
        const sizeRange = document.getElementById('qr-size');
        const marginRange = document.getElementById('qr-margin');

        sizeValue.textContent = `${sizeRange.value}px`;
        marginValue.textContent = marginRange.value;
    }

    toggleGenerateButton() {
        const generateBtn = document.getElementById('generate-btn');
        const qrText = document.getElementById('qr-text');
        
        generateBtn.disabled = !qrText.value.trim();
    }

    generateQR() {
        const text = document.getElementById('qr-text').value.trim();
        const size = parseInt(document.getElementById('qr-size').value);
        const margin = parseInt(document.getElementById('qr-margin').value);
        const fgColor = document.getElementById('qr-fg-color').value;
        const bgColor = document.getElementById('qr-bg-color').value;

        if (!text) return;

        try {
            const qrDisplay = document.getElementById('qr-display');
            qrDisplay.innerHTML = '<div class="qr-placeholder">Generating...</div>';

            const qr = new QRious({
                value: text,
                size: size,
                background: bgColor === 'transparent' ? 'rgba(0,0,0,0)' : bgColor,
                foreground: fgColor,
                level: 'M',
                padding: margin * 8
            });

            const qrSVG = this.canvasToSVG(qr.canvas, fgColor, bgColor, size);
            
            qrDisplay.innerHTML = qrSVG;
            this.currentSVG = qrSVG;
            this.currentQRCode = text;

            this.enableDownloadButtons();

        } catch (error) {
            console.error('Error generating QR code:', error);
            const qrDisplay = document.getElementById('qr-display');
            qrDisplay.innerHTML = '<div class="qr-placeholder" style="color: red;">Error generating QR code</div>';
        }
    }

    canvasToSVG(canvas, fgColor, bgColor, size) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        const moduleSize = size / canvas.width;
        
        let svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
        
        if (bgColor !== 'transparent') {
            svgContent += `<rect width="100%" height="100%" fill="${bgColor}"/>`;
        }
        
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const index = (y * canvas.width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                const a = data[index + 3];
                
                if (a > 128 && r < 128 && g < 128 && b < 128) {
                    const rectX = x * moduleSize;
                    const rectY = y * moduleSize;
                    svgContent += `<rect x="${rectX}" y="${rectY}" width="${moduleSize}" height="${moduleSize}" fill="${fgColor}"/>`;
                }
            }
        }
        
        svgContent += '</svg>';
        return svgContent;
    }

    enableDownloadButtons() {
        document.getElementById('download-svg').disabled = false;
        document.getElementById('download-png').disabled = false;
    }

    downloadSVG() {
        if (!this.currentSVG) return;

        const blob = new Blob([this.currentSVG], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'qrcode.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    downloadPNG() {
        if (!this.currentSVG) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = parseInt(document.getElementById('qr-size').value);
        const bgColor = document.getElementById('qr-bg-color').value;
        
        canvas.width = size;
        canvas.height = size;

        if (bgColor === 'transparent') {
            ctx.clearRect(0, 0, size, size);
        } else {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, size, size);
        }

        const img = new Image();
        const svgBlob = new Blob([this.currentSVG], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            ctx.drawImage(img, 0, 0, size, size);
            
            canvas.toBlob((blob) => {
                const downloadUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = 'qrcode.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(downloadUrl);
            }, 'image/png');
            
            URL.revokeObjectURL(url);
        };

        img.src = url;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof QRious !== 'undefined') {
        new QRGenerator();
    } else {
        const script = document.querySelector('script[src*="qrious"]');
        if (script) {
            script.addEventListener('load', () => {
                new QRGenerator();
            });
        }
    }
});