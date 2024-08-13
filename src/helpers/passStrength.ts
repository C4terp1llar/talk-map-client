export function checkPasswordStrength(password: string) {
    const passwordValue = password;
    let strengthScore = 0;

    if (passwordValue.length >= 6  && ((/[a-z]/.test(passwordValue) || /[A-Z]/.test(passwordValue)) || /\d/.test(passwordValue))) strengthScore++;
    if (passwordValue.length >= 6  && (/[a-z]/.test(passwordValue) || /[A-Z]/.test(passwordValue)) && /\d/.test(passwordValue)) strengthScore++;
    if (passwordValue.length >= 6  && /[a-z]/.test(passwordValue) && /\d/.test(passwordValue) && /[A-Z]/.test(passwordValue)) strengthScore++;
    if (passwordValue.length >= 6  && /[a-z]/.test(passwordValue) && /\d/.test(passwordValue) && /[A-Z]/.test(passwordValue) && /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue)) strengthScore++;

    return strengthScore;
}