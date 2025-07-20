class CodeTools {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupRegexTester();
        this.setupJsonProcessor();
        this.setupEncodingTools();
        this.setupSqlTools();
        this.setupFloatingNav();
    }

    bindEvents() {
        const regexPattern = document.getElementById('regex-pattern');
        const regexTestText = document.getElementById('regex-test-text');
        const regexFlags = document.querySelectorAll('.flag-option input');
        const flagOptions = document.querySelectorAll('.flag-option');

        const toolOptions = document.querySelectorAll('.tool-option');


        const encodingInput = document.getElementById('encoding-input');
        const encodingTools = document.querySelectorAll('.encoding-tool');
        
        const sqlInput = document.getElementById('sql-input');
        const sqlTools = document.querySelectorAll('.sql-tool');

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
            
            if (label && input) {
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
                        case 'json-to-ts':
                            this.jsonToTypeScript();
                            break;
                    }
                });
            }
        });

        if (encodingInput) {
            encodingInput.addEventListener('input', () => this.processEncoding());
        }

        encodingTools.forEach(tool => {
            tool.addEventListener('click', () => {
                encodingTools.forEach(t => t.classList.remove('active'));
                tool.classList.add('active');
                this.processEncoding();
            });
        });

        if (sqlInput) {
            sqlInput.addEventListener('input', () => this.processSql());
        }

        sqlTools.forEach(tool => {
            tool.addEventListener('click', () => {
                sqlTools.forEach(t => t.classList.remove('active'));
                tool.classList.add('active');
                this.processSql();
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

    jsonToTypeScript() {
        const input = document.getElementById('json-input').value.trim();
        const output = document.getElementById('json-output');

        if (!input) {
            output.innerHTML = '<div style="color: var(--text-muted); padding: 1rem;">Enter JSON data to generate TypeScript interface</div>';
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const tsInterface = this.generateTsInterface(parsed);
            output.innerHTML = `<pre style="margin: 0; white-space: pre-wrap; font-family: 'JetBrains Mono', monospace;">${this.escapeHtml(tsInterface)}</pre>`;
        } catch (error) {
            output.innerHTML = `<div class="error-output">Invalid JSON: ${error.message}</div>`;
        }
    }

    generateTsInterface(obj, interfaceName = 'RootInterface', depth = 0) {
        const indent = '  '.repeat(depth);
        
        if (typeof obj !== 'object' || obj === null) {
            return typeof obj;
        }

        if (Array.isArray(obj)) {
            if (obj.length === 0) return 'any[]';
            const firstItem = obj[0];
            const itemType = this.generateTsInterface(firstItem, 'Item', depth);
            return `${itemType}[]`;
        }

        let interfaceStr = '';
        if (depth === 0) {
            interfaceStr += `interface ${interfaceName} {\n`;
        } else {
            interfaceStr += '{\n';
        }

        for (const [key, value] of Object.entries(obj)) {
            const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
            const valueType = this.generateTsInterface(value, `${interfaceName}${key.charAt(0).toUpperCase() + key.slice(1)}`, depth + 1);
            
            interfaceStr += `${indent}  ${safeKey}: ${valueType};\n`;
        }

        interfaceStr += `${indent}}`;
        
        return interfaceStr;
    }

    setupEncodingTools() {
        const output = document.getElementById('encoding-output');
        output.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 2rem;">Enter text and select an encoding/decoding tool above</div>';
    }

    processEncoding() {
        const input = document.getElementById('encoding-input').value.trim();
        const output = document.getElementById('encoding-output');
        const activeTool = document.querySelector('.encoding-tool.active');

        if (!activeTool) {
            output.innerHTML = '<div style="color: var(--text-muted); padding: 1rem;">Select a tool above</div>';
            return;
        }

        const tool = activeTool.getAttribute('data-tool');

        if (!input) {
            output.innerHTML = '<div style="color: var(--text-muted); padding: 1rem;">Enter text to encode/decode</div>';
            return;
        }

        try {
            let result = '';
            switch (tool) {
                case 'to-base64':
                    result = btoa(unescape(encodeURIComponent(input)));
                    break;
                case 'from-base64':
                    result = decodeURIComponent(escape(atob(input)));
                    break;
                case 'to-hex':
                    result = input.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
                    break;
                case 'from-hex':
                    result = input.replace(/[^0-9a-fA-F]/g, '').match(/.{1,2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
                    break;
                case 'to-hexdump':
                    result = this.createHexdump(input);
                    break;
                case 'from-hexdump':
                    result = this.parseHexdump(input);
                    break;
                case 'url-encode':
                    result = encodeURIComponent(input);
                    break;
                case 'url-decode':
                    result = decodeURIComponent(input);
                    break;
            }
            
            output.innerHTML = `<pre style="margin: 0; white-space: pre-wrap; font-family: 'JetBrains Mono', monospace; word-break: break-all;">${this.escapeHtml(result)}</pre>`;
        } catch (error) {
            output.innerHTML = `<div class="error-output">Error: ${error.message}</div>`;
        }
    }

    createHexdump(text) {
        const bytes = new TextEncoder().encode(text);
        let hexdump = '';
        
        for (let i = 0; i < bytes.length; i += 16) {
            const chunk = bytes.slice(i, i + 16);
            const offset = i.toString(16).padStart(8, '0');
            
            const hexPart = Array.from(chunk)
                .map(byte => byte.toString(16).padStart(2, '0'))
                .join(' ')
                .padEnd(47, ' ');
            
            const asciiPart = Array.from(chunk)
                .map(byte => (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.')
                .join('');
            
            hexdump += `${offset}  ${hexPart}  |${asciiPart}|\n`;
        }
        
        return hexdump;
    }

    parseHexdump(hexdump) {
        const lines = hexdump.split('\n').filter(line => line.trim());
        let result = '';
        
        for (const line of lines) {
            const match = line.match(/^[0-9a-fA-F]+\s+([0-9a-fA-F\s]+)\s+\|/);
            if (match) {
                const hexBytes = match[1].trim().split(/\s+/);
                for (const hexByte of hexBytes) {
                    if (hexByte.length === 2) {
                        result += String.fromCharCode(parseInt(hexByte, 16));
                    }
                }
            }
        }
        
        return result;
    }


    setupSqlTools() {
        const output = document.getElementById('sql-output');
        output.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 2rem;">Enter SQL code and select a tool above</div>';
    }


    processSql() {
        const input = document.getElementById('sql-input').value.trim();
        const output = document.getElementById('sql-output');
        const activeTool = document.querySelector('.sql-tool.active');

        if (!input) {
            output.innerHTML = '<div style="color: var(--text-muted); padding: 1rem;">Enter SQL code</div>';
            return;
        }

        if (!activeTool) {
            output.innerHTML = '<div style="color: var(--text-muted); padding: 1rem;">Select a tool above</div>';
            return;
        }

        const tool = activeTool.getAttribute('data-tool');

        try {
            switch (tool) {
                case 'format':
                    this.formatSql(input, output);
                    break;
                case 'performance':
                    this.analyzePerformance(input, output);
                    break;
                case 'nosql':
                    this.convertToNoSql(input, output);
                    break;
                case 'explain':
                    this.explainSql(input, output);
                    break;
            }
        } catch (error) {
            output.innerHTML = `<div class="error-output">Error: ${error.message}</div>`;
        }
    }

    formatSql(sql, output) {
        const formatted = sql
            .replace(/\bSELECT\b/gi, '\nSELECT')
            .replace(/\bFROM\b/gi, '\nFROM')
            .replace(/\bWHERE\b/gi, '\nWHERE')
            .replace(/\bJOIN\b/gi, '\nJOIN')
            .replace(/\bINNER JOIN\b/gi, '\nINNER JOIN')
            .replace(/\bLEFT JOIN\b/gi, '\nLEFT JOIN')
            .replace(/\bRIGHT JOIN\b/gi, '\nRIGHT JOIN')
            .replace(/\bON\b/gi, '\n  ON')
            .replace(/\bGROUP BY\b/gi, '\nGROUP BY')
            .replace(/\bORDER BY\b/gi, '\nORDER BY')
            .replace(/\bHAVING\b/gi, '\nHAVING')
            .replace(/\bUNION\b/gi, '\nUNION')
            .replace(/\bINSERT INTO\b/gi, '\nINSERT INTO')
            .replace(/\bVALUES\b/gi, '\nVALUES')
            .replace(/\bUPDATE\b/gi, '\nUPDATE')
            .replace(/\bSET\b/gi, '\nSET')
            .replace(/\bDELETE FROM\b/gi, '\nDELETE FROM')
            .replace(/\bCREATE TABLE\b/gi, '\nCREATE TABLE')
            .replace(/,/g, ',\n  ')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .join('\n');

        output.innerHTML = `<pre style="margin: 0; white-space: pre-wrap; font-family: 'JetBrains Mono', monospace;">${this.escapeHtml(formatted)}</pre>`;
    }

    analyzePerformance(sql, output) {
        const analysis = this.performSqlAnalysis(sql);
        
        output.innerHTML = `
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                <strong>Query Complexity Analysis:</strong><br>
                <div style="margin-top: 0.5rem;">
                    ${analysis.complexity}
                </div>
            </div>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                <strong>Performance Issues:</strong><br>
                <div style="margin-top: 0.5rem;">
                    ${analysis.issues}
                </div>
            </div>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 6px;">
                <strong>Optimization Suggestions:</strong><br>
                <div style="margin-top: 0.5rem;">
                    ${analysis.suggestions}
                </div>
            </div>
        `;
    }

    performSqlAnalysis(sql) {
        const upperSql = sql.toUpperCase();
        let complexity = [];
        let issues = [];
        let suggestions = [];

        const selectCount = (sql.match(/SELECT/gi) || []).length;
        const joinCount = (sql.match(/JOIN/gi) || []).length;
        const subqueryCount = (sql.match(/\(/g) || []).length;
        
        if (selectCount > 3) {
            complexity.push(`• High complexity: ${selectCount} SELECT statements`);
        } else if (selectCount > 1) {
            complexity.push(`• Medium complexity: ${selectCount} SELECT statements`);
        } else {
            complexity.push(`• Low complexity: ${selectCount} SELECT statement`);
        }
        
        if (joinCount > 0) {
            complexity.push(`• ${joinCount} JOIN operations detected`);
            if (joinCount > 3) {
                issues.push(`• Performance risk: ${joinCount} JOINs may slow down query`);
                suggestions.push(`• Consider breaking down complex JOINs into smaller queries`);
            }
        }
        
        if (subqueryCount > 2) {
            complexity.push(`• ${subqueryCount} nested subqueries`);
            issues.push(`• Subqueries can be performance bottlenecks`);
            suggestions.push(`• Try to rewrite subqueries as JOINs where possible`);
        }
        
        if (upperSql.includes('SELECT *')) {
            issues.push(`• Using SELECT * can impact performance`);
            suggestions.push(`• Specify only needed columns instead of SELECT *`);
        }
        
        if (upperSql.includes('WHERE') && !upperSql.includes('INDEX')) {
            suggestions.push(`• Ensure WHERE clause columns are indexed`);
        }
        
        if (upperSql.includes('ORDER BY') && !upperSql.includes('LIMIT')) {
            issues.push(`• ORDER BY without LIMIT can be expensive`);
            suggestions.push(`• Add LIMIT clause if you don't need all results`);
        }
        
        if (upperSql.includes('LIKE') && sql.includes('\'%')) {
            issues.push(`• Leading wildcard in LIKE prevents index usage`);
            suggestions.push(`• Avoid patterns starting with % when possible`);
        }
        
        if (complexity.length === 0) complexity.push('• Unable to analyze complexity');
        if (issues.length === 0) issues.push('• No obvious performance issues detected');
        if (suggestions.length === 0) suggestions.push('• Query appears well-optimized');
        
        return {
            complexity: complexity.join('<br>'),
            issues: issues.join('<br>'),
            suggestions: suggestions.join('<br>')
        };
    }

    convertToNoSql(sql, output) {
        const mongoQuery = this.sqlToMongoDB(sql);
        const redisCommands = this.sqlToRedis(sql);
        
        output.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <strong>MongoDB Query:</strong>
                <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: 6px; margin-top: 0.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; overflow-x: auto;">
                    ${mongoQuery}
                </div>
            </div>
            <div>
                <strong>Redis Commands:</strong>
                <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: 6px; margin-top: 0.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; overflow-x: auto;">
                    ${redisCommands}
                </div>
            </div>
        `;
    }

    sqlToMongoDB(sql) {
        const upperSql = sql.toUpperCase().trim();
        
        if (upperSql.startsWith('SELECT')) {
            return this.convertSelectToMongo(sql);
        } else if (upperSql.startsWith('INSERT')) {
            return this.convertInsertToMongo(sql);
        } else if (upperSql.startsWith('UPDATE')) {
            return this.convertUpdateToMongo(sql);
        } else if (upperSql.startsWith('DELETE')) {
            return this.convertDeleteToMongo(sql);
        }
        
        return 'Unable to convert this SQL statement to MongoDB';
    }

    convertSelectToMongo(sql) {
        let mongoQuery = 'db.collection.';
        const upperSql = sql.toUpperCase();
        
        const tableMatch = sql.match(/FROM\s+(\w+)/i);
        const collection = tableMatch ? tableMatch[1] : 'collection';
        
        const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER\s+BY|\s+GROUP\s+BY|\s+LIMIT|$)/i);
        const orderMatch = sql.match(/ORDER\s+BY\s+(.+?)(?:\s+LIMIT|$)/i);
        const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
        
        let query = {};
        if (whereMatch) {
            const conditions = this.parseWhereConditions(whereMatch[1]);
            query = conditions;
        }
        
        const queryStr = Object.keys(query).length > 0 ? JSON.stringify(query, null, 2) : '{}';
        
        if (upperSql.includes('COUNT(')) {
            mongoQuery += `${collection}.countDocuments(${queryStr})`;
        } else {
            mongoQuery += `${collection}.find(${queryStr})`;
            
            if (orderMatch) {
                const sortObj = this.parseOrderBy(orderMatch[1]);
                mongoQuery += `.sort(${JSON.stringify(sortObj)})`;
            }
            
            if (limitMatch) {
                mongoQuery += `.limit(${limitMatch[1]})`;
            }
        }
        
        return mongoQuery;
    }

    convertInsertToMongo(sql) {
        const tableMatch = sql.match(/INSERT\s+INTO\s+(\w+)/i);
        const collection = tableMatch ? tableMatch[1] : 'collection';
        
        const valuesMatch = sql.match(/VALUES\s*\((.+?)\)/i);
        if (valuesMatch) {
            const values = valuesMatch[1].split(',').map(v => v.trim().replace(/^'|'$/g, ''));
            const columnsMatch = sql.match(/\((.*?)\)\s*VALUES/i);
            
            if (columnsMatch) {
                const columns = columnsMatch[1].split(',').map(c => c.trim());
                const doc = {};
                columns.forEach((col, i) => {
                    doc[col] = values[i] || null;
                });
                return `db.${collection}.insertOne(${JSON.stringify(doc, null, 2)})`;
            }
        }
        
        return `db.${collection}.insertOne({ /* document */ })`;
    }

    convertUpdateToMongo(sql) {
        const tableMatch = sql.match(/UPDATE\s+(\w+)/i);
        const collection = tableMatch ? tableMatch[1] : 'collection';
        
        const setMatch = sql.match(/SET\s+(.+?)(?:\s+WHERE|$)/i);
        const whereMatch = sql.match(/WHERE\s+(.+)$/i);
        
        let updateDoc = {};
        if (setMatch) {
            const setPairs = setMatch[1].split(',');
            setPairs.forEach(pair => {
                const [key, value] = pair.split('=').map(s => s.trim());
                updateDoc[key] = value.replace(/^'|'$/g, '');
            });
        }
        
        let filter = {};
        if (whereMatch) {
            filter = this.parseWhereConditions(whereMatch[1]);
        }
        
        return `db.${collection}.updateMany(${JSON.stringify(filter)}, { $set: ${JSON.stringify(updateDoc)} })`;
    }

    convertDeleteToMongo(sql) {
        const tableMatch = sql.match(/DELETE\s+FROM\s+(\w+)/i);
        const collection = tableMatch ? tableMatch[1] : 'collection';
        
        const whereMatch = sql.match(/WHERE\s+(.+)$/i);
        let filter = {};
        if (whereMatch) {
            filter = this.parseWhereConditions(whereMatch[1]);
        }
        
        return `db.${collection}.deleteMany(${JSON.stringify(filter)})`;
    }

    parseWhereConditions(whereClause) {
        const conditions = {};
        
        const simpleConditions = whereClause.split(/\s+AND\s+/i);
        
        simpleConditions.forEach(condition => {
            const equalMatch = condition.match(/(\w+)\s*=\s*'?([^'\s]+)'?/i);
            if (equalMatch) {
                conditions[equalMatch[1]] = equalMatch[2];
                return;
            }
            
            const gtMatch = condition.match(/(\w+)\s*>\s*([\d.]+)/i);
            if (gtMatch) {
                conditions[gtMatch[1]] = { $gt: Number(gtMatch[2]) };
                return;
            }
            
            const ltMatch = condition.match(/(\w+)\s*<\s*([\d.]+)/i);
            if (ltMatch) {
                conditions[ltMatch[1]] = { $lt: Number(ltMatch[2]) };
                return;
            }
            
            const likeMatch = condition.match(/(\w+)\s+LIKE\s+'%(.+)%'/i);
            if (likeMatch) {
                conditions[likeMatch[1]] = { $regex: likeMatch[2], $options: 'i' };
            }
        });
        
        return conditions;
    }

    parseOrderBy(orderClause) {
        const sortObj = {};
        const parts = orderClause.split(',');
        
        parts.forEach(part => {
            const trimmed = part.trim();
            const match = trimmed.match(/(\w+)(?:\s+(ASC|DESC))?/i);
            if (match) {
                const field = match[1];
                const direction = match[2] && match[2].toUpperCase() === 'DESC' ? -1 : 1;
                sortObj[field] = direction;
            }
        });
        
        return sortObj;
    }

    sqlToRedis(sql) {
        const upperSql = sql.toUpperCase().trim();
        
        if (upperSql.startsWith('SELECT')) {
            return this.convertSelectToRedis(sql);
        } else if (upperSql.startsWith('INSERT')) {
            return this.convertInsertToRedis(sql);
        } else if (upperSql.startsWith('UPDATE')) {
            return this.convertUpdateToRedis(sql);
        } else if (upperSql.startsWith('DELETE')) {
            return this.convertDeleteToRedis(sql);
        }
        
        return 'Redis is a key-value store. Complex SQL operations may require application-level logic.';
    }

    convertSelectToRedis(sql) {
        const tableMatch = sql.match(/FROM\s+(\w+)/i);
        const table = tableMatch ? tableMatch[1] : 'table';
        
        const whereMatch = sql.match(/WHERE\s+id\s*=\s*'?([^'\s]+)'?/i);
        
        if (whereMatch) {
            const id = whereMatch[1];
            return `HGETALL ${table}:${id}\n\n# For range queries or complex conditions:\n# Use application logic with SCAN commands\nSCAN 0 MATCH ${table}:*`;
        }
        
        if (sql.toUpperCase().includes('COUNT(')) {
            return `# Count all keys matching pattern\nKEYS ${table}:* | wc -l\n\n# Or use more efficient:\nSCAN 0 MATCH ${table}:* COUNT 1000`;
        }
        
        return `# Get all records (use with caution)\nKEYS ${table}:*\n\n# Better approach for large datasets:\nSCAN 0 MATCH ${table}:* COUNT 100`;
    }

    convertInsertToRedis(sql) {
        const tableMatch = sql.match(/INSERT\s+INTO\s+(\w+)/i);
        const table = tableMatch ? tableMatch[1] : 'table';
        
        const valuesMatch = sql.match(/VALUES\s*\((.+?)\)/i);
        const columnsMatch = sql.match(/\((.*?)\)\s*VALUES/i);
        
        if (valuesMatch && columnsMatch) {
            const columns = columnsMatch[1].split(',').map(c => c.trim());
            const values = valuesMatch[1].split(',').map(v => v.trim().replace(/^'|'$/g, ''));
            
            const idColumn = columns.find(col => col.toLowerCase().includes('id'));
            const idIndex = columns.indexOf(idColumn);
            const id = idIndex >= 0 ? values[idIndex] : 'new_id';
            
            let redisCmd = `HMSET ${table}:${id}`;
            columns.forEach((col, i) => {
                redisCmd += ` ${col} "${values[i] || ''}"`;
            });
            
            return redisCmd + `\n\n# Add to index set\nSADD ${table}:ids ${id}`;
        }
        
        return `HMSET ${table}:id field1 value1 field2 value2\nSADD ${table}:ids id`;
    }

    convertUpdateToRedis(sql) {
        const tableMatch = sql.match(/UPDATE\s+(\w+)/i);
        const table = tableMatch ? tableMatch[1] : 'table';
        
        const setMatch = sql.match(/SET\s+(.+?)(?:\s+WHERE|$)/i);
        const whereMatch = sql.match(/WHERE\s+id\s*=\s*'?([^'\s]+)'?/i);
        
        const id = whereMatch ? whereMatch[1] : 'id';
        
        if (setMatch) {
            const setPairs = setMatch[1].split(',');
            let redisCmd = `HMSET ${table}:${id}`;
            
            setPairs.forEach(pair => {
                const [key, value] = pair.split('=').map(s => s.trim());
                redisCmd += ` ${key} "${value.replace(/^'|'$/g, '')}"`;
            });
            
            return redisCmd;
        }
        
        return `HSET ${table}:${id} field value`;
    }

    convertDeleteToRedis(sql) {
        const tableMatch = sql.match(/DELETE\s+FROM\s+(\w+)/i);
        const table = tableMatch ? tableMatch[1] : 'table';
        
        const whereMatch = sql.match(/WHERE\s+id\s*=\s*'?([^'\s]+)'?/i);
        
        if (whereMatch) {
            const id = whereMatch[1];
            return `DEL ${table}:${id}\nSREM ${table}:ids ${id}`;
        }
        
        return `# Delete all records (dangerous!)\nKEYS ${table}:* | xargs redis-cli DEL\nDEL ${table}:ids`;
    }


    explainSql(sql, output) {
        const explanation = this.analyzeSql(sql);
        
        output.innerHTML = `
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 6px;">
                <strong>SQL Analysis:</strong><br>
                <div style="margin-top: 0.5rem; line-height: 1.6;">
                    ${explanation}
                </div>
            </div>
        `;
    }

    analyzeSql(sql) {
        const upperSql = sql.toUpperCase();
        let analysis = [];

        if (upperSql.includes('SELECT')) {
            analysis.push('• Query type: SELECT (data retrieval)');
            if (upperSql.includes('JOIN')) {
                analysis.push('• Uses table joins to combine data');
            }
            if (upperSql.includes('WHERE')) {
                analysis.push('• Filters data with WHERE conditions');
            }
            if (upperSql.includes('GROUP BY')) {
                analysis.push('• Groups results using GROUP BY');
            }
            if (upperSql.includes('ORDER BY')) {
                analysis.push('• Sorts results with ORDER BY');
            }
        }

        if (upperSql.includes('INSERT')) {
            analysis.push('• Query type: INSERT (adds new data)');
        }

        if (upperSql.includes('UPDATE')) {
            analysis.push('• Query type: UPDATE (modifies existing data)');
        }

        if (upperSql.includes('DELETE')) {
            analysis.push('• Query type: DELETE (removes data)');
        }

        if (upperSql.includes('CREATE TABLE')) {
            analysis.push('• DDL: CREATE TABLE (defines new table structure)');
        }

        if (analysis.length === 0) {
            analysis.push('• Unable to determine query type');
        }

        return analysis.join('<br>');
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

document.addEventListener('DOMContentLoaded', () => {
    new CodeTools();
});