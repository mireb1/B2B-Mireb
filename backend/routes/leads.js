// Routes pour la gestion des leads CRM
const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const adminAuth = require('../middleware/adminAuth');

// Toutes les routes nécessitent une authentification admin
router.use(adminAuth);

// Routes CRUD pour les leads
router.get('/', leadController.getLeads);
router.post('/', leadController.createLead);
router.put('/:id', leadController.updateLead);
router.delete('/:id', leadController.deleteLead);

// Routes spécifiques pour les leads
router.post('/:id/notes', leadController.addNote);
router.post('/:id/convert', leadController.convertLead);
router.put('/:id/assign', leadController.assignLead);

// Routes pour les statistiques et imports
router.get('/stats', leadController.getLeadStats);
router.post('/import/social', leadController.importSocialLeads);

// Webhook pour recevoir les leads Facebook
router.post('/webhook/facebook', async (req, res) => {
    try {
        const { entry } = req.body;
        
        if (entry && entry[0] && entry[0].changes) {
            for (const change of entry[0].changes) {
                if (change.field === 'leadgen') {
                    const leadData = change.value;
                    
                    // Traiter le lead Facebook
                    const lead = {
                        name: leadData.field_data?.find(f => f.name === 'full_name')?.values?.[0] || 'Nom inconnu',
                        email: leadData.field_data?.find(f => f.name === 'email')?.values?.[0] || '',
                        phone: leadData.field_data?.find(f => f.name === 'phone_number')?.values?.[0] || '',
                        source: 'Facebook',
                        interest: leadData.ad_name || 'Général',
                        campaignId: leadData.campaign_id,
                        adSetId: leadData.adset_id,
                        metadata: {
                            facebook_lead_id: leadData.id,
                            form_id: leadData.form_id
                        }
                    };

                    await leadController.createLead({ body: lead }, { 
                        status: () => ({ json: () => {} }),
                        json: () => {}
                    });
                }
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Erreur webhook Facebook:', error);
        res.status(500).send('Error');
    }
});

// Webhook pour recevoir les leads Instagram
router.post('/webhook/instagram', async (req, res) => {
    try {
        const { entry } = req.body;
        
        // Traitement similaire pour Instagram
        // À implémenter selon l'API Instagram
        
        res.status(200).send('OK');
    } catch (error) {
        console.error('Erreur webhook Instagram:', error);
        res.status(500).send('Error');
    }
});

// Vérification des webhooks (Facebook/Instagram)
router.get('/webhook/facebook', (req, res) => {
    const VERIFY_TOKEN = process.env.FACEBOOK_WEBHOOK_TOKEN || 'mireb_webhook_token';
    
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook Facebook vérifié');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

router.get('/webhook/instagram', (req, res) => {
    const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_TOKEN || 'mireb_webhook_token';
    
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook Instagram vérifié');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

module.exports = router;
