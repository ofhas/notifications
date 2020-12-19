import * as React from 'react';
import cn from 'classnames';
import './index.sass'

export default ({ children, column, className = 'col', style, ...props }: React.PropsWithChildren<any>) => 
    (<div className={cn({col: column ,[className]: className })} style={style || {}} {...props}>{children}</div>)