# 🛒 Guide de Gestion des Commandes - Interface Admin B2B Mireb

## 📋 Vue d'ensemble

L'interface admin Shopify de B2B Mireb dispose maintenant d'un système complet de gestion des commandes avec synchronisation temps réel. Toutes les commandes passées sur votre site apparaissent automatiquement dans l'admin.

## 🚀 Accès rapide

- **Interface Admin :** [admin-shopify.html](https://mireb1.github.io/B2B-Mireb/admin-shopify.html)
- **Page d'accueil :** [index.html](https://mireb1.github.io/B2B-Mireb/index.html) 
- **Test des commandes :** [test-orders.html](https://mireb1.github.io/B2B-Mireb/test-orders.html)

## 📊 Fonctionnalités Principales

### 1. **Tableau de Bord des Commandes**
- Statistiques en temps réel
- Compteurs : Total, Terminées, En attente, Urgentes
- Alertes automatiques pour commandes urgentes (> 7 jours)

### 2. **Filtres Avancés**
- **Par statut :** En attente, Confirmée, En préparation, Expédiée, Livrée, Annulée
- **Par période :** Aujourd'hui, Cette semaine, Ce mois, Cette année
- **Recherche :** Par nom client, référence commande, produit

### 3. **Actions sur les Commandes**
- **👁️ Voir :** Affiche tous les détails de la commande
- **✏️ Modifier :** Éditer les informations (en développement)
- **🗑️ Supprimer :** Supprimer définitivement la commande

### 4. **Export et Analyse**
- **Export CSV :** Télécharge toutes les commandes au format CSV
- **Actualisation :** Met à jour les données en temps réel
- **Synchronisation automatique** avec la page d'accueil

## 🔄 Synchronisation Temps Réel

### Comment ça fonctionne
1. **Client passe commande** → Page d'accueil (index.html)
2. **Commande sauvegardée** → LocalStorage du navigateur
3. **Notification automatique** → Interface admin mise à jour
4. **Affichage immédiat** → Commande visible dans l'admin

### Événements synchronisés
- ✅ Nouvelle commande reçue
- ✅ Modification de statut
- ✅ Suppression de commande
- ✅ Mise à jour des statistiques

## 📱 Statuts des Commandes

| Statut | Description | Couleur |
|--------|-------------|---------|
| **En attente** | Commande reçue, en attente de confirmation | 🟡 Jaune |
| **Confirmée** | Commande confirmée par l'équipe | 🔵 Bleu |
| **En préparation** | Commande en cours de préparation | 🟠 Orange |
| **Expédiée** | Commande envoyée au client | 🟢 Vert |
| **Livrée** | Commande reçue par le client | 🟢 Vert foncé |
| **Annulée** | Commande annulée | 🔴 Rouge |

## 🎯 Guide d'utilisation

### Étape 1 : Accéder à l'interface
1. Ouvrez [admin-shopify.html](https://mireb1.github.io/B2B-Mireb/admin-shopify.html)
2. L'onglet **Commandes** est activé par défaut
3. Les statistiques se chargent automatiquement

### Étape 2 : Créer des commandes de test
1. Ouvrez [test-orders.html](https://mireb1.github.io/B2B-Mireb/test-orders.html)
2. Cliquez sur **"5 Commandes Test"** pour créer des exemples
3. Retournez sur l'admin → Les commandes apparaissent instantanément

### Étape 3 : Filtrer et rechercher
1. Utilisez les **filtres** en haut de la liste
2. **Recherchez** par nom de client ou référence
3. **Filtrez par période** pour voir les commandes récentes

### Étape 4 : Gérer les commandes
1. **Cliquez sur "Voir"** pour afficher les détails complets
2. **Modifiez le statut** selon l'avancement
3. **Exportez en CSV** pour vos analyses

### Étape 5 : Synchronisation avec la page d'accueil
1. Ouvrez [index.html](https://mireb1.github.io/B2B-Mireb/index.html) dans un autre onglet
2. Passez une commande test
3. Retournez sur l'admin → La commande apparaît automatiquement !

## 🔧 Fonctionnalités Techniques

### LocalStorage
- **Clé principale :** `commandes`
- **Format :** Tableau JSON avec tous les détails
- **Synchronisation :** Cross-tab via événements `storage`

### Événements CustomEvent
```javascript
// Nouvelle commande
window.dispatchEvent(new CustomEvent('newOrderReceived', {
    detail: orderData
}));

// Mise à jour commandes
window.dispatchEvent(new CustomEvent('ordersUpdated', {
    detail: { orders: allOrders, timestamp: Date.now() }
}));
```

### API JavaScript
```javascript
// Accéder au gestionnaire
window.orderManager.orders           // Toutes les commandes
window.orderManager.addOrder(data)   // Ajouter une commande
window.orderManager.deleteOrder(id)  // Supprimer une commande
```

## 📈 Métriques et Analyses

### Statistiques disponibles
- **Total des commandes**
- **Commandes terminées** (livrées)
- **Commandes en attente**
- **Commandes urgentes** (> 7 jours)
- **Valeur totale** en DH

### Export CSV
Le fichier CSV contient :
- ID de commande
- Informations client (nom, téléphone, adresse)
- Détails produit et prix
- Date et statut
- Mode de paiement
- Notes supplémentaires

## 🚨 Alertes et Notifications

### Notifications automatiques
- ✅ **Nouvelle commande reçue**
- ✅ **Commande supprimée**
- ✅ **Export réussi**
- ✅ **Synchronisation effectuée**

### Commandes urgentes
- Commandes **en attente depuis plus de 7 jours**
- Affichage en **rouge** dans les statistiques
- **Compteur dédié** sur le tableau de bord

## 🔗 Intégration avec la page d'accueil

### Formulaire de commande (index.html)
Lorsqu'un client passe commande :
1. **Données collectées :** Nom, téléphone, adresse, produit, prix
2. **Validation :** Vérification des champs obligatoires
3. **Sauvegarde :** LocalStorage + événement de notification
4. **Confirmation :** Message de succès au client

### Synchronisation bidirectionnelle
- **Page → Admin :** Nouvelles commandes apparaissent
- **Admin → Page :** Modifications synchronisées
- **Multi-onglets :** Même synchronisation entre plusieurs onglets admin

## 🎨 Interface Utilisateur

### Design moderne (style Shopify)
- **Sidebar navigation** avec icônes
- **Cards modernes** avec ombres subtiles
- **Statistiques colorées** avec icônes
- **Tableau responsive** adaptatif mobile
- **Modals élégantes** pour les détails

### Expérience utilisateur
- **Chargement instantané** des données
- **Filtres en temps réel** sans rechargement
- **Actions contextuelles** sur chaque commande
- **Retours visuels** pour toutes les actions

## 🔄 Tests et Validation

### Test rapide complet
1. **Ouvrir test-orders.html** → Créer commandes test
2. **Ouvrir admin-shopify.html** → Vérifier synchronisation
3. **Tester filtres** → Appliquer différents critères
4. **Voir détails** → Ouvrir modal d'une commande
5. **Export CSV** → Télécharger le fichier

### Scénarios de test
- ✅ Commande simple depuis page d'accueil
- ✅ Commandes multiples en batch
- ✅ Commandes urgentes (anciennes)
- ✅ Filtrage par statut et période
- ✅ Recherche par mots-clés
- ✅ Export CSV complet
- ✅ Synchronisation multi-onglets

## 📞 Support et Dépannage

### Problèmes courants
1. **Commandes ne s'affichent pas :** Vérifiez localStorage et rechargez
2. **Synchronisation lente :** Actualisez manuellement avec le bouton
3. **Export CSV vide :** Vérifiez qu'il y a des commandes dans le système

### Debug
```javascript
// Console développeur
console.log(localStorage.getItem('commandes'));  // Voir les commandes
window.orderManager.orders;                      // Accéder aux données
```

---

## 🎉 C'est Prêt !

Votre interface de gestion des commandes B2B Mireb est maintenant **complètement opérationnelle** avec :

✅ **Synchronisation temps réel** page ↔ admin  
✅ **Interface moderne** style Shopify  
✅ **Gestion complète** des commandes  
✅ **Statistiques avancées** et filtres  
✅ **Export CSV** professionnel  
✅ **Notifications automatiques**  

**Liens de test :**
- 🏪 [Page d'accueil (clients)](https://mireb1.github.io/B2B-Mireb/index.html)
- 🛠️ [Interface admin (gestion)](https://mireb1.github.io/B2B-Mireb/admin-shopify.html)
- 🧪 [Tests des commandes](https://mireb1.github.io/B2B-Mireb/test-orders.html)

Votre marketplace B2B est maintenant **prête pour la production** ! 🚀
