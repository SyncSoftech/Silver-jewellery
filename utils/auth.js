export const isAuthenticated = () => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('token');
  }
  return false;
};

export const redirectToLogin = (router) => {
  if (typeof window !== 'undefined') {
    // Store the current URL to redirect back after login
    const currentPath = window.location.pathname;
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  }
};
