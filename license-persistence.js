/**
 * Système de persistance des clés de licence pour DarkGPT
 * Gère la sauvegarde, la validation et l'expiration des clés
 * Les clés restent permanentes jusqu'à suppression manuelle ou expiration
 */

(function() {
    'use strict';

    // Configuration
    const STORAGE_KEYS = {
        LICENSE_KEY: 'darkgpt_license_key',
        LICENSE_HISTORY: 'darkgpt_license_history',
        LICENSE_METADATA: 'darkgpt_license_metadata',
        UNLOCKED: 'darkgpt_unlocked'
    };

    /**
     * Classe pour gérer les licences
     */
    class LicenseManager {
        constructor() {
            this.currentKey = null;
            this.licenseHistory = [];
            this.init();
        }

        /**
         * Initialiser le gestionnaire de licence
         */
        init() {
            this.loadLicenseHistory();
            this.loadCurrentLicense();
            this.setupAutoValidation();
        }

        /**
         * Charger l'historique des licences
         */
        loadLicenseHistory() {
            try {
                const stored = localStorage.getItem(STORAGE_KEYS.LICENSE_HISTORY);
                this.licenseHistory = stored ? JSON.parse(stored) : [];
            } catch (e) {
                console.error('Erreur lors du chargement de l\'historique des licences:', e);
                this.licenseHistory = [];
            }
        }

        /**
         * Charger la licence actuelle
         */
        loadCurrentLicense() {
            const key = localStorage.getItem(STORAGE_KEYS.LICENSE_KEY);
            if (key) {
                this.currentKey = key;
                // Vérifier que la licence est valide
                this.validateCurrentLicense();
            }
        }

        /**
         * Sauvegarder une nouvelle licence
         * @param {string} key - La clé de licence
         * @param {string} planType - Type de plan (Premium, Trimestriel, Permanent)
         */
        saveLicense(key, planType = 'Permanent') {
            const licenseData = {
                key: key,
                planType: planType,
                savedAt: new Date().toISOString(),
                lastValidated: new Date().toISOString(),
                isActive: true,
                validationCount: 0
            };

            // Sauvegarder la clé actuelle
            this.currentKey = key;
            localStorage.setItem(STORAGE_KEYS.LICENSE_KEY, key);

            // Ajouter à l'historique
            this.licenseHistory.unshift(licenseData);
            
            // Garder les 100 dernières licences
            this.licenseHistory = this.licenseHistory.slice(0, 100);
            localStorage.setItem(STORAGE_KEYS.LICENSE_HISTORY, JSON.stringify(this.licenseHistory));

            // Marquer comme déverrouillé
            localStorage.setItem(STORAGE_KEYS.UNLOCKED, 'true');

            console.log('Licence sauvegardée:', key);
            return licenseData;
        }

        /**
         * Valider la licence actuelle
         */
        async validateCurrentLicense() {
            if (!this.currentKey) {
                return false;
            }

            try {
                const response = await fetch('/api/validate-key', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: this.currentKey })
                });

                const data = await response.json();

                if (data.valid) {
                    // Mettre à jour le timestamp de validation
                    this.updateValidationTimestamp(this.currentKey);
                    return true;
                } else {
                    console.warn('Licence invalide:', data.message);
                    this.handleInvalidLicense();
                    return false;
                }
            } catch (e) {
                console.error('Erreur lors de la validation de la licence:', e);
                return false;
            }
        }

        /**
         * Mettre à jour le timestamp de validation
         */
        updateValidationTimestamp(key) {
            const index = this.licenseHistory.findIndex(l => l.key === key);
            if (index !== -1) {
                this.licenseHistory[index].lastValidated = new Date().toISOString();
                this.licenseHistory[index].validationCount = 
                    (this.licenseHistory[index].validationCount || 0) + 1;
                localStorage.setItem(STORAGE_KEYS.LICENSE_HISTORY, JSON.stringify(this.licenseHistory));
            }
        }

        /**
         * Gérer une licence invalide
         */
        handleInvalidLicense() {
            localStorage.removeItem(STORAGE_KEYS.UNLOCKED);
            // Ne pas supprimer la clé, juste la marquer comme invalide
            const index = this.licenseHistory.findIndex(l => l.key === this.currentKey);
            if (index !== -1) {
                this.licenseHistory[index].isActive = false;
                localStorage.setItem(STORAGE_KEYS.LICENSE_HISTORY, JSON.stringify(this.licenseHistory));
            }
        }

        /**
         * Supprimer une licence
         * @param {string} key - La clé à supprimer
         */
        async deleteLicense(key) {
            try {
                // Appel API pour supprimer côté serveur
                const response = await fetch('/api/admin/delete-key', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('admin_password') || 'admin123'}`
                    },
                    body: JSON.stringify({ key: key })
                });

                if (response.ok) {
                    // Supprimer de l'historique local
                    this.licenseHistory = this.licenseHistory.filter(l => l.key !== key);
                    localStorage.setItem(STORAGE_KEYS.LICENSE_HISTORY, JSON.stringify(this.licenseHistory));

                    // Si c'est la clé actuelle, la supprimer
                    if (this.currentKey === key) {
                        localStorage.removeItem(STORAGE_KEYS.LICENSE_KEY);
                        localStorage.removeItem(STORAGE_KEYS.UNLOCKED);
                        this.currentKey = null;
                    }

                    console.log('Licence supprimée:', key);
                    return true;
                }
            } catch (e) {
                console.error('Erreur lors de la suppression de la licence:', e);
            }
            return false;
        }

        /**
         * Obtenir l'historique des licences
         */
        getLicenseHistory() {
            return [...this.licenseHistory];
        }

        /**
         * Obtenir les informations de la licence actuelle
         */
        getCurrentLicenseInfo() {
            if (!this.currentKey) {
                return null;
            }

            const licenseData = this.licenseHistory.find(l => l.key === this.currentKey);
            return licenseData || {
                key: this.currentKey,
                planType: 'Inconnu',
                savedAt: 'N/A',
                isActive: true
            };
        }

        /**
         * Configurer la validation automatique
         */
        setupAutoValidation() {
            // Valider la licence toutes les 5 minutes
            setInterval(() => {
                if (this.currentKey) {
                    this.validateCurrentLicense();
                }
            }, 5 * 60 * 1000);

            // Valider au changement de visibilité de la page
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden && this.currentKey) {
                    this.validateCurrentLicense();
                }
            });
        }

        /**
         * Exporter l'historique des licences
         */
        exportHistory(format = 'json') {
            const data = {
                exportedAt: new Date().toISOString(),
                currentLicense: this.getCurrentLicenseInfo(),
                history: this.licenseHistory
            };

            if (format === 'json') {
                return JSON.stringify(data, null, 2);
            } else if (format === 'csv') {
                let csv = 'Clé,Type de Plan,Sauvegardée,Dernière Validation,Statut,Validations\n';
                this.licenseHistory.forEach(l => {
                    csv += `"${l.key}","${l.planType}","${l.savedAt}","${l.lastValidated}","${l.isActive ? 'Active' : 'Inactive'}",${l.validationCount}\n`;
                });
                return csv;
            }
            return null;
        }

        /**
         * Importer des licences depuis un fichier
         */
        importLicenses(jsonData) {
            try {
                const data = JSON.parse(jsonData);
                if (data.history && Array.isArray(data.history)) {
                    this.licenseHistory = [...data.history, ...this.licenseHistory];
                    this.licenseHistory = this.licenseHistory.slice(0, 100);
                    localStorage.setItem(STORAGE_KEYS.LICENSE_HISTORY, JSON.stringify(this.licenseHistory));
                    return true;
                }
            } catch (e) {
                console.error('Erreur lors de l\'importation des licences:', e);
            }
            return false;
        }

        /**
         * Nettoyer les licences expirées (optionnel)
         */
        cleanupExpiredLicenses() {
            const now = new Date();
            const before = this.licenseHistory.length;

            this.licenseHistory = this.licenseHistory.filter(l => {
                // Garder les licences permanentes
                if (l.planType === 'Permanent') {
                    return true;
                }

                // Garder les licences actives
                if (l.isActive) {
                    return true;
                }

                // Garder les licences supprimées depuis moins de 30 jours
                const deletedAt = new Date(l.lastValidated);
                const daysSinceDeleted = (now - deletedAt) / (1000 * 60 * 60 * 24);
                return daysSinceDeleted < 30;
            });

            if (before !== this.licenseHistory.length) {
                localStorage.setItem(STORAGE_KEYS.LICENSE_HISTORY, JSON.stringify(this.licenseHistory));
            }
        }
    }

    // Créer une instance globale
    window.licenseManager = new LicenseManager();

    // Exposer les méthodes publiques
    window.saveLicense = (key, planType) => window.licenseManager.saveLicense(key, planType);
    window.deleteLicense = (key) => window.licenseManager.deleteLicense(key);
    window.getLicenseHistory = () => window.licenseManager.getLicenseHistory();
    window.getCurrentLicenseInfo = () => window.licenseManager.getCurrentLicenseInfo();
    window.exportLicenseHistory = (format) => window.licenseManager.exportHistory(format);
    window.importLicenses = (data) => window.licenseManager.importLicenses(data);

    // Intégration avec le système de licence existant
    // Intercepter la fonction checkLicense existante
    const originalCheckLicense = window.checkLicense;
    if (typeof originalCheckLicense === 'function') {
        window.checkLicense = async function() {
            const input = document.getElementById('license-key').value;
            
            // Sauvegarder la licence dans notre système
            if (input) {
                window.licenseManager.saveLicense(input);
            }

            // Appeler la fonction originale
            return originalCheckLicense.call(this);
        };
    }

    // Intégration avec la fonction logout
    const originalLogout = window.logout;
    if (typeof originalLogout === 'function') {
        window.logout = function() {
            // Ne pas supprimer la licence, juste déverrouiller
            localStorage.removeItem('darkgpt_unlocked');
            location.reload();
        };
    }

    console.log('Système de persistance des licences initialisé');

})();
