class UnmarkRenderer {
    constructor(options) {
        this.options = options || {};
        this.whitespaceDelimiter = this.options.spaces ? ' ' : '\n';
        this.showImageText = (typeof this.options !== 'undefined') ? this.options.showImageText : true;
    }
    code(code, lang, escaped) {
        return this.whitespaceDelimiter + this.whitespaceDelimiter + code + this.whitespaceDelimiter + this.whitespaceDelimiter;
    }
    blockquote(quote) {
        return '\t' + quote + this.whitespaceDelimiter;
    }
    html(html) {
        return html;
    }
    heading(text, level, raw) {
        return text;
    }
    hr() {
        return this.whitespaceDelimiter + this.whitespaceDelimiter;
    }
    list(body, ordered) {
        return body;
    }
    listitem(text) {
        return '\t' + text + this.whitespaceDelimiter;
    }
    paragraph(text) {
        return this.whitespaceDelimiter + text + this.whitespaceDelimiter;
    }
    table(header, body) {
        return this.whitespaceDelimiter + header + this.whitespaceDelimiter + body + this.whitespaceDelimiter;
    }
    tablerow(content) {
        return content + this.whitespaceDelimiter;
    }
    tablecell(content, flags) {
        return content + '\t';
    }
    strong(text) {
        return text;
    }
    em(text) {
        return text;
    }
    codespan(text) {
        return text;
    }
    br() {
        return this.whitespaceDelimiter + this.whitespaceDelimiter;
    }
    del(text) {
        return text;
    }
    link(href, title, text) {
        return text;
    }
    image(href, title, text) {
        return this.showImageText ? text : '';
    }
    text(text) {
        return text;
    }
}

