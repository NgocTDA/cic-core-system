// turndown-plugin-gfm không có @types chính thức → khai báo thủ công.
declare module 'turndown-plugin-gfm' {
    import type TurndownService from 'turndown';
    type Plugin = TurndownService.Plugin;
    export const gfm: Plugin;
    export const tables: Plugin;
    export const strikethrough: Plugin;
    export const taskListItems: Plugin;
}
