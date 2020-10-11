document.addEventListener('DOMContentLoaded', function () {
    const URL = 'http://localhost:3001';
    const button = document.getElementById('button');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');
    button.addEventListener('click', function () {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', URL);
        xhr.send(JSON.stringify({
            nick: nick.value,
            message: message.value
        }));

        xhr.onload = function () {
            if (xhr.status != 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
                console.error('Ошибка!');
            } else { // если всё прошло гладко, выводим результат
                drawMessages(xhr.response);
            }
        };


        xhr.onprogress = function (event) {
            if (event.lengthComputable) {
                console.log(`Получено ${event.loaded} из ${event.total} байт`);
            } else {
                console.log(`Получено ${event.loaded} байт`); // если в ответе нет заголовка Content-Length
            }

        };

        xhr.onerror = function () {
            console.log('Запрос не удался');
        };

    });
    setInterval(function () {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', URL);
        xhr.send();
        xhr.onload = function () {
            if (xhr.status != 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
                console.error('Ошибка!');
            } else { // если всё прошло гладко, выводим результат
                drawMessages(xhr.response);
            }
        };

    }, 1000)

});

function drawMessages(response) {
    const messages = document.getElementById('messages');
    const serverMessages = JSON.parse(response);
    messages.innerHTML = "";
    for (let serverMessage of serverMessages) {
        messages.innerHTML += `<ul><b>${serverMessage.nick}|:</b>${serverMessage.message}</ul>`;
    }
}





































