export function decodeJWT(token: string) {
    const parts = token.split('.');

    if (parts.length !== 3) {
        return null;
    }

    const payload = parts[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
}