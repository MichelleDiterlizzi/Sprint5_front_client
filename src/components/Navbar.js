import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import { SearchContext } from '../context/SearchContext';

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { search, setSearch } = useContext(SearchContext);

  const handleProfileClick = () => {
    navigate(isAuthenticated ? '/profile' : '/login');
  };

  const handleCreateEvent = () => {
    navigate('/events/new');
  };

  return (
    <nav className="bg-white shadow flex items-center justify-between px-6 py-2 sticky top-0 z-50">
      {/* Logo / Nombre */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}> 
        <span className="text-2xl font-bold text-indigo-600">Eventify 🎉</span>
      </div>
      {/* Barra de búsqueda */}
      <Paper
        component="form"
        className="flex items-center px-2 py-1 w-64 md:w-96"
        elevation={0}
        style={{ background: '#f3f4f6' }}
        onSubmit={e => e.preventDefault()}
      >
        <InputBase
          placeholder="Buscar eventos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 text-sm"
          inputProps={{ 'aria-label': 'buscar eventos' }}
        />
        <IconButton type="submit" aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      {/* Acciones */}
      <div className="flex items-center gap-2">
        <IconButton color="primary" onClick={handleCreateEvent} title="Crear evento">
          <AddCircleOutlineIcon />
        </IconButton>
        <IconButton color="primary" onClick={handleProfileClick} title="Perfil o Login">
          <AccountCircleIcon />
        </IconButton>
      </div>
    </nav>
  );
};

export default Navbar; 