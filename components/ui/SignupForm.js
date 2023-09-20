import React, { useState } from 'react';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';

const SignupForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Clear any previous error messages
    setError(null);

    onSubmit({
      signup: {
        email,
        password,
      },
    });
  };

  return (
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
          <b>Sign Up</b>
        </Typography>
        <Typography level="body-sm">Sign up to continue.</Typography>
      </div>

      <form onSubmit={submitHandler}>
        <FormControl sx={{ my: 2 }}>
          <FormLabel>Email</FormLabel>
          <Input
            // html input attribute
            name="email"
            type="email"
            placeholder="youremail@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl sx={{ my: 2 }}>
          <FormLabel>Password</FormLabel>
          <Input
            // html input attribute
            name="password"
            type="password"
            placeholder="password"
            minLength="6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <FormControl sx={{ my: 2 }}>
          <FormLabel>Password confirmation</FormLabel>
          <Input
            // html input attribute
            name="password"
            type="password"
            placeholder="password"
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
          Sign Up
        </Button>
      </form>
    </Sheet>
  );
};

export default SignupForm;
