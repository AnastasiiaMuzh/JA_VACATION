// import Cookies from "js-cookie";

// export async function csrfFetch(url, options = {}) {
//     // set options.method to 'GET' if there is no method
//     options.method = options.method || 'GET';
//     // set options.headers to an empty object if there is no headers
//     options.headers = options.headers || {};
//     //options.headers['X-CSRF-Token'] = csrfToken;

//     // if the options.method is not 'GET', then set the "Content-Type" header to
//     // "application/json", and set the "XSRF-TOKEN" header to the value of the
//     // "XSRF-TOKEN" cookie
//     if (options.method.toUpperCase() !== 'GET') {
//         options.headers['Content-Type'] =
//             options.headers['Content-Type'] || 'application/json';
//         options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
//     }
//     // call the default window's fetch with the url and the options passed in
//     const res = await window.fetch(url, options);

//     // if the response status code is 400 or above, then throw an error with the
//     // error being the response
//     if (res.status >= 400) throw res;

//     // if the response status code is under 400, then return the response to the
//     // next promise chain
//     return res;
// }

// // call this to get the "XSRF-TOKEN" cookie, should only be used in development
// export function restoreCSRF() {
//     return csrfFetch('/api/csrf/restore');
// }

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
