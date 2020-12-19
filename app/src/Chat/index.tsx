import React from 'react';
import cn from 'classnames';
import { BsFillCaretRightFill as ArrowIcon } from 'react-icons/bs';
import { Channel } from '../../../src/modules/channels/types';
import { User } from '../../../src/modules/users/types';
import { Message } from '../../../src/types/Message';
import MessageComp from '../Message';
import Flex from '../Row';
import Input from '../Input';
import Button from '../Button';
import '../../static/chat.jpg';
import './index.sass';

interface ChatProps {
  visible: boolean;
  scrollableRef: React.LegacyRef<HTMLDivElement>;
  msgs: Message[];
  currentChannel: Channel;
  cueentText: string;
  user: User;
  onInputChange?: (value: string) => void;
  onClick: (inputValue: string) => void;
}

const Chat = (props: ChatProps) => (
  <Flex
    column
    className="notifications__channel_chat"
  >
    <div
      className={cn('notifications__scrollable', {
        notifications__scrollable__trans: true,
        notifications__scrollable__hidden: !props.visible,
      })}
      ref={props.scrollableRef}
    >
      {props.msgs.map((msg) => (
        <MessageComp
          key={msg.id}
          mine={msg.from.id === props.user.id}
          msg={msg}
        />
      ))}
    </div>
    {props.currentChannel && (
      <div className="notifications__keyboard">
        <Input
          fullWitdh
          stretch
          placeholder="Type some msg.."
          value={props.cueentText}
          onChange={(e) => props.onInputChange(e.target.value)}
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && !!props.cueentText)
              props.onClick(props.cueentText);
          }}
        />
        <Button
          circled
          color="submit"
          disabled={!props.cueentText}
          onClick={() => props.onClick(props.cueentText)}
        >
          <ArrowIcon color="white" size={16} />
        </Button>
      </div>
    )}
  </Flex>
);

export default Chat;
