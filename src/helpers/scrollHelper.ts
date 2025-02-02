export function scroll(selector: string, direction: 'top' | 'bottom' | 'to' = 'to') {
    const element = document.querySelector(selector);

    if (element) {
        let scrollPosition: ScrollLogicalPosition;

        if (direction === 'top') {
            scrollPosition = 'start';
        } else if (direction === 'bottom') {
            scrollPosition = 'end';
        } else {
            scrollPosition = 'center';
        }

        element.scrollIntoView({
            block: scrollPosition,
        });
    } else {
        console.error('Element not found');
    }
}
