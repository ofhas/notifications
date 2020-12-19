import * as React from 'react';
import moment from 'moment';
import cn from 'classnames';
import { Message } from '../../../src/types/Message';
import Col from '../Row';
import './index.sass';

export interface MsgProps {
  msg: Message;
  mine: boolean;
}

const MsgComp = ({ msg, mine, ...props }: MsgProps) => (
  <Col
    className={cn('message', { message__mine: mine })}
    key={msg.id}
    {...props}
  >
    <div className="message__header">
      <span className="message__value" title={msg.from.username}>
        {msg.from.name}
      </span>
    </div>
    <div className="message__body">
      <span className="message__value">{msg.msg}</span>
    </div>
    <div className="message__fotter">
      <span className="message__value">
        {moment(msg.createdAt).format('h:mm')}
      </span>
    </div>
  </Col>
);

export default MsgComp;
