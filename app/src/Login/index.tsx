import * as React from 'react';
import './index.sass';
import Input from '../Input';
import Button from '../Button';
import ErrorList from "../ErrorList";

import { User, Errors } from "../types";
import { Dispatch } from "react";
import { SetStateAction } from "react";

import gauth from '../../static/gauth.png'

const INVALID_USER_ERROR_MSG: string = "Please enter a valid username";

export interface LoginProps {
    onLogin: (user: User, event: React.MouseEvent | React.KeyboardEvent) => void
}

function createOnChangeHandler(
    currentUser: User,
    parameter: keyof User,
    setUser: Dispatch<SetStateAction<User>>,
    setErrors: Dispatch<SetStateAction<Errors>>
): (event: React.ChangeEvent<HTMLInputElement>) => void {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const value: string = event.target.value;
        !isValidUser({ ...currentUser, [parameter]: value } as User) ?
            setErrors([INVALID_USER_ERROR_MSG]) :
            setErrors([]);
        setUser({ ...currentUser, [parameter]: value } as User)
    }
}

function createOnLoginHandler(
    user: User,
    onLogin: LoginProps["onLogin"],
    setErrors: Dispatch<SetStateAction<Errors>>
) {
    return (event: React.MouseEvent | React.KeyboardEvent) => {
        if (!isValidUser(user)) {
            setErrors([INVALID_USER_ERROR_MSG])
        } else {
            onLogin(user, event)
        }
    }
}

function isValidUser(user: User): boolean {
    return !(!user || !user.username || user.username.length === 0) && !!user.password;
}

const Login: React.FC<LoginProps> = (props: LoginProps) => {
    const { onLogin } = props;
    const [user, setUser] = React.useState<User>({
        username: 'user-1611050734199',
        password: 'secret'
    });
    const [errors, setErrors] = React.useState<Errors>([]);
    const onLoginHandler = createOnLoginHandler(user, onLogin, setErrors);
    return (
        <>
            <h1>Awesome Chat app!</h1>
            <div className='app-login-container'>
                <Input
                value={user.username}
                    placeholder='Username'
                    onChange={createOnChangeHandler(user, "username", setUser, setErrors)}
                    error={errors.length > 0}
                    onKeyPress={(event: React.KeyboardEvent) => {
                        if (event.key === "Enter")
                            onLoginHandler(event)
                    }}
                />
                <Input
                                value={user.password}
                    placeholder='Password'
                    onChange={createOnChangeHandler(user, 'password', setUser, setErrors)}
                    error={errors.length > 0}
                    onKeyPress={(event: React.KeyboardEvent) => {
                        if (event.key === "Enter")
                            onLoginHandler(event)
                    }}
                    type='password'
                />
                <Button
                    label='Login'
                    color={'submit'}
                    onClick={onLoginHandler}
                />
                <img src={gauth} className='app-login-container__google-auth' onClick={()=>{
                    location.replace('/api/auth/google')
                }}/>
                {
                    errors.length > 0 && <ErrorList errors={errors}/>
                }
            </div>
        </>
    );
};

export default Login;
