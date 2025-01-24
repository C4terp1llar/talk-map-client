import { format, isToday, isYesterday, subDays, isSameDay, isThisWeek, parseISO } from 'date-fns';
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

export function formatSmartDate(date: Date) {
    if (isToday(date)) {
        return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
        return 'вчера';
    } else if (isSameDay(date, subDays(new Date(), 2))) {
        return 'позавчера';
    } else if (isThisWeek(date, { weekStartsOn: 1 })) {
        return format(date, 'EEE', { locale: ru });
    } else {
        return format(date, 'dd.MM.yyyy');
    }
}