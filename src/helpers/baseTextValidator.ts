
import {differenceInYears} from 'date-fns';

export const rules = {
    required: (value: string) => !!value || 'Поле обязательно',
    email: (value: string) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Некорректный e-mail';
    },
    minAge: (value: string) => {
        if (!value) return 'Поле обязательно';
        const age = differenceInYears(new Date(), new Date(value));
        return age >= 14 || 'Вам должно быть не менее 14 лет';
    },
    mismatchPasswords: (p1: string, p2: string) => {
        return p1 === p2 || 'Пароли не совпадают'
    },
    lengthPass: (password: string) => {
        return password.length >= 6 || 'Минимальная длина пароля - 6 символов'
    },
    passMismatch: (p: string, newP: string) => {
        return p !== newP || 'Текущий и новый пароли не должны совпадать'
    },
    lengthNickname: (nick: string) => {
        return nick.length >= 6 || 'Минимальная длина никнейма - 6 символов'
    },
    lengthTag: (tag: string) => {
        return tag.length >= 6 || 'Минимальная длина тега - 6 символов'
    },
    onlyDigitOrLetterPass: (password: string) => {
        return /[A-z,a-z]/.test(password) && /\d/.test(password) || 'Добавьте и буквы и цифры'
    },
    fieldSymbols: (value: string) => {
        return /^[a-zA-Z0-9!@#$%^&*()_+\-={}\[\]|:;'",.<>/?]*$/.test(value) || 'Поле может содержать только латинские буквы, цифры и спец символы';
    },
    fieldSymbolsEditorField: (value: string) => {
        return /^[a-zA-Zа-яА-Я0-9!@#$%^&*()_+\-={}\[\]|:;'",.<>/?\s]*$/.test(value) || 'Поле может содержать только латинские и русские буквы, цифры, пробелы и спецсимволы';
    },
    onlyNumbers: (value: string) => {
        return /^[0-9]*$/.test(value) || 'Поле может содержать только цифры';
    },
    lengthPost: (post: string) => {
        return post.trim().length >= 30 || 'Минимальная длина - 30 символов'
    },
}