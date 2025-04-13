import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Link, 
  Alert 
} from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/inicio');
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('¡Revisa tu correo para confirmar el registro!');
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMessage('¡Enlace de recuperación enviado a tu correo!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          {mode === 'login' && 'Iniciar sesión'}
          {mode === 'signup' && 'Crear cuenta'}
          {mode === 'forgot' && 'Recuperar contraseña'}
        </Typography>

        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{message}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {mode !== 'forgot' && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 
              mode === 'login' ? 'Iniciar sesión' : 
              mode === 'signup' ? 'Registrarse' : 'Enviar enlace'}
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {mode === 'login' ? (
              <>
                <Link href="#" variant="body2" onClick={() => setMode('signup')}>
                  ¿No tienes cuenta? Regístrate
                </Link>
                <Link href="#" variant="body2" onClick={() => setMode('forgot')}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </>
            ) : (
              <Link href="#" variant="body2" onClick={() => setMode('login')}>
                Volver a inicio de sesión
              </Link>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;