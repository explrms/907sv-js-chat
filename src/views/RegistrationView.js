import React from 'react';
import { Formik } from 'formik';
import apiService from '../apiService';
import {Button, TextField} from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import ButtonGroup from "@material-ui/core/ButtonGroup";
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';


export default class RegistrationView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: null,
            error: null
        };
    }

    handleSubmit(values) {
        apiService.user
            .create(values)
            .then(() => {
                this.setState({ result: 'Пользователь успешно зарегистрирован' });
                setTimeout(() => this.props.history.push('/login'), 1000);
            })
            .catch(error => this.setState({ error: 'Ошибка: ' + error.response.data.error }));
    }

    render() {
        const { error, result } = this.state;

        return (
            <div className="registration-view loginArea">
                <div className="reglogButtons">
                    <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                        <Button href={"/login"}>Авторизация</Button>
                        <Button href={"/registration"}>Регистрация</Button>
                    </ButtonGroup>
                </div>
                <h1 className="header">Регистрация</h1>
                {error && (
                    <SweetAlert
                        show={this.state.show}
                        title="Внимание"
                        text={error}
                        onConfirm={() => this.setState({ show: false })}
                    />
                )}
                {result &&
                <SweetAlert
                    show={this.state.show}
                    title="Внимание"
                    text={result}
                    onConfirm={() => this.setState({ show: false })}
                />}
                <Formik
                    initialValues={{ nickname: '', password: '' }}
                    validate={values => {
                        const errors = {};
                        if (!values.nickname) {
                            errors.nickname = 'Введите никнейм';
                        }
                        if (!values.password) {
                            errors.password = 'Введите пароль';
                        }
                        if (values.password.length < 7) {
                            errors.password = 'Длина пароля должна быть больше 6 символов';
                        }
                        return errors;
                    }}
                    onSubmit={values => {
                        this.handleSubmit(values);
                    }}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            {errors.nickname && touched.nickname && (
                                <SweetAlert
                                    show={this.state.show}
                                    title="Внимание"
                                    text={errors.nickname}
                                    onConfirm={() => this.setState({ show: false })}
                                />                            )}
                                <div className="loginFields">
                                    <TextField
                                        id="nickname"
                                        name="nickname"
                                        label="Логин"
                                        defaultValue=""
                                        helperText=""
                                        value={values.nickname}
                                        onChange={handleChange}
                                        variant="outlined"
                                        onBlur={handleBlur}
                                    />
                                </div>

                            <div>
                                <div className="loginFields">
                                    <TextField
                                        id="password"
                                        name="password"
                                        label="Пароль"
                                        type="password"
                                        onBlur={handleBlur}
                                        value={values.password}
                                        autoComplete="current-password"
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                        {errors.password && touched.password && (
                                                <SweetAlert
                                                    show={this.state.show}
                                                    title="Внимание"
                                                    text={errors.password}
                                                    onConfirm={() => this.setState({ show: false })}
                                                />
                                        )}
                                </div>
                            </div>
                            <div className="loginFields">
                                <Fab color="primary" aria-label="add" type="submit" onClick={() => this.setState({ show: true })}>
                                    <AddIcon />
                                </Fab>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        );
    }
}
