import { format, isToday, isYesterday, subDays, isSameDay, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export function formatShortDate(date: Date) {
    if (isToday(date)) {
        return `сегодня в ${format(date, 'HH:mm')}`;
    } else if (isYesterday(date)) {
        return `вчера в ${format(date, 'HH:mm')}`;
    } else if (isSameDay(date, subDays(new Date(), 2))) {
        return `позавчера в ${format(date, 'HH:mm')}`;
    }

    return `в ${format(date, 'HH:mm dd.MM.yy', { locale: ru })}`;
}
