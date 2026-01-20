/**
 * Système de fond animé avec particules pour DarkGPT
 * Crée un effet visuel spectaculaire sans interférer avec le code existant
 */

(function() {
    'use strict';

    // Créer le conteneur principal du fond animé
    function initAnimatedBackground() {
        // Vérifier si le conteneur existe déjà
        if (document.querySelector('.animated-bg-container')) {
            return;
        }

        // Créer le conteneur
        const bgContainer = document.createElement('div');
        bgContainer.className = 'animated-bg-container';

        // Créer les couches d'animation
        const layers = [
            { className: 'bg-layer-base', role: 'Base gradient' },
            { className: 'bg-layer-glow', role: 'Glow pulsant' },
            { className: 'bg-layer-cyan', role: 'Lumière cyan' },
            { className: 'bg-layer-purple', role: 'Lumière violette' },
            { className: 'bg-layer-grid', role: 'Grille holographique' },
            { className: 'bg-layer-scan', role: 'Scan horizontal' },
            { className: 'bg-layer-noise', role: 'Texture bruit' },
            { className: 'bg-layer-top-light', role: 'Lumière supérieure' },
            { className: 'bg-layer-bottom-light', role: 'Lumière inférieure' }
        ];

        // Ajouter les couches
        layers.forEach(layer => {
            const div = document.createElement('div');
            div.className = layer.className;
            bgContainer.appendChild(div);
        });

        // Insérer le conteneur au début du body
        document.body.insertBefore(bgContainer, document.body.firstChild);

        // Générer les particules
        generateParticles(bgContainer);
    }

    // Générer les particules animées
    function generateParticles(container) {
        const particleCount = {
            small: 30,
            medium: 20,
            large: 10
        };

        // Créer les petites particules
        for (let i = 0; i < particleCount.small; i++) {
            createParticle(container, 'particle-small', Math.random() * 15 + 5);
        }

        // Créer les particules moyennes
        for (let i = 0; i < particleCount.medium; i++) {
            createParticle(container, 'particle-medium', Math.random() * 20 + 10);
        }

        // Créer les grandes particules
        for (let i = 0; i < particleCount.large; i++) {
            createParticle(container, 'particle-large', Math.random() * 25 + 15);
        }
    }

    // Créer une particule individuelle
    function createParticle(container, className, duration) {
        const particle = document.createElement('div');
        particle.className = `particle ${className}`;

        // Position aléatoire horizontale
        const xPos = Math.random() * 100;
        particle.style.left = xPos + '%';
        particle.style.bottom = '-10px';

        // Ajouter un délai aléatoire
        const delay = Math.random() * duration;
        particle.style.animationDelay = delay + 's';
        particle.style.animationDuration = duration + 's';

        container.appendChild(particle);

        // Recréer la particule après son animation
        setTimeout(() => {
            particle.remove();
            createParticle(container, className, duration);
        }, (duration + delay) * 1000);
    }

    // Initialiser au chargement du DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimatedBackground);
    } else {
        initAnimatedBackground();
    }

    // Réinitialiser les particules toutes les 60 secondes pour un effet continu
    setInterval(() => {
        const container = document.querySelector('.animated-bg-container');
        if (container) {
            // Nettoyer les anciennes particules
            const particles = container.querySelectorAll('.particle');
            if (particles.length < 50) {
                generateParticles(container);
            }
        }
    }, 60000);

    // Gestion de la visibilité de la page
    document.addEventListener('visibilitychange', () => {
        const container = document.querySelector('.animated-bg-container');
        if (container) {
            if (document.hidden) {
                container.style.opacity = '0.5';
            } else {
                container.style.opacity = '1';
            }
        }
    });

    // Amélioration du rendu sur les appareils mobiles
    function optimizeForMobile() {
        const isMobile = window.innerWidth < 768;
        const container = document.querySelector('.animated-bg-container');
        
        if (isMobile && container) {
            // Réduire le nombre de particules sur mobile
            const particles = container.querySelectorAll('.particle');
            const toRemove = Math.floor(particles.length * 0.5);
            
            for (let i = 0; i < toRemove; i++) {
                particles[i].remove();
            }
        }
    }

    // Optimiser au chargement et au redimensionnement
    window.addEventListener('load', optimizeForMobile);
    window.addEventListener('resize', () => {
        let resizeTimer;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(optimizeForMobile, 250);
    });

})();
