// html-to-docx không có @types chính thức → khai báo thủ công (chỉ phần ta dùng).
declare module 'html-to-docx' {
    interface HtmlToDocxOptions {
        pageSize?: { width?: number; height?: number };
        margins?: { top?: number; right?: number; bottom?: number; left?: number; header?: number; footer?: number; gutter?: number };
        table?: { row?: { cantSplit?: boolean } };
        footer?: boolean;
        pageNumber?: boolean;
        [key: string]: unknown;
    }
    // Trả Buffer/Blob/ArrayBuffer tùy môi trường; ở Node là Buffer.
    export default function htmlToDocx(
        htmlString: string,
        headerHTMLString?: string,
        options?: HtmlToDocxOptions,
        footerHTMLString?: string,
    ): Promise<Buffer | ArrayBuffer | Blob>;
}
