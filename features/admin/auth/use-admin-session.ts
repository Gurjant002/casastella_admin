import {useEffect, useState} from 'react';
import {ApiError, loginAdmin} from '@/lib/api';
import {readStoredAdminToken, writeStoredAdminToken} from '@/features/admin/auth/session-storage';

export function useAdminSession() {
  const [token, setToken] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const [username, setUsername] = useState('admin@casastella.com');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken(readStoredAdminToken());
    setIsHydrated(true);
  }, []);

  async function login() {
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await loginAdmin({username, password});
      setToken(response.access_token);
      writeStoredAdminToken(response.access_token);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(`API ${error.status}: ${error.message}`);
      } else {
        setErrorMessage('No se pudo iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken('');
    writeStoredAdminToken('');
  }

  return {
    token,
    isHydrated,
    username,
    setUsername,
    password,
    setPassword,
    errorMessage,
    loading,
    login,
    logout,
  };
}
