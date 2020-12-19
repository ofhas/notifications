import * as React from 'react';
import cn from 'classnames';
import './index.sass';

export interface InputProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress?: (event: React.KeyboardEvent) => void;
    placeholder?: string;
    label?: string;
    type?: string;
    value?: string;
    className?: string;
    error?: boolean;
    style?: object;
    fullWitdh?: boolean;
    stretch?: boolean
}

function Input(props: InputProps) {
    const {className, label, error, style, fullWitdh, stretch, ...otherProps} = props;
    const containerClassName = cn('app-input', className, { fullWitdh });
    const inputClassName = cn('app-input__input', {error}, className, { 'app-input__stretch': stretch });
    return (
        <div className={containerClassName} style={style}>
            {label ? <label className='app-input__label'>{label}</label> : null}
            <input
                {...otherProps}
                className={inputClassName}
            />
        </div>
    )
}

export default Input
