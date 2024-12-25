import Cookies from "js-cookie";

export async function csrfFetch(url, options = {}) {
    // Устанавливаем метод по умолчанию
    options.method = options.method || 'GET';
    // Устанавливаем заголовки по умолчанию
    options.headers = options.headers || {};

    // Если метод не GET, добавляем необходимые заголовки
    if (options.method.toUpperCase() !== 'GET') {
        options.headers['Content-Type'] =
            options.headers['Content-Type'] || 'application/json';
        options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
    }

    // Выполняем запрос
    const res = await window.fetch(url, options);

    // Если статус ответа >= 400, парсим JSON и бросаем ошибку с данными
    if (res.status >= 400) {
        const errorData = await res.json();
        const error = new Error('Request failed');
        error.data = errorData;
        throw error;
    }

    // Если статус < 400, возвращаем ответ
    return res;
}

// Функция для восстановления CSRF токена
export function restoreCSRF() {
    return csrfFetch('/api/csrf/restore');
}
