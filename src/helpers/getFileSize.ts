export const getFileSize = (sz: number): string => {
    if (sz < 1024) return `${sz} Б`;
    if (sz < 1024 * 1024) return `${(sz / 1024).toFixed(1)} Кб`;
    if (sz < 1024 * 1024 * 1024) return `${(sz / (1024 * 1024)).toFixed(1)} Мб`;
    return `${(sz / (1024 * 1024 * 1024)).toFixed(1)} Гб`;
};
