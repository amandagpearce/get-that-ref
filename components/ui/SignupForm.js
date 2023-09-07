import * as React from 'react';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';

const SignupForm = () => {
  return (
    <Sheet
      sx={{
        width: 400,
        // mx: 'auto', // margin left & right
        my: 4, // margin top & bottom
        py: 4, // padding top & bottom
        px: 4, // padding left & right
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
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
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          // html input attribute
          name="name"
          type="text"
          placeholder="Your Name Here"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          // html input attribute
          name="email"
          type="email"
          placeholder="youremail@email.com"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input
          // html input attribute
          name="password"
          type="password"
          placeholder="password"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Password confirmation</FormLabel>
        <Input
          // html input attribute
          name="password"
          type="password"
          placeholder="password"
        />
      </FormControl>

      <Button sx={{ mt: 1 /* margin top */, background: '#0d3769' }}>
        Sign Up
      </Button>
    </Sheet>
  );
};

export default SignupForm;
