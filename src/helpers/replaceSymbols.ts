export const replaceSymbols = (str: string) => {
    return str.replace(/[\sа-яё]/gi, '');
}