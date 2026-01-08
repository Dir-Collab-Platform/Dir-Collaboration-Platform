import DOMPurify from "dompurify";

export function cleanHTMLData(data) {
    return DOMPurify.sanitize(data)
}
