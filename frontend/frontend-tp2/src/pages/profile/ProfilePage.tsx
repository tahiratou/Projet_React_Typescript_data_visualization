import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, Activity, Search, FileDown, Eye } from 'lucide-react';
import { userService, UserProfile } from '../../services/api/userService';
import { activityService } from '../../services/api/activityService';
import Layout from '../../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState({ searches: 0, pdfExports: 0, datasetsViewed: 0 });
  const [loading, setLoading] = useState(true);
  
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Charger le profil et les activités
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setProfile(data);
        setEmail(data.email);
        
        // Charger les activités depuis localStorage
        const userActivities = activityService.getActivities();
        setActivities(userActivities);
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur chargement profil:', error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
      return;
    }

    try {
      const updateData: any = {};
      
      if (email !== profile?.email) {
        updateData.email = email;
      }

      if (newPassword) {
        if (!currentPassword) {
          setMessage({ type: 'error', text: 'Veuillez entrer votre mot de passe actuel' });
          return;
        }
        updateData.new_password = newPassword;
        updateData.current_password = currentPassword;
      }

      await userService.updateProfile(updateData);
      
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      setIsEditing(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Recharger le profil
      const updatedProfile = await userService.getProfile();
      setProfile(updatedProfile);
      setEmail(updatedProfile.email);
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Erreur lors de la mise à jour du profil' 
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <User className="mr-3 text-blue-600" />
          Mon Profil
        </h1>

        {/* Informations du compte */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informations du compte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <User className="text-gray-500 h-5 w-5" />
                <div>
                  <label className="text-sm text-gray-500">Nom d'utilisateur</label>
                  <p className="text-lg font-medium">{profile?.username}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="text-gray-500 h-5 w-5" />
                <div>
                  <label className="text-sm text-gray-500">Adresse courriel</label>
                  <p className="text-lg font-medium">{profile?.email || 'Non défini'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Activity className="text-gray-500 h-5 w-5" />
                <div>
                  <label className="text-sm text-gray-500">Membre depuis</label>
                  <p className="text-lg font-medium">
                    {profile?.date_joined 
                      ? new Date(profile.date_joined).toLocaleDateString('fr-CA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => setIsEditing(!isEditing)} 
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                {isEditing ? 'Annuler' : 'Modifier mon profil'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques d'activité */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Activités
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <Search className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                <p className="text-4xl font-bold text-blue-600">{activities.searches}</p>
                <p className="text-sm text-gray-700 mt-2 font-medium">Recherches</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <FileDown className="h-10 w-10 text-green-600 mx-auto mb-3" />
                <p className="text-4xl font-bold text-green-600">{activities.pdfExports}</p>
                <p className="text-sm text-gray-700 mt-2 font-medium">Exports PDF</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <Eye className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                <p className="text-4xl font-bold text-purple-600">{activities.datasetsViewed}</p>
                <p className="text-sm text-gray-700 mt-2 font-medium">Datasets consultés</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              Les activités sont enregistrées localement sur cet appareil
            </p>
          </CardContent>
        </Card>

        {/* Formulaire de modification */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>Modifier les informations</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {message && (
                  <div className={`p-4 rounded-lg border ${
                    message.type === 'success' 
                      ? 'bg-green-50 text-green-800 border-green-200' 
                      : 'bg-red-50 text-red-800 border-red-200'
                  }`}>
                    {message.text}
                  </div>
                )}

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Nouvelle adresse courriel
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nouvelle@email.com"
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                    <Lock className="mr-2 h-5 w-5" />
                    Changer le mot de passe
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Mot de passe actuel
                      </label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Mot de passe actuel"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Nouveau mot de passe
                      </label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nouveau mot de passe (min. 6 caractères)"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Confirmer le nouveau mot de passe
                      </label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmez le mot de passe"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer les modifications
                  </Button>
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => {
                      setIsEditing(false);
                      setMessage(null);
                      setEmail(profile?.email || '');
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;