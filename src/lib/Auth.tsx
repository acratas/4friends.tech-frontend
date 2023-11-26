const Auth = {
    setToken : (token: string) => {
        localStorage.setItem('token_ttl', (Date.now() + 1000 * 60 * 60 * 23).toString());
        localStorage.setItem('token', token)
    },
    getToken : () => localStorage.getItem('token'),
    removeToken : () => {
        localStorage.removeItem('token');
        localStorage.removeItem('token_ttl');
    },
    isAuthenticated : () => !!localStorage.getItem('token'),
    isExpired: () => localStorage.getItem('token_ttl') && Date.now() > parseInt(localStorage.getItem('token_ttl') || '0')
}

export default Auth;
