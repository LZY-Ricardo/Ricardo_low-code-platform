import { RouterProvider } from 'react-router-dom';
import { router } from './router/index';
import { useEffect } from 'react';
import { useAuthStore } from './stores/auth';

export default function App() {
  const { checkAuth } = useAuthStore();

  // 页面加载时检查登录状态
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <RouterProvider router={router} />;
}
