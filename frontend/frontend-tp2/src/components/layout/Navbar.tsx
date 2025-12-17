import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService, UserProfile } from '../../services/api/userService';
import { Database, LogOut, User, BarChart3 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { Button } from '../ui/button';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setProfile(data);
                
      } catch (error) {
        console.error('Erreur chargement profil:', error);
      }
    };
    fetchProfile();
  }, []);

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <Database className="h-6 w-6" />
            <span className="text-xl font-bold">OGSL</span>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/dashboard"
                className="flex items-center space-x-1 hover:text-blue-400 transition"
              >
                <Database className="h-4 w-4" />
                <span>Datasets</span>
              </Link>
              <Link
                to="/statistics"
                className="flex items-center space-x-1 hover:text-blue-400 transition"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Statistiques</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center space-x-1 hover:text-blue-400 transition"
              >
                <User className="h-4 w-4" />
                <span>Profil</span>
              </Link>
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-300">
                  Bonjour, {profile?.username || 'Utilisateur'}!
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-white hover:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-white">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-slate-900">
                    Inscription
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;