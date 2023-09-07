import { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Container } from '@mui/material';
import Link from 'next/link';
import { useSearch } from '../../context/SearchContext';

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

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const { handleSearchInputChange } = useSearch();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleInputChange = (event) => {
    const query = event.target.value;
    handleSearchInputChange(query);
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
      <Link href="/login">
        <MenuItem onClick={handleMenuClose}>Login</MenuItem>
      </Link>
      <MenuItem onClick={handleMenuClose}>My Favourites</MenuItem>
      <MenuItem onClick={handleMenuClose}>Sent References</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          sx={{ fontSize: '28px', color: '#FFF' }} // Adjust size and color here
          color="inherit"
        >
          <AccountCircle
            sx={{
              background: 'linear-gradient(45deg, #ffe622, #ff54fd, #2196F3)',
              borderRadius: '100%',
            }}
          />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
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
            <Link href="/">
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
                  }}
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
            </Box>

            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Container>
    </Box>
  );
}
