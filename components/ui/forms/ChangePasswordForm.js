import React, { useState } from 'react';
import {
  Sheet,
  Typography,
  FormControl,
  FormLabel,
  Input,
  Button,
} from '@mui/joy';
import { Grid } from '@mui/material';

const ChangePasswordForm = ({ submitPasswordChange }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!currentPassword || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Clear any previous error messages
    setError(null);

    submitPasswordChange({
      current_password: currentPassword,
      new_password: confirmPassword,
    });
  };

  return (
    <Grid
      container
      style={{
        margin: '0',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '400px',
      }}
    >
      <Sheet
        sx={{
          width: '100%',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'sm',
          boxShadow: 'md',
        }}
        variant="outlined"
      >
        <div>
          <Typography level="h4" component="h1">
            <b>Change Password</b>
          </Typography>
          <Typography level="body-sm">
            Provide current password to continue.
          </Typography>
        </div>

        <form onSubmit={submitHandler}>
          <FormControl sx={{ my: 2 }}>
            <FormLabel>Current Password</FormLabel>
            <Input
              // html input attribute
              name="current-password"
              type="password"
              placeholder="current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ my: 2 }}>
            <FormLabel>Password</FormLabel>
            <Input
              // html input attribute
              name="password"
              type="password"
              placeholder="new password"
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ my: 2 }}>
            <FormLabel>Password confirmation</FormLabel>
            <Input
              // html input attribute
              name="password-confirm"
              type="password"
              placeholder="confirm new password"
              minLength="6"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <Button
            type="submit"
            sx={{
              mt: 1,
              background: 'linear-gradient(45deg, #ffe622, #ff54fd, #2196F3);',
              fontSize: '1.1rem',
              opacity: '1',
              color: 'white',
            }}
          >
            Change Password
          </Button>
        </form>
      </Sheet>
    </Grid>
  );
};

export default ChangePasswordForm;
