import { useState, useContext, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useSearch } from '../../context/SearchContext';
import { useHttpClient } from '../../hooks/http-hook';
import AuthContext from '../../context/auth-context';

import { styled, alpha } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  InputBase,
  MenuItem,
  Menu,
  Container,
} from '@mui/material';
import { Search as SearchIcon, AccountCircle } from '@mui/icons-material';
import ClickAwayListener from '@mui/material/ClickAwayListener';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha('#EEE', 0.4),
  '&:hover': {
    backgroundColor: alpha('#EEE', 0.8),
  },
  color: '#0d3769',
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: '10px 20px',
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '1.3em',
    [theme.breakpoints.up('md')]: {
      width: '23ch',
    },
  },
}));

export default function Header({ toggleModal }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const { handleSearchInputChange } = useSearch();
  const authContext = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const router = useRouter();
  const searchInputRef = useRef(null);

  useEffect(() => {
    console.log('authContext', authContext);
  }, [authContext]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = () => {
    handleMenuClose();
    toggleModal();
  };

  const handleLogoutClick = async () => {
    try {
      const res = await sendRequest(
        'http://localhost:5000/logout',
        'POST',
        null,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authContext.token}`,
        }
      );

      console.log('res', res);
      authContext.logout();
    } catch (err) {
      console.log('error', err);
    }
  };

  const handleInputChange = (event) => {
    // Check if the current page is not the home page
    if (router.pathname !== '/') {
      router.push('/');
    }

    const query = event.target.value;
    searchInputRef.current.value = query;
    handleSearchInputChange(query);
  };

  const clearSearchInput = () => {
    console.log('searchInputRef.current', searchInputRef.current.value);
    if (searchInputRef.current) {
      searchInputRef.current.value = ''; // Clear the input value
      handleSearchInputChange('');
    }
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {!authContext.isLoggedIn && (
        <MenuItem onClick={handleLoginClick}>Login</MenuItem>
      )}
      {authContext.isLoggedIn && (
        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
      )}

      {authContext.isLoggedIn && authContext.userType === 'admin' && (
        <MenuItem>
          <Link
            style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.87)' }}
            href="/admin-account"
          >
            Refs to approve
          </Link>
        </MenuItem>
      )}

      {authContext.isLoggedIn && authContext.userType !== 'admin' && (
        <MenuItem>
          <Link
            style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.87)' }}
            href="/send-a-reference"
          >
            Send a reference
          </Link>
        </MenuItem>
      )}
    </Menu>
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        background: '#FFF',
        padding: '0',
        boxShadow: '0px -1px 11px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Container maxWidth="xlg" p={0}>
        <AppBar
          position="static"
          sx={{
            background: 'transparent',
            padding: '10px 0',
            paddingLeft: '0',
            paddingRight: '0',
            boxShadow: 'none',
          }}
        >
          <Toolbar style={{ paddingLeft: '0' }}>
            <Link href="/" onClick={clearSearchInput}>
              <img
                src="/logo.png"
                width="180"
                alt="Got that ref?"
                style={{ filter: 'hue-rotate(258deg)' }}
              />
            </Link>

            <Box
              sx={{ display: { xs: 'none', md: 'flex' }, marginLeft: 'auto' }}
            >
              <Search sx={{ marginLeft: 'auto' }}>
                <StyledInputBase
                  placeholder="Search series or movie title"
                  inputProps={{
                    'aria-label': 'search',
                    value: searchInputRef.current
                      ? searchInputRef.current.value
                      : '',
                  }}
                  ref={searchInputRef}
                  onChange={handleInputChange}
                  endAdornment={<SearchIcon sx={{ margin: '20px' }} />}
                />
              </Search>
            </Box>

            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignSelf: 'center',
              }}
            >
              <ClickAwayListener onClickAway={handleMenuClose}>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  sx={{ color: '#fff', padding: '0' }}
                  color="inherit"
                >
                  <AccountCircle
                    sx={{
                      background:
                        'linear-gradient(45deg, #ffe622, #ff54fd, #2196F3)',
                      borderRadius: '100%',
                      width: '2.1em',
                      height: 'auto',
                    }}
                  />
                </IconButton>
              </ClickAwayListener>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMenu}
      </Container>
    </Box>
  );
}
