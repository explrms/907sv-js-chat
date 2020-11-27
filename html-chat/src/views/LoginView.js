import React from 'react';
import { Button }  from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { InputLabel } from "@material-ui/core";
import apiService from '../apiService';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Fab from '@material-ui/core/Fab';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import SweetAlert from "sweetalert-react";
import Paper from '@material-ui/core/Paper';



export default class LoginView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: '',
            password: '',
            result: null,
            error: null
        };
    }

    handleSubmit(e) {
        this.setState({
            result: null,
            error: null
        });
        apiService.auth
            .login({
                nickname: this.state.nickname,
                password: this.state.password
            })
            .then(() => {
                this.setState({ result: 'Вы успешно вошли в аккаунт.' });
                setTimeout(() => this.redirectAfterLogin(), 2000);
                setTimeout(() => this.props.history.push('/profile'), 1000);
            })
            .catch(error => this.setState({ error: 'Ошибка:' + error.response.data.error }));
        e.preventDefault();
    }

    redirectAfterLogin() {
        const redirectUrl = this.props.location?.state.from.pathname
            ? this.props.location.state.from.pathname
            : '/profile';
        this.props.updateAuthHandler().then(() => this.props.history.push(redirectUrl));
    }

    render() {
        const { error, result } = this.state;

        return (
            <div className="login-view">
                <div className="loginArea">
                    <div className="reglogButtons">
                        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                            <Button href={"/login"}>Авторизация</Button>
                            <Button href={"/registration"}>Регистрация</Button>
                        </ButtonGroup>
                    </div>
                <h1 className="header">Авторизация</h1>
                {error}

                {result &&
                <SweetAlert
                    show={this.state.show}
                    title="Внимание"
                    text={result}
                    onConfirm={() => this.setState({ show: false })}
                />
                }
                <form onSubmit={e => this.handleSubmit(e)}>
                    <div className="loginFields">
                            <TextField
                                id="nickname"
                                name="nickname"
                                label="Логин"
                                defaultValue=""
                                helperText=""
                                value={this.state.nickname}
                                onChange={e => this.setState({ nickname: e.target.value })}
                                variant="outlined"
                            />
                    </div>
                    <div className="loginFields">
                        <TextField
                            id="password"
                            name="password"
                            label="Пароль"
                            type="password"
                            value={this.state.password}
                            autoComplete="current-password"
                            onChange={e => this.setState({ password: e.target.value })}
                            variant="outlined"
                        />
                    </div>
                    <div className="loginFields">
                        <Fab color="primary" aria-label="add" type="submit" onClick={() => this.setState({ show: true })}>
                            <ArrowForwardIcon />
                        </Fab>
                    </div>
                </form>
                </div>
            </div>
        );
    }
}
