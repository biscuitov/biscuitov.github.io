class CodeTools {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupRegexTester();
        this.setupJsonProcessor();
    }

    bindEvents() {
        const regexPattern = document.getElementById('regex-pattern');
        const regexTestText = document.getElementById('regex-test-text');
        const regexFlags = document.querySelectorAll('.flag-option input');
        const flagOptions = document.querySelectorAll('.flag-option');

        const formatJsonBtn = document.getElementById('format-json');
        const minifyJsonBtn = document.getElementById('minify-json');
        const validateJsonBtn = document.getElementById('validate-json');
        const jsonToXmlBtn = document.getElementById('json-to-xml');
        const toolOptions = document.querySelectorAll('.tool-option');

        regexPattern.addEventListener('input', () => this.testRegex());
        regexTestText.addEventListener('input', () => this.testRegex());
        
        regexFlags.forEach(flag => {
            flag.addEventListener('change', () => this.testRegex());
        });

        flagOptions.forEach(option => {
            const label = option.querySelector('.flag-pill');
            const input = option.querySelector('input');
            
            label.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                input.checked = !input.checked;
                this.testRegex();
            });
            
            label.addEventListener('mousedown', (e) => {
                e.preventDefault();
            });
        });

        toolOptions.forEach(option => {
            const label = option.querySelector('.tool-pill');
            const input = option.querySelector('input');
            
            label.addEventListener('click', () => {
                document.querySelectorAll('.tool-pill').forEach(pill => pill.classList.remove('active'));
                label.classList.add('active');
                input.checked = true;
                
                const toolId = input.id;
                switch(toolId) {
                    case 'format-json':
                        this.formatJson();
                        break;
                    case 'minify-json':
                        this.minifyJson();
                        break;
                    case 'validate-json':
                        this.validateJson();
                        break;
                    case 'json-to-xml':
                        this.jsonToXml();
                        break;
                }
            });
        });
    }

    setupRegexTester() {
        const output = document.getElementById('regex-output');
        output.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 2rem;">Enter a regex pattern and test text to see matches</div>';
    }

    setupJsonProcessor() {
        const output = document.getElementById('json-output');
        output.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 2rem;">Enter JSON or XML data and use the tools above</div>';
    }

    testRegex() {
        const pattern = document.getElementById('regex-pattern').value;
        const testText = document.getElementById('regex-test-text').value;
        const output = document.getElementById('regex-output');

        if (!pattern || !testText) {
            output.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 2rem;">Enter both pattern and test text</div>';
            return;
        }

        try {
            const flags = this.getRegexFlags();
            const regex = new RegExp(pattern, flags);
            
            if (flags.includes('g')) {
                const matches = Array.from(testText.matchAll(regex));
                this.displayMatches(matches, testText, regex);
            } else {
                const match = testText.match(regex);
                this.displayMatches(match ? [match] : [], testText, regex);
            }
        } catch (error) {
            output.innerHTML = `<div class="error-output">Invalid regex: ${error.message}</div>`;
        }
    }

    getRegexFlags() {
        let flags = '';
        if (document.getElementById('flag-g').checked) flags += 'g';
        if (document.getElementById('flag-i').checked) flags += 'i';
        if (document.getElementById('flag-m').checked) flags += 'm';
        return flags;
    }

    displayMatches(matches, testText, regex) {
        const output = document.getElementById('regex-output');
        
        if (matches.length === 0) {
            output.innerHTML = '<div style="color: var(--text-muted); padding: 1rem;">No matches found</div>';
            return;
        }

        let highlightedText = testText;
        let offset = 0;

        matches.forEach(match => {
            const start = match.index + offset;
            const end = start + match[0].length;
            const highlighted = `<span class="match-highlight">${match[0]}</span>`;
            
            highlightedText = highlightedText.slice(0, start) + highlighted + highlightedText.slice(end);
            offset += highlighted.length - match[0].length;
        });

        const matchInfo = matches.map((match, index) => {
            let info = `<strong>Match ${index + 1}:</strong> "${match[0]}"`;
            if (match.index !== undefined) {
                info += ` <em>(position ${match.index})</em>`;
            }
            if (match.length > 1) {
                info += '<br><strong>Groups:</strong> ' + match.slice(1).map((group, i) => `$${i + 1}: "${group || ''}"`).join(', ');
            }
            return info;
        }).join('<br><br>');

        output.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <strong>Highlighted Text:</strong><br>
                <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 6px; margin-top: 0.5rem; white-space: pre-wrap; font-family: 'JetBrains Mono', monospace;">${highlightedText}</div>
            </div>
            <div>
                <strong>Match Details:</strong><br>
                <div style="margin-top: 0.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem;">${matchInfo}</div>
            </div>
        `;
    }

    formatJson() {
        const input = document.getElementById('json-input').value.trim();
        const output = document.getElementById('json-output');

        if (!input) {
            output.innerHTML = '<div style="color: var(--text-muted); padding: 1rem;">Enter JSON data to format</div>';
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 2);
            output.innerHTML = `<pre style="margin: 0; white-space: pre-wrap; font-family: 'JetBrains Mono', monospace;">${this.escapeHtml(formatted)}</pre>`;
        } catch (error) {
            output.innerHTML = `<div class="error-output">Invalid JSON: ${error.message}</div>`;
        }
    }

    minifyJson() {
        const input = document.getElementById('json-input').value.trim();
        const output = document.getElementById('json-output');

        if (!input) {
            output.innerHTML = '<div style="color: var(--text-muted); padding: 1rem;">Enter JSON data to minify</div>';
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            output.innerHTML = `<pre style="margin: 0; white-space: pre-wrap; font-family: 'JetBrains Mono', monospace;">${this.escapeHtml(minified)}</pre>`;
        } catch (error) {
            output.innerHTML = `<div class="error-output">Invalid JSON: ${error.message}</div>`;
        }
    }

    validateJson() {
        const input = document.getElementById('json-input').value.trim();
        const output = document.getElementById('json-output');

        if (!input) {
            output.innerHTML = '<div style="color: var(--text-muted); padding: 1rem;">Enter JSON data to validate</div>';
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const stats = this.getJsonStats(parsed);
            output.innerHTML = `
                <div style="color: #22c55e; padding: 1rem; background: var(--bg-secondary); border-radius: 6px;">
                    <strong>✓ Valid JSON</strong><br>
                    <div style="margin-top: 0.5rem; font-size: 0.85rem;">
                        ${stats}
                    </div>
                </div>
            `;
        } catch (error) {
            output.innerHTML = `<div class="error-output">Invalid JSON: ${error.message}</div>`;
        }
    }

    getJsonStats(obj, depth = 0) {
        if (typeof obj !== 'object' || obj === null) {
            return `Type: ${typeof obj}`;
        }

        if (Array.isArray(obj)) {
            return `Array with ${obj.length} elements`;
        }

        const keys = Object.keys(obj);
        let stats = `Object with ${keys.length} properties`;
        
        if (depth === 0 && keys.length > 0) {
            stats += `<br>Properties: ${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}`;
        }

        return stats;
    }

    jsonToXml() {
        const input = document.getElementById('json-input').value.trim();
        const output = document.getElementById('json-output');

        if (!input) {
            output.innerHTML = '<div style="color: var(--text-muted); padding: 1rem;">Enter JSON data to convert to XML</div>';
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const xml = this.convertToXml(parsed);
            output.innerHTML = `<pre style="margin: 0; white-space: pre-wrap; font-family: 'JetBrains Mono', monospace;">${this.escapeHtml(xml)}</pre>`;
        } catch (error) {
            output.innerHTML = `<div class="error-output">Invalid JSON: ${error.message}</div>`;
        }
    }

    convertToXml(obj, rootName = 'root', indent = 0) {
        const spaces = '  '.repeat(indent);
        
        if (typeof obj !== 'object' || obj === null) {
            return `${spaces}<${rootName}>${this.escapeXml(String(obj))}</${rootName}>`;
        }

        if (Array.isArray(obj)) {
            let xml = `${spaces}<${rootName}>`;
            obj.forEach((item, index) => {
                xml += '\n' + this.convertToXml(item, 'item', indent + 1);
            });
            xml += `\n${spaces}</${rootName}>`;
            return xml;
        }

        let xml = `${spaces}<${rootName}>`;
        for (const [key, value] of Object.entries(obj)) {
            xml += '\n' + this.convertToXml(value, key, indent + 1);
        }
        xml += `\n${spaces}</${rootName}>`;
        return xml;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeXml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CodeTools();
});