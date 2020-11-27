import React from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import LoginView from './views/LoginView';
import RegistrationView from './views/RegistrationView';
import ChatView from './views/ChatView';
import ProfileView from './views/ProfileView';
import apiService from './apiService';
import Button from '@material-ui/core/Button';


class PrivateRoute extends React.Component {
    render() {
        const { user, component: Component, componentProps, ...rest } = this.props;
        return (
            <Route
                {...rest}
                render={routeProps =>
                    user ? (
                        <Component {...componentProps} {...routeProps} />
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/login',
                                state: { from: routeProps.location }
                            }}
                        />
                    )
                }
            />
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            initDone: false
        };
        this.updateAuthState = this.updateAuthState.bind(this);
    }

    componentDidMount() {
        this.updateAuthState();
    }

    updateAuthState() {
        return apiService.user
            .getCurrent()
            .then(response => response.data)
            .then(user => this.setState({ user, initDone: true }))
            .catch(() => this.setState({ user: null, initDone: true }));
    }

    logoutHandler() {
        apiService.auth.logout().then(() => {
            this.setState({ user: null });
        });
    }

    render() {
        const { user, initDone } = this.state;

        if (!initDone) {
            return <>Loading...</>;
        }

        return (
            <>
                {user ? (
                    <>
                        <Button variant="contained" color="primary" href="/profile">
                            Профиль {user.nickname}
                        </Button>
                        <Button onClick={() => this.logoutHandler()}>Выйти</Button>
                    </>
                ) : (
                    <>

                    </>
                )}
                <Switch>
                    <Route
                        path="/login"
                        render={routeProps => (
                            <LoginView updateAuthHandler={this.updateAuthState} {...routeProps} />
                        )}
                    />
                    <Route path="/registration" component={RegistrationView} />
                    <PrivateRoute path="/chat/:id" user={user} component={ChatView} />
                    <PrivateRoute
                        path="/profile"
                        user={user}
                        component={ProfileView}
                        componentProps={{ user }}
                    />
                    <Redirect exact from="/" to="/profile" />
                </Switch>
            </>
        );
    }
}

export default App;
