import React from 'react';

import { Channel } from '../../../src/modules/channels/types';
import { User } from '../../../src/modules/users/types';
import Button from '../Button';
import './index.sass';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

const CreateChannelForm = ({
  onSubmit,
  onClose,
  user,
  users,
  open,
  ...props
}: {
  user: User;
  users: User[];
  open: boolean;
  onSubmit: (c: Channel, users: string[]) => Promise<any>;
  onClose: () => void;
}) => {
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [channelName, setChannelName] = React.useState('');

  const handleChangeMultiple = (
    event: React.ChangeEvent<{
      name?: string;
      value: User[];
    }>
  ) => setSelectedUsers(event.target.value);

  return (
    <Dialog
      fullWidth
      onClose={() => {}}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle>Create Channel</DialogTitle>
      <DialogContent className="create-channel-form">
        <TextField
          fullWidth
          className="create-channel-form__channel-name"
          label="Name"
          onChange={(e) => {
            setChannelName(e.target.value);
          }}
          placeholder="Channel Name for example, the-immutalbes"
        />
        <FormControl fullWidth>
          <InputLabel id="users-select-label">Users</InputLabel>
          <Select
            name="users-select"
            labelId="demo-mutiple-name-label"
            id="demo-mutiple-name"
            multiple
            value={selectedUsers}
            onChange={handleChangeMultiple}
            input={<Input />}
            renderValue={(selected: User[]) =>
              selected.map((user) => <span title={user.username}>{ user.name }</span>)
            }
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {users
              .filter((u) => u.id !== user.id)
              .map((u) => (
                <MenuItem
                  key={user.id}
                  // @ts-ignore: For some resone the type must be string but this is not true.
                  value={u}
                  selected={
                    !!selectedUsers.find(
                      (selectedUser) => selectedUser.id === u.id
                    )
                  }
                >
                  <span title={u.username}>{ u.name }</span>  
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button color="create" label="Close" onClick={onClose} />
        <Button
          color="submit"
          label="Create"
          onClick={() => {
            onSubmit(new Channel(channelName), [
              ...selectedUsers.map((user) => user.id),
              user.id,
            ]).then((ok) => {
              setSelectedUsers([]);
            });
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default CreateChannelForm;
