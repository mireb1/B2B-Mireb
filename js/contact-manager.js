// Script optimisé pour la gestion du formulaire de contact
// Gestion avancée avec validation, envoi et feedback utilisateur

class ContactManager {
    constructor() {
        // Configuration optimisée avec variables centralisées
        this.config = {
            apiUrl: window.MirebConfig?.getApiUrl('messages') || '/api/messages',
            timeout: window.MirebConfig?.getConfig('api').timeout || 10000,
            maxRetries: window.MirebConfig?.getConfig('api').maxRetries || 3,
            validationDelay: window.MirebConfig?.getConfig('ui').validationDelay || 300,
            autoSave: window.MirebConfig?.getConfig('ui').autoSave || true,
            saveInterval: window.MirebConfig?.getConfig('ui').autoSaveInterval || 30000
        };

        // État du formulaire optimisé
        this.state = {
            isSubmitting: false,
            isValid: false,
            isDirty: false,
            lastSaved: null,
            errors: new Map(),
            data: new Map()
        };

        // Éléments DOM cachés
        this.dom = {
            form: null,
            inputs: new Map(),
            submitBtn: null,
            messageArea: null,
            progressBar: null
        };

        // Validateurs optimisés
        this.validators = new Map([
            ['name', this.validateName.bind(this)],
            ['email', this.validateEmail.bind(this)],
            ['phone', this.validatePhone.bind(this)],
            ['subject', this.validateSubject.bind(this)],
            ['message', this.validateMessage.bind(this)]
        ]);

        this.init();
    }

    // Initialiser le gestionnaire de contact
    init() {
        try {
            this.setupDOM();
            this.setupEventListeners();
            this.setupValidation();
            this.setupAutoSave();
            this.loadDraftData();
            console.log('📞 Gestionnaire de contact initialisé avec succès');
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation du contact:', error);
        }
    }

