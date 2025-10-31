'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { LogOut, Loader2 } from 'lucide-react';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showConfirmDialog?: boolean;
  allDevices?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function LogoutButton({
  variant = 'outline',
  size = 'default',
  showConfirmDialog = true,
  allDevices = false,
  children,
  className,
}: LogoutButtonProps) {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout({ 
        allDevices,
        redirect: true,
        callbackUrl: '/login'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const LogoutButtonContent = () => (
    <Button
      variant={variant}
      size={size}
      disabled={isLoading}
      className={className}
      onClick={showConfirmDialog ? undefined : handleLogout}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4 mr-2" />
      )}
      {children || (allDevices ? 'Sign Out All Devices' : 'Sign Out')}
    </Button>
  );

  if (!showConfirmDialog) {
    return <LogoutButtonContent />;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <LogoutButtonContent />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {allDevices ? 'Sign Out All Devices?' : 'Sign Out?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {allDevices 
              ? 'This will sign you out from all devices and sessions. You will need to sign in again on all devices.'
              : 'Are you sure you want to sign out? You will need to sign in again to access your account.'
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing Out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                {allDevices ? 'Sign Out All' : 'Sign Out'}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}