export function truncateText(text: string, wordLimit: number = 5): string {
    const words = text.split(/\s+/);

    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ') + '...';
    }

    return text;
}