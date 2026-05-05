import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function extractTextFromPDF(arrayBuffer) {
    try {
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map(item => item.str);
            fullText += strings.join(' ') + '\n';
        }
        return fullText;
    } catch (err) {
        console.error('PDF parsing error:', err);
        return '';
    }
}

export async function extractTextFromDOCX(arrayBuffer) {
    try {
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value || '';
    } catch (err) {
        console.error('DOC/DOCX parsing error:', err);
        return '';
    }
}

export function extractTextFromHTML(htmlString) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        return doc.body.textContent || '';
    } catch (err) {
        console.error('HTML parsing error:', err);
        return '';
    }
}
