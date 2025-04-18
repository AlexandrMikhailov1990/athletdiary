import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getUser } from '@/utils/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  adminOnly?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRole = 'user',
  adminOnly = false
}) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getUser();
        
        // Если пользователь не авторизован, перенаправляем на страницу входа
        if (!user) {
          router.push(`/login?returnUrl=${encodeURIComponent(router.asPath)}`);
          return;
        }
        
        // Если используется adminOnly или требуется роль admin, проверяем, является ли пользователь админом
        if ((adminOnly || requiredRole === 'admin') && user.role !== 'admin') {
          console.log('Доступ запрещен: требуется роль admin');
          router.push('/');
          return;
        }
        
        setAuthorized(true);
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, requiredRole, adminOnly]);

  // Показываем индикатор загрузки, пока проверяем авторизацию
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Возвращаем скрытый div, если пользователь не авторизован
  return authorized ? <>{children}</> : <div style={{ display: 'none' }}></div>;
};

export default AuthGuard; 