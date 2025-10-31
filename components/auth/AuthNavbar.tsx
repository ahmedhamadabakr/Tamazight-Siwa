'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogoutButton } from './LogoutButton';
import { 
  User, 
  Settings, 
  Shield, 
  UserCircle, 
  LogIn,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export function AuthNavbar() {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Memoize user initials to prevent recalculation
  const userInitials = useMemo(() => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [user?.name]);

  // Memoize role badge color
  const roleBadgeColor = useMemo(() => {
    switch (user?.role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'user':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }, [user?.role]);

  // Memoize dashboard URL
  const dashboardUrl = useMemo(() => {
    switch (user?.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'manager':
        return `/dashboard/${user.id}`;
      case 'user':
        return `/user/${user.id}`;
      default:
        return '/';
    }
  }, [user?.role, user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/login">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/register">
            Sign Up
          </Link>
        </Button>
      </div>
    );
  }



  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">
                {user.fullName || user.name}
              </p>
              <Badge className={roleBadgeColor}>
                {user.role?.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              ID: {user.id}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href={dashboardUrl} className="cursor-pointer">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/security" className="cursor-pointer">
            <Shield className="mr-2 h-4 w-4" />
            <span>Security Settings</span>
          </Link>
        </DropdownMenuItem>
        
        {user.role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link href="/admin/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Admin Settings</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <div className="p-2">
          <LogoutButton
            variant="ghost"
            size="sm"
            showConfirmDialog={false}
            className="w-full justify-start"
          />
        </div>
        
        <div className="p-2">
          <LogoutButton
            variant="destructive"
            size="sm"
            allDevices={true}
            className="w-full justify-start"
          >
            Sign Out All Devices
          </LogoutButton>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}