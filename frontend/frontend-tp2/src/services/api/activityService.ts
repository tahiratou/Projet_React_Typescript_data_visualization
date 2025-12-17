// Service pour suivre les activités utilisateur
export interface UserActivity {
  searches: number;
  pdfExports: number;
  datasetsViewed: number;
}

const ACTIVITY_KEY = 'user_activity';

export const activityService = {
  // Récupérer les activités
  getActivities: (): UserActivity => {
    const stored = localStorage.getItem(ACTIVITY_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { searches: 0, pdfExports: 0, datasetsViewed: 0 };
      }
    }
    return { searches: 0, pdfExports: 0, datasetsViewed: 0 };
  },

  // Incrémenter les recherches
  incrementSearches: () => {
    const activities = activityService.getActivities();
    activities.searches += 1;
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities));
  },

  // Incrémenter les exports PDF
  incrementPdfExports: () => {
    const activities = activityService.getActivities();
    activities.pdfExports += 1;
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities));
  },

  // Incrémenter les datasets consultés
  incrementDatasetsViewed: () => {
    const activities = activityService.getActivities();
    activities.datasetsViewed += 1;
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities));
  },

  // Réinitialiser les activités
  resetActivities: () => {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify({ searches: 0, pdfExports: 0, datasetsViewed: 0 }));
  },

  // Réinitialiser lors de la déconnexion
  clearOnLogout: () => {
    localStorage.removeItem(ACTIVITY_KEY);
  },
};