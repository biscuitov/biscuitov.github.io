class TextTools {
    constructor() {
        this.qrGenerator = new QRGenerator();
        this.markdownPreview = new MarkdownPreview();
        this.htmlPreview = new HTMLPreview();
        this.tokenCounter = new TokenCounter();
        this.setupFloatingNav();
    }

    setupFloatingNav() {
        const nav = document.getElementById('floating-nav');
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.tool-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeItem = document.querySelector(`.nav-item[data-section="${entry.target.id}"]`);
                    navItems.forEach(item => item.classList.remove('active'));
                    if (activeItem) activeItem.classList.add('active');
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(section => observer.observe(section));

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = item.getAttribute('data-section');
                const section = document.getElementById(sectionId);
                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    const windowHeight = window.innerHeight;
                    const scrollTo = sectionTop - (windowHeight / 2) + (sectionHeight / 2);
                    
                    window.scrollTo({
                        top: Math.max(0, scrollTo),
                        behavior: 'smooth'
                    });
                }
            });
        });

        let hideTimeout;
        
        const showNav = () => {
            clearTimeout(hideTimeout);
            nav.classList.remove('hidden');
        };

        const hideNav = () => {
            hideTimeout = setTimeout(() => nav.classList.add('hidden'), 3000);
        };

        const navArea = document.createElement('div');
        navArea.style.cssText = 'position: fixed; left: 0; top: 0; width: 120px; height: 100vh; z-index: 999; pointer-events: auto;';
        document.body.appendChild(navArea);

        document.addEventListener('scroll', showNav);
        navArea.addEventListener('mouseenter', showNav);
        nav.addEventListener('mouseenter', showNav);
        nav.addEventListener('mouseleave', hideNav);
        navArea.addEventListener('mouseleave', hideNav);
        
        showNav();
    }
}

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
        const generateBtn = document.getElementById('generate-qr');
        const qrText = document.getElementById('qr-text');
        const sizeRange = document.getElementById('qr-size');
        const marginRange = document.getElementById('qr-margin');
        const downloadSVG = document.getElementById('download-svg');
        const downloadPNG = document.getElementById('download-png');

        if (generateBtn) generateBtn.addEventListener('click', () => this.generateQR());
        if (qrText) qrText.addEventListener('input', () => this.toggleGenerateButton());
        
        if (sizeRange) sizeRange.addEventListener('input', () => this.updateRangeValues());
        if (marginRange) marginRange.addEventListener('input', () => this.updateRangeValues());

        if (downloadSVG) downloadSVG.addEventListener('click', () => this.downloadSVG());
        if (downloadPNG) downloadPNG.addEventListener('click', () => this.downloadPNG());

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
                    if (hiddenInput) hiddenInput.value = option.getAttribute('data-color');
                });
            });
        });
    }

    updateRangeValues() {
        const sizeValue = document.getElementById('size-value');
        const marginValue = document.getElementById('margin-value');
        const sizeRange = document.getElementById('qr-size');
        const marginRange = document.getElementById('qr-margin');

        if (sizeValue && sizeRange) sizeValue.textContent = `${sizeRange.value}px`;
        if (marginValue && marginRange) marginValue.textContent = marginRange.value;
    }

    toggleGenerateButton() {
        const generateBtn = document.getElementById('generate-qr');
        const qrText = document.getElementById('qr-text');
        
        if (generateBtn && qrText) {
            generateBtn.disabled = !qrText.value.trim();
        }
    }

    generateQR() {
        const text = document.getElementById('qr-text')?.value.trim();
        const size = parseInt(document.getElementById('qr-size')?.value || 300);
        const margin = parseInt(document.getElementById('qr-margin')?.value || 2);
        const fgColor = document.getElementById('qr-fg-color')?.value || '#000000';
        const bgColor = document.getElementById('qr-bg-color')?.value || '#ffffff';

        if (!text) return;

        try {
            const qrDisplay = document.getElementById('qr-display');
            if (qrDisplay) qrDisplay.innerHTML = '<div class="qr-placeholder">Generating...</div>';

            const qr = new QRious({
                value: text,
                size: size,
                background: bgColor === 'transparent' ? 'rgba(0,0,0,0)' : bgColor,
                foreground: fgColor,
                level: 'M',
                padding: margin * 8
            });

            const qrSVG = this.canvasToSVG(qr.canvas, fgColor, bgColor, size);
            
            if (qrDisplay) {
                qrDisplay.innerHTML = qrSVG;
                this.currentSVG = qrSVG;
                this.currentQRCode = text;
                this.enableDownloadButtons();
            }

        } catch (error) {
            console.error('Error generating QR code:', error);
            const qrDisplay = document.getElementById('qr-display');
            if (qrDisplay) qrDisplay.innerHTML = '<div class="qr-placeholder" style="color: red;">Error generating QR code</div>';
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
        const downloadSVG = document.getElementById('download-svg');
        const downloadPNG = document.getElementById('download-png');
        
        if (downloadSVG) downloadSVG.disabled = false;
        if (downloadPNG) downloadPNG.disabled = false;
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
        const size = parseInt(document.getElementById('qr-size')?.value || 300);
        const bgColor = document.getElementById('qr-bg-color')?.value || '#ffffff';
        
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

class MarkdownPreview {
    constructor() {
        this.init();
    }

    init() {
        const markdownInput = document.getElementById('markdown-input');
        const markdownPreview = document.getElementById('markdown-preview');
        
        if (markdownInput && markdownPreview) {
            markdownInput.addEventListener('input', () => this.updatePreview());
        }
    }

    updatePreview() {
        const markdownInput = document.getElementById('markdown-input');
        const markdownPreview = document.getElementById('markdown-preview');
        
        if (!markdownInput || !markdownPreview) return;
        
        const markdownText = markdownInput.value;
        
        if (!markdownText.trim()) {
            markdownPreview.innerHTML = '<p style="color: var(--text-muted); font-style: italic;"><span data-lang="en">Markdown preview will appear here</span><span data-lang="ru">Превью markdown появится здесь</span></p>';
            return;
        }

        try {
            if (typeof marked !== 'undefined') {
                const html = marked.parse(markdownText);
                markdownPreview.innerHTML = html;
            } else {
                markdownPreview.innerHTML = '<p style="color: red;">Markdown library not loaded</p>';
            }
        } catch (error) {
            console.error('Error parsing markdown:', error);
            markdownPreview.innerHTML = '<p style="color: red;">Error parsing markdown</p>';
        }
    }
}

class HTMLPreview {
    constructor() {
        this.init();
    }

    init() {
        const htmlInput = document.getElementById('html-input');
        
        if (htmlInput) {
            htmlInput.addEventListener('input', () => this.updatePreview());
        }
    }

    updatePreview() {
        const htmlInput = document.getElementById('html-input');
        const htmlPreview = document.getElementById('html-preview');
        
        if (!htmlInput || !htmlPreview) return;
        
        const htmlCode = htmlInput.value;
        
        if (!htmlCode.trim()) {
            htmlPreview.srcdoc = '';
            return;
        }

        try {
            htmlPreview.srcdoc = htmlCode;
        } catch (error) {
            console.error('Error displaying HTML:', error);
        }
    }
}

class TokenCounter {
    constructor() {
        this.modelPricing = {
            'claude-4-sonnet': { input: 0.005, output: 0.025 },
            'claude-4-opus': { input: 0.015, output: 0.075 },
            'claude-3-5-sonnet': { input: 0.003, output: 0.015 },
            'claude-3-haiku': { input: 0.00025, output: 0.00125 },
            'gpt-4.1': { input: 0.035, output: 0.07 },
            'gpt-4': { input: 0.03, output: 0.06 },
            'gpt-o4-mini': { input: 0.005, output: 0.01 },
            'gpt-o4-mini-high': { input: 0.008, output: 0.015 },
            'gpt-3.5-turbo': { input: 0.0015, output: 0.002 }
        };
        this.init();
    }

    init() {
        const tokenInput = document.getElementById('token-input');
        const modelSelect = document.getElementById('model-select');
        
        if (tokenInput) {
            tokenInput.addEventListener('input', () => this.updateCounts());
        }
        
        if (modelSelect) {
            modelSelect.addEventListener('change', () => this.updateCounts());
        }
        
        this.updateCounts();
    }

    updateCounts() {
        const tokenInput = document.getElementById('token-input');
        const modelSelect = document.getElementById('model-select');
        
        if (!tokenInput) return;
        
        const text = tokenInput.value;
        const selectedModel = modelSelect?.value || 'gpt-4';
        
        const charCount = text.length;
        const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const tokenCount = this.estimateTokens(text, selectedModel);
        const cost = this.calculateCost(tokenCount, selectedModel);
        
        this.updateDisplay('char-count', charCount.toLocaleString());
        this.updateDisplay('word-count', wordCount.toLocaleString());
        this.updateDisplay('token-count', tokenCount.toLocaleString());
        this.updateDisplay('cost-estimate', `$${cost.toFixed(4)}`);
    }

    estimateTokens(text, model) {
        if (!text.trim()) return 0;
        
        if (model.includes('claude')) {
            return Math.ceil(text.length / 3.5);
        }
        
        return Math.ceil(text.length / 4);
    }

    calculateCost(tokens, model) {
        const pricing = this.modelPricing[model];
        if (!pricing) return 0;
        
        return (tokens / 1000) * pricing.input;
    }

    updateDisplay(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const checkLibraries = () => {
        const qriousLoaded = typeof QRious !== 'undefined';
        const markedLoaded = typeof marked !== 'undefined';
        
        if (qriousLoaded && markedLoaded) {
            new TextTools();
        } else {
            setTimeout(checkLibraries, 100);
        }
    };
    
    checkLibraries();
});