import React, { useEffect } from 'react';
import cn from 'classnames';
import moment from 'moment';
import Chip from '@material-ui/core/Chip';

import { BsPlusCircleFill, BsBoxArrowLeft } from 'react-icons/bs';
import { observer } from 'mobx-react-lite';
import Store from '../observables/Store';
import { Channel } from '../../../src/modules/channels/types';
import Flex from '../Row';
import Button from '../Button';
import './index.sass';

import CreateChannelForm from '../CreateChannel';
import api from '../api';

const CreateNewChannelBtn = (props: {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) => (
  <Button
    squared
    fullWidth
    onClick={props.onClick}
    color="create"
    className={'notifications__channels__footer__submit'}
  >
    <BsPlusCircleFill color="white" size={16} />
    <span className="notifications__channels__footer__submit__label">
      Create Channel
    </span>
  </Button>
);

type ChannelsNavbarProps = {
  store: Store;
  channels: Channel[];
  currentChannel: Channel;
  lastUpdate: Date;
  onClick: (id: Channel) => void;
};

const ChannelsNavbar = ({
  channels,
  onClick,
  lastUpdate,
  store,
  currentChannel,
  ...props
}: ChannelsNavbarProps) => {
  const [open, setOpen] = React.useState(false);
  const counters = store.channelCounters;
  const user = store.user;
  const users = store.users;

  useEffect(() => {
    currentChannel?.id && store.resetChannelCounter(currentChannel.id);
    return () =>
      currentChannel?.id && store.resetChannelCounter(currentChannel?.id);
  }, [currentChannel]);

  const channelsButtons = channels
    .sort((a, b) => (a.name >= b.name ? 1 : -1))
    .map((channel, i) => {
      const isCurrentChannel = currentChannel?.id === channel.id;
      return (
        <Button
          fullWidth
          squared
          className={cn('notifications__channels__body__button', {
            ['notifications__channels__body__button__disabled']: isCurrentChannel,
          })}
          key={channel.id}
          color={isCurrentChannel ? 'create' : 'submit'}
          label={channel.name.toUpperCase()}
          onClick={!isCurrentChannel ? () => onClick(channel) : null}
        >
          {currentChannel?.id !== channel?.id && counters[channel.id] ? (
            <Chip
              label={counters[channel.id]}
              size="small"
              variant="outlined"
              style={{
                color: 'white',
                borderColor: 'white',
                marginLeft: '0.25rem',
                height: '1rem',
                lineHeight: '1rem',
              }}
            />
          ) : null}
        </Button>
      );
    });

  return (
    <Flex column className="notifications__channels">
      <div className="notifications__channels__header">
        <h3>Logged in as: {user.name}</h3>
        <p>Last update: {moment(lastUpdate).fromNow()}</p>
        <Button
          color="submit"
          onClick={() => api.logout()}
          label="logout"
        >
          <BsBoxArrowLeft color="white" size={16} />
        </Button>
      </div>
      <div className="notifications__channels__body">{channelsButtons}</div>
      <div className="notifications__channels__footer">
        <CreateNewChannelBtn onClick={(e) => setOpen(!open)} />
      </div>
      <CreateChannelForm
        user={user}
        users={users}
        onSubmit={async (channel, users) => {
          const response = await api.postChannel(channel, users);
          setOpen(!open);
          return response;
        }}
        onClose={() => setOpen(!open)}
        open={open}
      />
    </Flex>
  );
};

export default observer((props: ChannelsNavbarProps) => (
  <ChannelsNavbar {...props} />
));
