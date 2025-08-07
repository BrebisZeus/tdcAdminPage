"use client";

import { useState } from 'react';
import { User, Mail, Lock, FileText, Heart, Shield, Users } from 'lucide-react';

// Simulation de l'API Supabase pour la démo
const mockSupabase = {
  auth: {
    admin: {
      createUser: async (userData) => {
        // Simulation d'une création d'utilisateur
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (userData.email === 'error@test.com') {
          return { data: null, error: { message: 'Email déjà utilisé' } };
        }
        return {
          data: { user: { id: 'user_' + Date.now() } },
          error: null
        };
      }
    }
  },
  from: (table) => ({
    insert: async (data) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (Math.random() < 0.1) { // 10% chance d'erreur pour la démo
        return { error: { message: 'Erreur de base de données simulée' } };
      }
      return { error: null };
    }
  })
};

export default function CreateUserForm() {
  const [form, setForm] = useState({ email: '', password: '', nom: '', bio: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 1. Créer le compte Auth
      const { data: userData, error: authError } = await mockSupabase.auth.admin.createUser({
        email: form.email,
        password: form.password,
        email_confirm: true
      });

      if (authError) {
        setMessage(`Erreur Auth: ${authError.message}`);
        setIsLoading(false);
        return;
      }

      const userId = userData.user.id;

      // 2. Créer le profil dans la table utilisateurs
      const { error: insertError } = await mockSupabase.from('utilisateurs').insert([
        {
          id: userId,
          nom: form.nom,
          email: form.email,
          is_admin: false,
          statut_valide: false,
          bio: form.bio
        }
      ]);

      if (insertError) {
        setMessage(`Erreur DB: ${insertError.message}`);
      } else {
        setMessage("Utilisateur créé avec succès !");
        setForm({ email: '', password: '', nom: '', bio: '' });
      }
    } catch (error) {
      setMessage(`Erreur: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      {/* Éléments décoratifs de fond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-green-200/30 to-teal-200/30 rounded-full blur-2xl"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Header avec logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-lg mb-6 relative overflow-hidden">
            {/* Logo intégré - représentation simplifiée basée sur votre image */}
            <div className="relative">
              <div className="w-16 h-12 relative">
                {/* Mains entrelacées stylisées */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-3 h-6 bg-orange-400 rounded-full transform -rotate-12 absolute left-0"></div>
                    <div className="w-3 h-6 bg-orange-300 rounded-full transform rotate-12 absolute right-0"></div>
                    <div className="w-4 h-4 bg-orange-500 rounded-full absolute top-1 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Application des Tiers
          </h1>
          <h2 className="text-2xl font-semibold text-teal-600 mb-4">
            Digne de Confiance
          </h2>
          
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
            <Heart className="w-5 h-5 text-pink-400" />
            <span className="text-sm">Créons ensemble une communauté de confiance</span>
            <Users className="w-5 h-5 text-teal-400" />
          </div>
        </div>

        {/* Carte du formulaire */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Shield className="w-7 h-7 text-teal-500" />
            <h3 className="text-2xl font-bold text-gray-800">Créer un nouveau membre</h3>
          </div>

          <div className="space-y-6">
            {/* Champ Nom */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 text-orange-400" />
                Nom complet
              </label>
              <input
                type="text"
                name="nom"
                value={form.nom}
                placeholder="Entrez le nom complet"
                onChange={handleChange}
                required
                className="w-full px-4 py-4 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200/50 transition-all duration-300 text-gray-800 placeholder-gray-500"
              />
            </div>

            {/* Champ Email */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 text-teal-400" />
                Adresse email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                placeholder="membre@exemple.com"
                onChange={handleChange}
                required
                className="w-full px-4 py-4 bg-gradient-to-r from-teal-50 to-green-50 border-2 border-teal-200 rounded-2xl focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200/50 transition-all duration-300 text-gray-800 placeholder-gray-500"
              />
            </div>

            {/* Champ Mot de passe */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Lock className="w-4 h-4 text-purple-400" />
                Mot de passe sécurisé
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                placeholder="Créez un mot de passe fort"
                onChange={handleChange}
                required
                className="w-full px-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200/50 transition-all duration-300 text-gray-800 placeholder-gray-500"
              />
            </div>

            {/* Champ Bio */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 text-pink-400" />
                Présentation (optionnel)
              </label>
              <textarea
                name="bio"
                value={form.bio}
                placeholder="Parlez-nous un peu de cette personne..."
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-4 bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200/50 transition-all duration-300 text-gray-800 placeholder-gray-500 resize-none"
              />
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-400 via-green-400 to-blue-400 hover:from-teal-500 hover:via-green-500 hover:to-blue-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                  Création en cours...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" />
                  Créer le compte membre
                </div>
              )}
            </button>

            {/* Message de retour */}
            {message && (
              <div className={`p-4 rounded-2xl border-2 ${
                message.includes('succès')
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <div className="flex items-center gap-2">
                  {message.includes('succès') ? (
                    <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  ) : (
                    <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center text-white text-xs">!</div>
                  )}
                  <span className="font-medium">{message}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-teal-400" />
            <span>Plateforme sécurisée</span>
          </div>
          <p>Toutes les données sont protégées et traitées avec confidentialité</p>
        </div>
      </div>
    </div>
  );
}