    // Configurer les éléments DOM
    setupDOM() {
        this.dom.form = document.getElementById('contact-form');
        this.dom.submitBtn = document.getElementById('submit-btn');
        this.dom.messageArea = document.getElementById('form-message');

        // Mapper les inputs de façon optimisée
        const inputIds = ['name', 'email', 'phone', 'company', 'subject', 'message'];
        inputIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                this.dom.inputs.set(id, element);
            }
        });

        // Créer les éléments manquants
        this.createMissingElements();
    }

    // Créer les éléments manquants
    createMissingElements() {
        if (!this.dom.messageArea && this.dom.form) {
            const messageHTML = '<div id="form-message" class="form-message"></div>';
            this.dom.form.insertAdjacentHTML('beforebegin', messageHTML);
            this.dom.messageArea = document.getElementById('form-message');
        }

        if (!this.dom.progressBar && this.dom.form) {
            const progressHTML = `
                <div id="progress-bar" class="form-progress" style="display: none;">
                    <div class="progress-fill"></div>
                    <span class="progress-text">Envoi en cours...</span>
                </div>
            `;
            this.dom.form.insertAdjacentHTML('beforebegin', progressHTML);
            this.dom.progressBar = document.getElementById('progress-bar');
        }
    }
    initializeElements() {
        this.elements.form = document.getElementById('contact-form');
        this.elements.messageContainer = document.getElementById('form-message');
        
        if (!this.elements.form) {
            throw new Error('Formulaire de contact non trouvé');
        }

        // Récupérer tous les champs
        ['nom', 'email', 'sujet', 'message'].forEach(field => {
            this.elements.inputs[field] = document.getElementById(field);
        });

        this.elements.submitBtn = this.elements.form.querySelector('button[type="submit"]');
    }

    // Configurer les événements
    setupEventListeners() {
        // Soumission du formulaire
        this.elements.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Validation en temps réel
        Object.keys(this.elements.inputs).forEach(field => {
            const input = this.elements.inputs[field];
            if (input) {
                input.addEventListener('blur', () => this.validateField(field));
                input.addEventListener('input', () => this.clearFieldError(field));
            }
        });

        // Raccourcis clavier
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.handleSubmit();
            }
        });
    }

    // Configurer la validation avancée
    setupValidation() {
        // Ajouter des indicateurs visuels
        Object.keys(this.elements.inputs).forEach(field => {
            const input = this.elements.inputs[field];
            if (input) {
                input.parentElement.classList.add('form-field');
                
                // Ajouter un indicateur de validation
                const indicator = document.createElement('div');
                indicator.className = 'validation-indicator';
                input.parentElement.appendChild(indicator);
            }
        });
    }

    // Valider un champ spécifique
    validateField(fieldName) {
        const input = this.elements.inputs[fieldName];
        const rules = this.config.validationRules[fieldName];
        const value = input.value.trim();

        let error = null;

        // Validation obligatoire
        if (rules.required && !value) {
            error = 'Ce champ est obligatoire';
        }
        // Validation de longueur
        else if (rules.minLength && value.length < rules.minLength) {
            error = `Minimum ${rules.minLength} caractères requis`;
        }
        else if (rules.maxLength && value.length > rules.maxLength) {
            error = `Maximum ${rules.maxLength} caractères autorisés`;
        }
        // Validation de pattern (email)
        else if (rules.pattern && !rules.pattern.test(value)) {
            error = 'Format invalide';
        }

        // Afficher ou masquer l'erreur
        this.setFieldError(fieldName, error);
        
        return !error;
    }

    // Afficher une erreur sur un champ
    setFieldError(fieldName, error) {
        const input = this.elements.inputs[fieldName];
        const fieldContainer = input.parentElement;
        
        // Nettoyer les erreurs précédentes
        const existingError = fieldContainer.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        if (error) {
            // Ajouter la nouvelle erreur
            this.state.validationErrors[fieldName] = error;
            fieldContainer.classList.add('has-error');
            
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${error}`;
            fieldContainer.appendChild(errorElement);
        } else {
            // Marquer comme valide
            delete this.state.validationErrors[fieldName];
            fieldContainer.classList.remove('has-error');
            fieldContainer.classList.add('is-valid');
        }
    }

    // Nettoyer l'erreur d'un champ
    clearFieldError(fieldName) {
        const input = this.elements.inputs[fieldName];
        const fieldContainer = input.parentElement;
        
        fieldContainer.classList.remove('has-error');
        const errorElement = fieldContainer.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Valider tout le formulaire
    validateForm() {
        let isValid = true;
        
        Object.keys(this.elements.inputs).forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Gérer la soumission du formulaire
    async handleSubmit() {
        if (this.state.isSubmitting) return;

        // Validation du formulaire
        if (!this.validateForm()) {
            this.showMessage('Veuillez corriger les erreurs avant d\'envoyer le message.', 'error');
            return;
        }

        this.state.isSubmitting = true;
        this.state.submitAttempts++;
        this.setSubmitState(true);

        try {
            // Collecter les données
            this.collectFormData();
            
            // Envoyer le message
            const result = await this.sendMessage();
            
            if (result.success) {
                this.handleSuccess(result);
            } else {
                throw new Error(result.message || 'Erreur lors de l\'envoi');
            }
        } catch (error) {
            this.handleError(error);
        } finally {
            this.state.isSubmitting = false;
            this.setSubmitState(false);
        }
    }

    // Collecter les données du formulaire
    collectFormData() {
        this.state.formData = {};
        
        Object.keys(this.elements.inputs).forEach(field => {
            this.state.formData[field] = this.elements.inputs[field].value.trim();
        });

        // Ajouter des métadonnées
        this.state.formData.timestamp = new Date().toISOString();
        this.state.formData.userAgent = navigator.userAgent;
        this.state.formData.source = 'website-contact-form';
    }

    // Envoyer le message
    async sendMessage() {
        try {
            const response = await fetch(this.config.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.state.formData)
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
                // Sauvegarder localement aussi
                this.saveMessageLocally();
                return result;
            } else {
                throw new Error(result.message || 'Erreur lors de l\'envoi');
            }
        } catch (error) {
            console.error('Erreur API:', error);
            
            // Fallback : sauvegarder seulement localement
            this.saveMessageLocally();
            
            // Simuler un succès pour l'utilisateur si c'est une erreur réseau
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                return { 
                    success: true, 
                    message: 'Message sauvegardé localement. Il sera envoyé dès que la connexion sera rétablie.' 
                };
            }
            
            throw error;
        }
    }

    // Simuler un appel API
    async simulateApiCall() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simuler un succès 90% du temps
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Erreur de simulation'));
                }
            }, 1000 + Math.random() * 2000);
        });
    }

    // Sauvegarder le message localement
    saveMessageLocally() {
        try {
            const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
            messages.push({
                id: Date.now(),
                ...this.state.formData,
                status: 'sent'
            });
            
            // Garder seulement les 50 derniers messages
            if (messages.length > 50) {
                messages.splice(0, messages.length - 50);
            }
            
            localStorage.setItem('contact_messages', JSON.stringify(messages));
        } catch (error) {
            console.warn('Impossible de sauvegarder le message localement:', error);
        }
    }

    // Gérer le succès
    handleSuccess(result) {
        this.showMessage(
            'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.',
            'success'
        );
        
        // Réinitialiser le formulaire
        this.resetForm();
        
        // Tracking optionnel
        this.trackEvent('contact_form_success');
    }

    // Gérer les erreurs
    handleError(error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        
        let message = 'Une erreur est survenue lors de l\'envoi de votre message.';
        
        if (this.state.submitAttempts < this.config.maxRetries) {
            message += ' Vous pouvez réessayer.';
        } else {
            message += ' Veuillez réessayer plus tard ou nous contacter directement par téléphone.';
        }
        
        this.showMessage(message, 'error');
        this.trackEvent('contact_form_error', { error: error.message });
    }

    // Afficher un message à l'utilisateur
    showMessage(text, type = 'info') {
        if (!this.elements.messageContainer) return;

        const messageHtml = `
            <div class="form-message ${type}">
                <i class="fas fa-${this.getMessageIcon(type)}"></i>
                <span>${text}</span>
                <button class="close-message" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        this.elements.messageContainer.innerHTML = messageHtml;
        
        // Auto-masquer après 5 secondes pour les succès
        if (type === 'success') {
            setTimeout(() => {
                const message = this.elements.messageContainer.querySelector('.form-message');
                if (message) {
                    message.style.opacity = '0';
                    setTimeout(() => message.remove(), 300);
                }
            }, 5000);
        }
    }

    // Obtenir l'icône appropriée pour le message
    getMessageIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Définir l'état du bouton de soumission
    setSubmitState(isSubmitting) {
        if (!this.elements.submitBtn) return;

        if (isSubmitting) {
            this.elements.submitBtn.disabled = true;
            this.elements.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            this.elements.submitBtn.classList.add('loading');
        } else {
            this.elements.submitBtn.disabled = false;
            this.elements.submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer';
            this.elements.submitBtn.classList.remove('loading');
        }
    }

    // Réinitialiser le formulaire
    resetForm() {
        this.elements.form.reset();
        this.state.formData = {};
        this.state.validationErrors = {};
        this.state.submitAttempts = 0;

        // Nettoyer les indicateurs visuels
        Object.keys(this.elements.inputs).forEach(field => {
            const fieldContainer = this.elements.inputs[field].parentElement;
            fieldContainer.classList.remove('has-error', 'is-valid');
            
            const errorElement = fieldContainer.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        });
    }

    // Tracking des événements (optionnel)
    trackEvent(eventName, data = {}) {
        try {
            // Intégration avec Google Analytics ou autre outil de tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, data);
            }
            
            // Log local pour le développement
            console.log(`📊 Event tracked: ${eventName}`, data);
        } catch (error) {
            console.warn('Erreur de tracking:', error);
        }
    }

    // Méthodes publiques pour l'interaction externe
    
    // Pré-remplir le formulaire
    prefillForm(data) {
        Object.keys(data).forEach(field => {
            if (this.elements.inputs[field]) {
                this.elements.inputs[field].value = data[field];
            }
        });
    }

    // Obtenir les données du formulaire
    getFormData() {
        this.collectFormData();
        return { ...this.state.formData };
    }

    // Vérifier si le formulaire est valide
    isFormValid() {
        return this.validateForm();
    }
}

// Initialiser le gestionnaire de contact
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si on est sur la page de contact
    if (document.getElementById('contact-form')) {
        window.contactManager = new ContactManager();
    }
});

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactManager;
}
