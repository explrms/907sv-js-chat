const URL = 'http://vki-test.01sh.ru:3001';

class App extends React.Component {

    constructor() {
        super(); // ← вызов конструктора родительского класса
        // эти переменные будут меняться динамически
        this.state = {
            nick: '',
            message: '',
            serverMessages: []
        };
        // получение новых сообщений в цикле
        // я делаю bind, чтобы у функции был определён контекст this
        setInterval(this.getMessages.bind(this), 1000);
    }

    postMessage() {
        //проверка на пустоту ника и сообщения
        if (this.state.nick.trim() === ''){
            Swal.fire({
                title: 'Внимание!',
                text: 'Вы не ввели ник!',
                icon: 'error',
                confirmButtonText: 'Хорошо'
            })
            return;
        }
        if (this.state.message.trim() === ''){
            Swal.fire({
                title: 'Внимание!',
                text: 'Вы не ввели сообщение',
                icon: 'error',
                confirmButtonText: 'Хорошо'
            })
            return;
        }
        //метод отправки сообщения
        let xhr = new XMLHttpRequest();
        xhr.open('POST', URL);
        xhr.send(JSON.stringify({
            nick: this.state.nick,
            message: this.state.message
        }))
    }


    getMessages() {
        // метод получения сообщений
        let xhr = new XMLHttpRequest();
        xhr.open('GET', URL);
        xhr.send();
        xhr.onload = () => {
            if (xhr.status != 200) {
                console.error('Ошибка!');
            } else {
                this.parseMessages(xhr.response);
            }
        };
    };

    parseMessages(response) {
        // метод отрисовки сообщений
        this.setState({
            serverMessages: JSON.parse(response)
        });
    }

    render() {
        return <>
            <div className={"header-img"}>
                <img src={"assets/images/header.png"}/>
            </div>
            <form className={"form-1"}>
                <input
                    className={"s-input-nick"}
                    value={this.state.nick}
                    type="text"
                    onChange={e => this.setState({nick: e.target.value})}
                />
                <br/>
                <textarea
                    className={"s-input-message"}
                    value={this.state.message}
                    onChange={e => this.setState({message: e.target.value})}
                >
            </textarea>
                <br/>
                <button
                    className={"mail-btn"}
                    type="button"
                    value="отправить"
                    onClick={() => this.postMessage()}
                >Отправить
                </button>
            </form>
            <div className={"messages"}>
                {this.state.serverMessages.map((message, index) => (
                    <p key={index}>
                        <b>{message.nick}:</b>
                        {message.message}
                    </p>
                ))}
            </div>
            </>
    }



}