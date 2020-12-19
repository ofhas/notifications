import * as React from 'react';
import cn from 'classnames';
import './index.sass'

export interface ButtonProps {
    label?: string | React.ReactNode;
    color: 'submit' | 'create' | 'disable';
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    className?: string;
    disabled?: boolean;
    squared?: boolean;
    circled?: boolean;
    fullWidth?: boolean;
    children?: React.ReactNode;
}

function Button(props: ButtonProps) {
    const {color,fullWidth, label, onClick, className, disabled, squared, children, circled, ...otherProps} = props;
    const btnClassName = cn('app-btn', {
            [`app-btn__${color}`]: color,
            [`app-btn__disabled`]: disabled,
            [`app-btn__squared`]: squared,
            [`app-btn__circled`]: circled,
            [`app-btn__fullWidth`]: fullWidth
        },
        className
    );
    return (
        <button
            {...otherProps}
            disabled={disabled}
            onClick={onClick}
            className={btnClassName}
        >
            { label && <span className='app-btn__label'>{ label }</span>}
            { children }
        </button>
    )
}

export default Button
