import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { register } from '../../store/slices/authSlice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!email.includes('@')) {
      setError('Adresse email invalide');
      return;
    }

    setLoading(true);

    try {
      await dispatch(register({ username, email, password })).unwrap();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  // Validation du mot de passe en temps réel
  const isPasswordValid = password.length >= 6;
  const isPasswordMatch = password === confirmPassword && password.length > 0;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">


        {/* Carte d'inscription */}
        <Card className="shadow-xl border border-gray-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Créer un compte
            </CardTitle>
            <CardDescription className="text-center">
              Remplissez le formulaire pour vous inscrire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Message d'erreur */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Nom d'utilisateur */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  Nom d'utilisateur
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choisissez un nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  Adresse courriel
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-gray-500" />
                  Mot de passe
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full"
                />
                {password.length > 0 && (
                  <div className="flex items-center space-x-2 text-sm">
                    {isPasswordValid ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Mot de passe valide</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <span className="text-orange-600">Au moins 6 caractères requis</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Confirmation mot de passe */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-gray-500" />
                  Confirmer le mot de passe
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Retapez votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full"
                />
                {confirmPassword.length > 0 && (
                  <div className="flex items-center space-x-2 text-sm">
                    {isPasswordMatch ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Les mots de passe correspondent</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-red-600">Les mots de passe ne correspondent pas</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Bouton d'inscription */}
              <Button
                type="submit"
                disabled={loading || !isPasswordValid || !isPasswordMatch}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Création du compte...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    <span>Créer mon compte</span>
                  </>
                )}
              </Button>
            </form>

            {/* Lien vers connexion */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Vous avez déjà un compte ?{' '}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Se connecter
                </Link>
              </p>
            </div>

            {/* Lien vers page d'accueil */}
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
              >
                ← Retour à l'accueil
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 OGSL Data Platform</p>
          <p className="mt-1">Projet académique - UQAR</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;