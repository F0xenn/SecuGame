import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Lock, Home, Search, MoreHorizontal, ThumbsUp, MessageCircle, Share2, Globe, Users, X } from 'lucide-react';

export default function ChromeApp({ gameState, onUpdateGameState, selectedPhoto, onAddTransaction, onPhotoPublished, currentTask, onTaskStepComplete, onStartNextTask }) {
  const [currentUrl, setCurrentUrl] = useState('https://www.facebook.com');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [postText, setPostText] = useState('');
  const [hasPublished, setHasPublished] = useState(false);
  const [publishedPost, setPublishedPost] = useState(null);
  const [showConsequences, setShowConsequences] = useState(false);
  const [consequences, setConsequences] = useState(null);
  
  // États pour la tâche 2 : Demandes d'amis
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [friendRequestHandled, setFriendRequestHandled] = useState(false);

  // États pour la tâche 3 : Message de phishing
  const [showPhishingMessage, setShowPhishingMessage] = useState(false);
  const [phishingMessageRead, setPhishingMessageRead] = useState(false);
  const [showPhishingForm, setShowPhishingForm] = useState(false);
  const [phishingHandled, setPhishingHandled] = useState(false);

  // États pour la tâche 4 : Ami piraté
  const [showHackedFriendMessage, setShowHackedFriendMessage] = useState(false);
  const [hackedFriendHandled, setHackedFriendHandled] = useState(false);
  const [conversationStep, setConversationStep] = useState(1);

  // États pour la tâche 5 : Fake News
  const [showFakeNews, setShowFakeNews] = useState(false);
  const [fakeNewsHandled, setFakeNewsHandled] = useState(false);
  const [showFactCheck, setShowFactCheck] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostMenu, setShowPostMenu] = useState(null);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [hiddenPosts, setHiddenPosts] = useState([]);

  // Les 4 posts pour la tâche 5 (3 fakes + 1 vrai)
  const fakeNewsPosts = [
    {
      id: 'fake-1',
      author: 'Actu Jeunes Info',
      authorPic: '📰',
      time: 'Il y a 15 min',
      content: '🚨 URGENT : Le gouvernement annonce la fermeture de TikTok et Instagram en France à partir du 1er février ! Tous les comptes seront supprimés. Sauvegarde tes photos maintenant ! 😱',
      likes: 3421,
      comments: 892,
      shares: 1205,
      type: 'fake',
      fakeReasons: [
        'Source inconnue sans badge vérifié',
        'Titre sensationnaliste avec "URGENT"',
        'Aucun média officiel n\'en parle',
        'Incitation à l\'action immédiate'
      ]
    },
    {
      id: 'fake-2',
      author: 'InfoWeb France',
      authorPic: '📱',
      time: 'Il y a 1h',
      content: 'NOUVELLE LOI : À partir de mars, les moins de 16 ans devront payer 5€/mois pour utiliser les réseaux sociaux ! Le Parlement a voté hier. Partagez pour informer vos amis ! 💰',
      likes: 2156,
      comments: 445,
      shares: 890,
      type: 'fake',
      fakeReasons: [
        'Aucune source officielle citée',
        'Information non vérifiable',
        'Aucun journal sérieux n\'en parle',
        'Incitation au partage sans preuve'
      ]
    },
    {
      id: 'fake-3',
      author: 'Concours iPhone',
      authorPic: '🎁',
      time: 'Il y a 3h',
      content: '🎉 CONCOURS ! Apple offre 500 iPhone 15 Pro pour fêter ses 50 ans ! Pour participer : LIKE + PARTAGE + COMMENTE "JE PARTICIPE" ! Tirage dans 24h ! 📱✨',
      likes: 8934,
      comments: 3421,
      shares: 5632,
      type: 'fake',
      fakeReasons: [
        'Apple n\'a pas 50 ans (fondé en 1976)',
        'Aucun lien officiel vers Apple',
        'Technique classique d\'arnaque aux likes',
        'Trop beau pour être vrai'
      ]
    },
    {
      id: 'real-1',
      author: 'Le Parisien',
      authorPic: '📰',
      time: 'Il y a 2h',
      content: 'Le PSG s\'impose 3-1 face à Lyon hier soir au Parc des Princes. Mbappé a inscrit un doublé. Le club parisien reste en tête de la Ligue 1. ⚽',
      likes: 1245,
      comments: 234,
      shares: 89,
      type: 'real',
      verified: true
    }
  ];

  // Les 4 profils de demandes d'amis (basé sur le GDD)
  const friendRequests = [
    {
      id: 'sarah',
      name: 'Sarah Dubois',
      profilePic: '👧',
      mutualFriends: 8,
      accountAge: '3 ans',
      posts: 247,
      photos: 89,
      bio: 'Lycée Jean Moulin • Aime la danse 💃',
      recentActivity: 'A publié une photo il y a 2h',
      type: 'real', // Vrai profil
      safetyLevel: 'safe'
    },
    {
      id: 'sexy',
      name: '❤️ Belle Fille Sexy ❤️',
      profilePic: '💋',
      mutualFriends: 0,
      accountAge: 'Créé hier',
      posts: 2,
      photos: 1,
      bio: 'Clique sur le lien dans ma bio 🔥💕',
      recentActivity: 'Aucune activité récente',
      type: 'fake', // Faux profil spam
      safetyLevel: 'danger'
    },
    {
      id: 'thomas',
      name: 'Thomas Mercier',
      profilePic: '👨',
      mutualFriends: 0,
      accountAge: '2 mois',
      posts: 12,
      photos: 3,
      bio: 'J\'adore rencontrer des jeunes 😊',
      recentActivity: 'A commenté sur 15 profils d\'ados',
      age: '30 ans',
      type: 'suspicious', // Adulte suspect
      safetyLevel: 'danger'
    },
    {
      id: 'lucas',
      name: 'Lucas_Gamer_Pro',
      profilePic: '🎮',
      mutualFriends: 0,
      accountAge: 'Créé il y a 3 jours',
      posts: 5,
      photos: 0,
      bio: 'GAGNE 10,000 V-BUCKS GRATUITS ! Clique ici 👉 bit.ly/vbucks',
      recentActivity: 'A envoyé le même message à 50 personnes',
      type: 'scam', // Arnaque
      safetyLevel: 'danger'
    }
  ];

  // Fil d'actualité par défaut (posts des amis)
  const [feedPosts] = useState([
    {
      id: 1,
      author: 'Marie Dubois',
      authorPic: '👧',
      time: 'Il y a 2h',
      content: 'Trop contente de mes nouvelles baskets ! 👟✨',
      likes: 24,
      comments: 5
    },
    {
      id: 2,
      author: 'Lucas Martin',
      authorPic: '👦',
      time: 'Il y a 4h',
      content: 'Qui veut jouer à Fortnite ce soir ? 🎮',
      likes: 18,
      comments: 12
    }
  ]);

  // Gérer la publication
  const handlePublish = () => {
    if (!selectedPhoto) {
      alert('Tu dois d\'abord sélectionner une photo dans "Mes Photos" !');
      return;
    }
    setShowPublishModal(true);
  };

  // Ouvrir les demandes d'amis
  const openFriendRequests = () => {
    setShowFriendRequests(true);
    // ✅ Étape 1 : Ouvrir les demandes d'amis
    if (currentTask && currentTask.id === 2 && onTaskStepComplete) {
      onTaskStepComplete(2, 1, true);
    }
  };

  // Sélectionner un profil pour voir les détails
  const selectProfile = (profile) => {
    setSelectedProfile(profile);
    // ✅ Étape 2 : Analyser les profils
    if (currentTask && currentTask.id === 2 && onTaskStepComplete) {
      onTaskStepComplete(2, 2, true);
    }
  };

  // Accepter une demande d'ami
  const acceptFriendRequest = (profile) => {
    setFriendRequestHandled(true);
    setShowFriendRequests(false);
    
    // ✅ Étape 3 : Faire ton choix
    if (currentTask && currentTask.id === 2 && onTaskStepComplete) {
      onTaskStepComplete(2, 3, true);
    }

    // Calculer les conséquences après 1 seconde
    setTimeout(() => {
      calculateFriendRequestConsequences(profile);
    }, 1000);
  };

  // Refuser une demande d'ami
  const declineFriendRequest = () => {
    setFriendRequestHandled(true);
    setShowFriendRequests(false);
    setSelectedProfile(null);
    
    // ✅ Étape 3 : Faire ton choix
    if (currentTask && currentTask.id === 2 && onTaskStepComplete) {
      onTaskStepComplete(2, 3, true);
    }

    // Afficher un message neutre
    setTimeout(() => {
      const neutralConsequence = {
        type: 'info',
        title: '🤔 Tu as refusé',
        message: 'Tu as décidé de ne pas accepter cette demande d\'ami. C\'est prudent de bien réfléchir !',
        stats: {
          score: 10
        }
      };
      setConsequences(neutralConsequence);
      setShowConsequences(true);
    }, 1000);
  };

  // Calculer les conséquences selon le profil accepté
  const calculateFriendRequestConsequences = (profile) => {
    let consequenceData = {};

    switch(profile.id) {
      case 'sarah':
        // BON CHOIX - Vrai profil
        consequenceData = {
          type: 'success',
          title: '✅ Excellent choix !',
          message: 'Sarah Dubois est une vraie personne de ton lycée avec 8 amis en commun. C\'est une demande d\'ami légitime !',
          stats: {
            reputation: 5,
            score: 50
          }
        };
        break;

      case 'sexy':
        // DANGER - Faux profil spam
        consequenceData = {
          type: 'critical',
          title: '🚨 Faux profil !',
          message: 'Ce profil est clairement un fake créé hier avec 0 amis en commun. Ces comptes envoient du spam et des virus !',
          stats: {
            reputation: -10,
            accountSecurity: -15,
            score: -20
          }
        };
        break;

      case 'thomas':
        // DANGER - Adulte suspect
        consequenceData = {
          type: 'critical',
          title: '🚨 DANGER : Adulte suspect !',
          message: 'Thomas a 30 ans et commente sur de nombreux profils d\'ados. C\'est un comportement de prédateur potentiel. NE JAMAIS accepter d\'adultes inconnus !',
          stats: {
            reputation: -15,
            parentsTrust: -20,
            accountSecurity: -20,
            score: -30
          }
        };
        break;

      case 'lucas':
        // DANGER - Arnaque
        consequenceData = {
          type: 'warning',
          title: '⚠️ Arnaque aux V-Bucks !',
          message: 'Ce compte propose des V-Bucks gratuits, c\'est une arnaque classique. Ces liens volent tes identifiants !',
          stats: {
            reputation: -10,
            accountSecurity: -15,
            score: -15
          }
        };
        break;

      default:
        consequenceData = {
          type: 'info',
          title: 'Demande traitée',
          message: 'Tu as géré cette demande.',
          stats: { score: 5 }
        };
    }

    setConsequences(consequenceData);
    setShowConsequences(true);

    // Appliquer les changements de stats
    if (consequenceData.stats) {
      const updates = {};
      if (consequenceData.stats.reputation) {
        updates.reputation = Math.max(0, Math.min(100, gameState.reputation + consequenceData.stats.reputation));
      }
      if (consequenceData.stats.parentsTrust) {
        updates.parentsTrust = Math.max(0, Math.min(100, gameState.parentsTrust + consequenceData.stats.parentsTrust));
      }
      if (consequenceData.stats.accountSecurity) {
        updates.accountSecurity = Math.max(0, Math.min(100, gameState.accountSecurity + consequenceData.stats.accountSecurity));
      }
      
      onUpdateGameState(updates);
    }
  };

  // === TÂCHE 3 : MESSAGE DE PHISHING ===

  // Ouvrir le message de phishing
  const openPhishingMessage = () => {
    setShowPhishingMessage(true);
    // ✅ Étape 1 : Lire le message
    if (currentTask && currentTask.id === 3 && onTaskStepComplete) {
      onTaskStepComplete(3, 1, true);
    }
  };

  // Analyser les indices suspects (regarder l'URL, etc.)
  const analyzePhishing = () => {
    // ✅ Étape 2 : Analyser les indices suspects
    if (currentTask && currentTask.id === 3 && onTaskStepComplete) {
      onTaskStepComplete(3, 2, true);
    }
  };

  // Cliquer sur le lien et remplir le formulaire (MAUVAIS CHOIX)
  const clickPhishingLink = () => {
    setShowPhishingForm(true);
    analyzePhishing();
  };

  // Soumettre le formulaire de phishing (CATASTROPHIQUE)
  const submitPhishingForm = () => {
    setPhishingHandled(true);
    setShowPhishingMessage(false);
    setShowPhishingForm(false);
    
    // ✅ Étape 3 : Prendre une décision
    if (currentTask && currentTask.id === 3 && onTaskStepComplete) {
      onTaskStepComplete(3, 3, true);
    }

    // Conséquences catastrophiques
    setTimeout(() => {
      const phishingConsequence = {
        type: 'critical',
        title: '🚨 COMPTE PIRATÉ !',
        message: 'Tu viens de donner ton mot de passe et tes infos bancaires à des hackers ! Ton compte est compromis et ton argent a été volé.',
        accountHacked: true,
        stats: {
          money: -150,
          reputation: -30,
          parentsTrust: -50,
          accountSecurity: -50,
          score: -50
        }
      };
      
      setConsequences(phishingConsequence);
      setShowConsequences(true);
      
      // Appliquer les changements
      const updates = {};
      if (phishingConsequence.stats.money) {
        updates.money = Math.max(0, gameState.money + phishingConsequence.stats.money);
      }
      if (phishingConsequence.stats.reputation) {
        updates.reputation = Math.max(0, Math.min(100, gameState.reputation + phishingConsequence.stats.reputation));
      }
      if (phishingConsequence.stats.parentsTrust) {
        updates.parentsTrust = Math.max(0, Math.min(100, gameState.parentsTrust + phishingConsequence.stats.parentsTrust));
      }
      if (phishingConsequence.stats.accountSecurity) {
        updates.accountSecurity = Math.max(0, Math.min(100, gameState.accountSecurity + phishingConsequence.stats.accountSecurity));
      }
      
      onUpdateGameState(updates);

      // Ajouter transaction frauduleuse
      if (onAddTransaction) {
        onAddTransaction({
          id: Date.now(),
          date: new Date().toLocaleDateString('fr-FR'),
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          description: '🚨 Phishing - Compte piraté',
          amount: 150,
          type: 'debit'
        });
      }
    }, 1000);
  };

  // Ignorer le message (NEUTRE)
  const ignorePhishing = () => {
    setPhishingHandled(true);
    setShowPhishingMessage(false);
    
    // ✅ Étape 3 : Prendre une décision
    if (currentTask && currentTask.id === 3 && onTaskStepComplete) {
      onTaskStepComplete(3, 3, true);
    }

    setTimeout(() => {
      const neutralConsequence = {
        type: 'info',
        title: '🤔 Message ignoré',
        message: 'Tu as ignoré le message. C\'est mieux que de cliquer, mais tu aurais pu le signaler pour protéger les autres utilisateurs.',
        stats: {
          score: 10
        }
      };
      
      setConsequences(neutralConsequence);
      setShowConsequences(true);
    }, 1000);
  };

  // Vérifier d'abord (BON CHOIX)
  const verifyPhishing = () => {
    setPhishingHandled(true);
    setShowPhishingMessage(false);
    analyzePhishing();
    
    // ✅ Étape 3 : Prendre une décision
    if (currentTask && currentTask.id === 3 && onTaskStepComplete) {
      onTaskStepComplete(3, 3, true);
    }

    setTimeout(() => {
      const goodConsequence = {
        type: 'success',
        title: '✅ Bonne réflexion !',
        message: 'Tu as pris le temps de vérifier avant d\'agir. C\'est exactement ce qu\'il faut faire face à un message suspect !',
        stats: {
          reputation: 10,
          accountSecurity: 10,
          score: 30
        }
      };
      
      setConsequences(goodConsequence);
      setShowConsequences(true);
      
      // Appliquer les changements
      const updates = {
        reputation: Math.min(100, gameState.reputation + 10),
        accountSecurity: Math.min(100, gameState.accountSecurity + 10)
      };
      onUpdateGameState(updates);
    }, 1000);
  };

  // Reporter et bloquer (PARFAIT)
  const reportPhishing = () => {
    setPhishingHandled(true);
    setShowPhishingMessage(false);
    analyzePhishing();
    
    // ✅ Étape 3 : Prendre une décision
    if (currentTask && currentTask.id === 3 && onTaskStepComplete) {
      onTaskStepComplete(3, 3, true);
    }

    setTimeout(() => {
      const perfectConsequence = {
        type: 'success',
        title: '🏆 PARFAIT ! Badge "Cyber-Vigilant"',
        message: 'Tu as signalé le phishing et bloqué l\'expéditeur ! Tu protèges les autres utilisateurs. Bravo !',
        badge: 'Cyber-Vigilant',
        stats: {
          reputation: 20,
          accountSecurity: 20,
          score: 50
        }
      };
      
      setConsequences(perfectConsequence);
      setShowConsequences(true);
      
      // Appliquer les changements
      const updates = {
        reputation: Math.min(100, gameState.reputation + 20),
        accountSecurity: Math.min(100, gameState.accountSecurity + 20)
      };
      onUpdateGameState(updates);
    }, 1000);
  };

  // === TÂCHE 4 : AMI PIRATÉ ===

  // Ouvrir le message de l'ami piraté
  const openHackedFriendMessage = () => {
    setShowHackedFriendMessage(true);
    // ✅ Étape 1 : Lire le message
    if (currentTask && currentTask.id === 4 && onTaskStepComplete) {
      onTaskStepComplete(4, 1, true);
    }
  };

  // Analyser les comportements suspects
  const analyzeHackedFriend = () => {
    // ✅ Étape 2 : Repérer les comportements suspects
    if (currentTask && currentTask.id === 4 && onTaskStepComplete && conversationStep >= 2) {
      onTaskStepComplete(4, 2, true);
    }
  };

  // Continuer la conversation (pour analyser)
  const continueConversation = () => {
    setConversationStep(conversationStep + 1);
    analyzeHackedFriend();
  };

  // Envoyer de l'argent (CATASTROPHIQUE)
  const sendMoneyToHacker = () => {
    setHackedFriendHandled(true);
    setShowHackedFriendMessage(false);
    
    // ✅ Étape 3 : Réagir
    if (currentTask && currentTask.id === 4 && onTaskStepComplete) {
      onTaskStepComplete(4, 3, true);
    }

    setTimeout(() => {
      const catastrophicConsequence = {
        type: 'critical',
        title: '🚨 TU T\'ES FAIT ARNAQUER !',
        message: 'Ce n\'était PAS Julien ! Son compte a été piraté. Tu viens d\'envoyer 50€ à un escroc qui ne te les rendra jamais.',
        stats: {
          money: -50,
          reputation: -15,
          parentsTrust: -25,
          score: -30
        }
      };
      
      setConsequences(catastrophicConsequence);
      setShowConsequences(true);
      
      // Appliquer les changements
      const updates = {};
      if (catastrophicConsequence.stats.money) {
        updates.money = Math.max(0, gameState.money + catastrophicConsequence.stats.money);
      }
      if (catastrophicConsequence.stats.reputation) {
        updates.reputation = Math.max(0, Math.min(100, gameState.reputation + catastrophicConsequence.stats.reputation));
      }
      if (catastrophicConsequence.stats.parentsTrust) {
        updates.parentsTrust = Math.max(0, Math.min(100, gameState.parentsTrust + catastrophicConsequence.stats.parentsTrust));
      }
      
      onUpdateGameState(updates);

      // Ajouter transaction
      if (onAddTransaction) {
        onAddTransaction({
          id: Date.now(),
          date: new Date().toLocaleDateString('fr-FR'),
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          description: '🚨 Arnaque - Faux ami piraté',
          amount: 50,
          type: 'debit'
        });
      }
    }, 1000);
  };

  // Donner le code de vérification (GRAVE)
  const giveVerificationCode = () => {
    setHackedFriendHandled(true);
    setShowHackedFriendMessage(false);
    
    // ✅ Étape 3 : Réagir
    if (currentTask && currentTask.id === 4 && onTaskStepComplete) {
      onTaskStepComplete(4, 3, true);
    }

    setTimeout(() => {
      const badConsequence = {
        type: 'critical',
        title: '🚨 Ton compte a été piraté !',
        message: 'En donnant ton code de vérification, le hacker a pu accéder à TON compte ! Maintenant il peut arnaquer tes amis en se faisant passer pour toi.',
        stats: {
          reputation: -20,
          accountSecurity: -30,
          parentsTrust: -20,
          score: -25
        }
      };
      
      setConsequences(badConsequence);
      setShowConsequences(true);
      
      // Appliquer les changements
      const updates = {
        reputation: Math.max(0, gameState.reputation - 20),
        accountSecurity: Math.max(0, gameState.accountSecurity - 30),
        parentsTrust: Math.max(0, gameState.parentsTrust - 20)
      };
      onUpdateGameState(updates);
    }, 1000);
  };

  // Vérifier d'abord (BON)
  const verifyWithRealEmma = () => {
    setHackedFriendHandled(true);
    setShowHackedFriendMessage(false);
    analyzeHackedFriend();
    
    // ✅ Étape 3 : Réagir
    if (currentTask && currentTask.id === 4 && onTaskStepComplete) {
      onTaskStepComplete(4, 3, true);
    }

    setTimeout(() => {
      const goodConsequence = {
        type: 'success',
        title: '✅ Bonne décision !',
        message: 'Tu as vérifié avant d\'agir ! En contactant Emma par un autre moyen (SMS, téléphone), tu as découvert que son compte était piraté. Tu as évité l\'arnaque !',
        stats: {
          reputation: 10,
          accountSecurity: 15,
          score: 40
        }
      };
      
      setConsequences(goodConsequence);
      setShowConsequences(true);
      
      // Appliquer les changements
      const updates = {
        reputation: Math.min(100, gameState.reputation + 10),
        accountSecurity: Math.min(100, gameState.accountSecurity + 15)
      };
      onUpdateGameState(updates);
    }, 1000);
  };

  // Prévenir Emma et signaler (PARFAIT)
  const warnEmmaAndReport = () => {
    setHackedFriendHandled(true);
    setShowHackedFriendMessage(false);
    analyzeHackedFriend();
    
    // ✅ Étape 3 : Réagir
    if (currentTask && currentTask.id === 4 && onTaskStepComplete) {
      onTaskStepComplete(4, 3, true);
    }

    setTimeout(() => {
      const perfectConsequence = {
        type: 'success',
        title: '🏆 PARFAIT ! Badge "Protecteur"',
        message: 'Tu as prévenu Emma que son compte était piraté ET signalé le compte à Facebook ! Tu as protégé Emma et ses autres amis. Bravo !',
        badge: 'Protecteur',
        stats: {
          reputation: 20,
          accountSecurity: 20,
          score: 50
        }
      };
      
      setConsequences(perfectConsequence);
      setShowConsequences(true);
      
      // Appliquer les changements
      const updates = {
        reputation: Math.min(100, gameState.reputation + 20),
        accountSecurity: Math.min(100, gameState.accountSecurity + 20)
      };
      onUpdateGameState(updates);
    }, 1000);
  };

  // === TÂCHE 5 : FAKE NEWS ===

  // Ouvrir le menu contextuel d'un post
  const openPostMenu = (postId) => {
    setShowPostMenu(postId);
    // ✅ Étape 1 : Analyser les posts
    if (currentTask && currentTask.id === 5 && onTaskStepComplete) {
      onTaskStepComplete(5, 1, true);
    }
  };

  // Masquer un post
  const hidePost = (postId) => {
    setHiddenPosts([...hiddenPosts, postId]);
    setShowPostMenu(null);
  };

  // Signaler un post
  const reportPost = (post) => {
    setReportedPosts([...reportedPosts, post.id]);
    setShowPostMenu(null);
    
    // ✅ Étape 2 : Identifier les fake news
    if (currentTask && currentTask.id === 5 && onTaskStepComplete) {
      onTaskStepComplete(5, 2, true);
    }

    // Vérifier si c'est un fake ou un vrai post
    if (post.type === 'fake') {
      // Bon signalement d'une fake news
      showReportConsequences(post, true);
    } else {
      // Mauvais signalement d'un vrai post
      showReportConsequences(post, false);
    }
  };

  // Afficher les conséquences d'un signalement
  const showReportConsequences = (post, isCorrect) => {
    if (isCorrect) {
      // Bon signalement
      const goodReport = {
        type: 'success',
        title: '✅ Bien vu !',
        message: `Tu as correctement identifié une fake news ! Ce post contenait de fausses informations.`,
        stats: {
          reputation: 5,
          score: 15
        }
      };
      
      setConsequences(goodReport);
      setShowConsequences(true);
      
      const updates = {
        reputation: Math.min(100, gameState.reputation + 5)
      };
      onUpdateGameState(updates);

      // Vérifier si toutes les 3 fakes sont signalées
      const fakePostIds = fakeNewsPosts.filter(p => p.type === 'fake').map(p => p.id);
      const reportedFakes = [...reportedPosts, post.id].filter(id => fakePostIds.includes(id));
      
      if (reportedFakes.length === 3) {
        // ✅ Étape 3 : Toutes les fakes signalées
        if (currentTask && currentTask.id === 5 && onTaskStepComplete) {
          onTaskStepComplete(5, 3, true);
        }
        setFakeNewsHandled(true);
        
        // Badge final
        setTimeout(() => {
          const perfectConsequence = {
            type: 'success',
            title: '🏆 PARFAIT ! Badge "Fact-Checker"',
            message: 'Tu as identifié et signalé les 3 fake news ! Tu protèges ta communauté contre la désinformation !',
            badge: 'Fact-Checker',
            stats: {
              reputation: 20,
              accountSecurity: 10,
              score: 50
            }
          };
          
          setConsequences(perfectConsequence);
          setShowConsequences(true);
          
          const updates = {
            reputation: Math.min(100, gameState.reputation + 20),
            accountSecurity: Math.min(100, gameState.accountSecurity + 10)
          };
          onUpdateGameState(updates);
        }, 2000);
      }
    } else {
      // Mauvais signalement d'un vrai post
      const badReport = {
        type: 'warning',
        title: '⚠️ Attention !',
        message: `Ce post du Parisien est vérifié et authentique. Il ne faut signaler que les fausses informations.`,
        stats: {
          reputation: -5,
          score: -10
        }
      };
      
      setConsequences(badReport);
      setShowConsequences(true);
      
      const updates = {
        reputation: Math.max(0, gameState.reputation - 5)
      };
      onUpdateGameState(updates);
    }
  };

  // Ouvrir le fact-check d'un post
  const openFactCheck = (post) => {
    setSelectedPost(post);
    setShowFakeNews(true);
    setShowPostMenu(null);
  };

  const confirmPublish = () => {
    // Créer le post publié
    const newPost = {
      id: 'user-post',
      author: 'Alex Martin',
      authorPic: '😊',
      time: 'À l\'instant',
      content: postText || `Regardez ma photo ! ${selectedPhoto.thumbnail}`,
      photo: selectedPhoto,
      likes: 0,
      comments: []
    };

    setPublishedPost(newPost);
    setHasPublished(true);
    setShowPublishModal(false);

    // ✅ Notifier que la photo est publiée (pour l'étape 3 de la tâche)
    if (onPhotoPublished) {
      onPhotoPublished();
    }

    // Calculer les conséquences après 2 secondes
    setTimeout(() => {
      calculateConsequences(selectedPhoto);
    }, 2000);
  };

  // Calculer les conséquences selon la photo (basé sur le GDD)
  const calculateConsequences = (photo) => {
    let consequenceData = {};

    switch(photo.id) {
      case 'setup_gaming':
        // BON CHOIX
        consequenceData = {
          type: 'success',
          title: '✅ Excellent choix !',
          message: 'Ta photo de setup gaming est parfaite ! Pas d\'infos sensibles, juste du matériel cool.',
          likes: 15,
          comments: [
            { author: 'Thomas', text: 'Trop stylé ton setup ! 🔥' },
            { author: 'Emma', text: 'GG mec ! T\'as de la chance 😍' },
            { author: 'Lucas', text: 'On fait une partie ce soir ? 🎮' }
          ],
          stats: {
            reputation: 5,
            score: 50
          }
        };
        break;

      case 'gateau_anniversaire':
        // BON CHOIX
        consequenceData = {
          type: 'success',
          title: '✅ Super photo !',
          message: 'Belle photo d\'anniversaire ! Rien de sensible, juste un moment sympa à partager.',
          likes: 12,
          comments: [
            { author: 'Maman', text: 'Joyeux anniversaire mon chéri ! ❤️🎂' },
            { author: 'Sarah', text: 'Happy birthday ! 🎉' },
            { author: 'Tom', text: 'Bon anniv\' ! Le gâteau a l\'air bon 😋' }
          ],
          stats: {
            reputation: 3,
            score: 50
          }
        };
        break;

      case 'carte_bancaire':
        // DANGER CRITIQUE
        consequenceData = {
          type: 'critical',
          title: '🚨 ERREUR GRAVE !',
          message: 'Tu viens de publier ta carte bancaire avec le numéro ET le code CVV visibles ! Des hackers peuvent maintenant voler ton argent !',
          likes: 3,
          comments: [
            { author: 'Emma', text: 'Euh... Alex on voit le numéro de ta carte ! 😰' },
            { author: 'Thomas', text: 'Supprime ça VITE ! C\'est dangereux !' },
            { author: '❓ Inconnu', text: 'Merci pour les infos 😏' }
          ],
          fraudulentPurchase: true,
          stats: {
            money: -200,
            reputation: -20,
            parentsTrust: -30,
            score: -30
          }
        };
        break;

      case 'famille_maison':
        // RISQUE MOYEN
        consequenceData = {
          type: 'warning',
          title: '⚠️ Attention au risque !',
          message: 'Ta photo montre le numéro de ta rue (12 Rue des Lilas). Des inconnus savent maintenant où tu habites...',
          likes: 10,
          comments: [
            { author: 'Sophie', text: 'Belle famille ! 👨‍👩‍👧' },
            { author: 'Lucas', text: 'Sympa ta baraque !' },
            { author: '❓ Utilisateur Suspect', text: 'J\'habite dans le même quartier, je sais où tu habites maintenant 😊' }
          ],
          stats: {
            reputation: -5,
            accountSecurity: -10,
            score: -10
          }
        };
        break;

      case 'potes':
        // BON CHOIX mais droit à l'image
        consequenceData = {
          type: 'info',
          title: '💡 Bon choix, mais...',
          message: 'Photo sympa avec tes potes ! MAIS as-tu demandé leur autorisation avant de publier ? C\'est le droit à l\'image !',
          likes: 12,
          comments: [
            { author: 'Emma', text: 'Trop cool cette aprem ! 😎' },
            { author: 'Tom', text: 'On se refait ça bientôt !' },
            { author: 'Lucas', text: 'Alex... j\'avais dit que je voulais pas être sur Facebook 😕' }
          ],
          rightToImage: true,
          stats: {
            reputation: -10,
            score: 20
          }
        };
        break;

      default:
        consequenceData = {
          type: 'success',
          title: '✅ Photo publiée',
          message: 'Ta photo a été publiée.',
          likes: 5,
          comments: [],
          stats: { score: 10 }
        };
    }

    setConsequences(consequenceData);
    
    // Mettre à jour les likes et commentaires du post
    setPublishedPost(prev => ({
      ...prev,
      likes: consequenceData.likes,
      comments: consequenceData.comments
    }));

    // Afficher les conséquences après que les likes/commentaires apparaissent
    setTimeout(() => {
      setShowConsequences(true);
      
      // Appliquer les changements de stats
      if (consequenceData.stats) {
        const updates = {};
        if (consequenceData.stats.money) {
          updates.money = gameState.money + consequenceData.stats.money;
        }
        if (consequenceData.stats.reputation) {
          updates.reputation = Math.max(0, Math.min(100, gameState.reputation + consequenceData.stats.reputation));
        }
        if (consequenceData.stats.parentsTrust) {
          updates.parentsTrust = Math.max(0, Math.min(100, gameState.parentsTrust + consequenceData.stats.parentsTrust));
        }
        if (consequenceData.stats.accountSecurity) {
          updates.accountSecurity = Math.max(0, Math.min(100, gameState.accountSecurity + consequenceData.stats.accountSecurity));
        }
        
        onUpdateGameState(updates);
      }

      // Si achat frauduleux, afficher notification bancaire
      if (consequenceData.fraudulentPurchase) {
        // Ajouter la transaction frauduleuse dans l'historique bancaire
        if (onAddTransaction) {
          onAddTransaction({
            id: Date.now(),
            date: new Date().toLocaleDateString('fr-FR'),
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            description: '🚨 Achat frauduleux - www.site-douteux.com',
            amount: 200,
            type: 'debit'
          });
        }
        
        setTimeout(() => {
          alert('🏦 MA BANQUE - ALERTE !\n\nAchat suspect détecté :\n-200€ sur www.site-douteux.com\n\nVeuillez vérifier votre compte.');
        }, 3000);
      }
    }, 1500);
  };

  const closeConsequences = () => {
    setShowConsequences(false);
    
    // Démarrer la tâche suivante après avoir fermé les conséquences
    if (currentTask && onStartNextTask) {
      // Tâche 1 terminée → Tâche 2
      if (currentTask.id === 1 && hasPublished) {
        onStartNextTask();
      }
      // Tâche 2 terminée → Tâche 3
      else if (currentTask.id === 2 && friendRequestHandled) {
        onStartNextTask();
      }
      // Tâche 3 terminée → Tâche 4
      else if (currentTask.id === 3 && phishingHandled) {
        onStartNextTask();
      }
      // Tâche 4 terminée → Tâche 5
      else if (currentTask.id === 4 && hackedFriendHandled) {
        onStartNextTask();
      }
      // Tâche 5 terminée → (Écran de fin)
      else if (currentTask.id === 5 && fakeNewsHandled) {
        // Plus tard : écran de fin avec bilan complet
      }
    }
  };

  return (
    <div className="chrome-app">
      <style>{`
        .chrome-app {
          width: 100%;
          height: 100%;
          background: #f0f2f5;
          display: flex;
          flex-direction: column;
        }

        /* Barre de navigation Chrome */
        .chrome-nav {
          background: white;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid #dadce0;
        }

        .nav-buttons {
          display: flex;
          gap: 4px;
        }

        .nav-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          color: #5f6368;
          transition: all 0.15s ease;
        }

        .nav-btn:hover {
          background: #f1f3f4;
        }

        .nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .url-bar {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f1f3f4;
          padding: 8px 12px;
          border-radius: 24px;
          font-size: 14px;
        }

        .url-text {
          flex: 1;
          color: #202124;
          font-weight: 500;
        }

        /* Facebook - Header */
        .facebook-container {
          flex: 1;
          overflow: auto;
          background: #f0f2f5;
        }

        .facebook-header {
          background: white;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .fb-logo {
          font-size: 36px;
          font-weight: 700;
          color: #1877f2;
          font-family: 'Helvetica', sans-serif;
        }

        .fb-search {
          flex: 1;
          max-width: 400px;
          margin: 0 20px;
        }

        .fb-search-input {
          width: 100%;
          padding: 10px 16px;
          background: #f0f2f5;
          border: none;
          border-radius: 50px;
          font-size: 15px;
          outline: none;
        }

        .fb-nav-icons {
          display: flex;
          gap: 8px;
        }

        .fb-nav-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f2f5;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          color: #050505;
          transition: all 0.15s ease;
        }

        .fb-nav-icon:hover {
          background: #e4e6eb;
        }

        /* Facebook - Contenu */
        .facebook-content {
          max-width: 680px;
          margin: 20px auto;
          padding: 0 20px;
        }

        /* Boîte de création de post */
        .create-post-box {
          background: white;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        .create-post-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .create-post-input {
          flex: 1;
          padding: 12px 16px;
          background: #f0f2f5;
          border: none;
          border-radius: 24px;
          font-size: 16px;
          cursor: pointer;
          color: #65676b;
        }

        .create-post-input:hover {
          background: #e4e6eb;
        }

        .create-post-actions {
          display: flex;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid #e4e6eb;
        }

        .post-action {
          flex: 1;
          padding: 10px;
          background: transparent;
          border: none;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          color: #65676b;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .post-action:hover {
          background: #f0f2f5;
        }

        .post-action.photo {
          color: #45bd62;
        }

        /* Post dans le fil */
        .fb-post {
          background: white;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
          animation: postAppear 0.4s ease;
        }

        @keyframes postAppear {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .post-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .post-author-info {
          flex: 1;
        }

        .post-author-name {
          font-size: 15px;
          font-weight: 600;
          color: #050505;
        }

        .post-time {
          font-size: 13px;
          color: #65676b;
        }

        .post-content {
          font-size: 15px;
          color: #050505;
          margin-bottom: 12px;
          line-height: 1.5;
        }

        .post-photo-container {
          margin: 12px -16px;
          background: #f0f2f5;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 80px;
        }

        .post-stats {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e4e6eb;
          margin-bottom: 8px;
          font-size: 15px;
          color: #65676b;
        }

        .post-actions {
          display: flex;
          justify-content: space-around;
        }

        .post-action-btn {
          flex: 1;
          padding: 8px;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 15px;
          font-weight: 600;
          color: #65676b;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.15s ease;
        }

        .post-action-btn:hover {
          background: #f0f2f5;
        }

        .post-comments {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e4e6eb;
        }

        .post-comment {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
          animation: commentAppear 0.3s ease;
        }

        @keyframes commentAppear {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .comment-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .comment-content {
          background: #f0f2f5;
          padding: 8px 12px;
          border-radius: 18px;
          flex: 1;
        }

        .comment-author {
          font-size: 13px;
          font-weight: 600;
          color: #050505;
          margin-bottom: 2px;
        }

        .comment-text {
          font-size: 15px;
          color: #050505;
        }

        /* Modal de publication */
        .publish-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255,255,255,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.2s ease;
        }

        .publish-modal-content {
          background: white;
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          width: 500px;
          max-width: 90%;
        }

        .publish-modal-header {
          padding: 16px 20px;
          border-bottom: 1px solid #e4e6eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .publish-modal-title {
          font-size: 20px;
          font-weight: 700;
          color: #050505;
        }

        .publish-modal-close {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f2f5;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          color: #050505;
        }

        .publish-modal-body {
          padding: 20px;
        }

        .publish-user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .publish-username {
          font-size: 15px;
          font-weight: 600;
          color: #050505;
        }

        .publish-textarea {
          width: 100%;
          min-height: 120px;
          padding: 12px;
          border: none;
          font-size: 24px;
          resize: none;
          outline: none;
          font-family: inherit;
          margin-bottom: 16px;
        }

        .publish-photo-preview {
          background: #f0f2f5;
          border-radius: 8px;
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          margin-bottom: 16px;
        }

        .publish-photo-name {
          font-size: 13px;
          color: #65676b;
          text-align: center;
          margin-bottom: 16px;
        }

        .publish-button {
          width: 100%;
          padding: 12px;
          background: #1877f2;
          border: none;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .publish-button:hover {
          background: #166fe5;
        }

        .publish-button:disabled {
          background: #e4e6eb;
          color: #bcc0c4;
          cursor: not-allowed;
        }

        /* Modal de conséquences */
        .consequences-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20000;
          animation: fadeIn 0.3s ease;
        }

        .consequences-content {
          background: white;
          border-radius: 16px;
          width: 600px;
          max-width: 90%;
          max-height: 80vh;
          overflow: auto;
          animation: slideUp 0.4s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .consequences-header {
          padding: 24px;
          text-align: center;
          border-bottom: 2px solid #f0f2f5;
        }

        .consequences-header.success {
          background: linear-gradient(135deg, #d4edda, #c3e6cb);
        }

        .consequences-header.warning {
          background: linear-gradient(135deg, #fff3cd, #ffeaa7);
        }

        .consequences-header.critical {
          background: linear-gradient(135deg, #f8d7da, #f5c6cb);
        }

        .consequences-header.info {
          background: linear-gradient(135deg, #d1ecf1, #bee5eb);
        }

        .consequences-title {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .consequences-message {
          font-size: 16px;
          line-height: 1.6;
        }

        .consequences-body {
          padding: 24px;
        }

        .consequences-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .consequence-stat {
          padding: 16px;
          background: #f8f9fa;
          border-radius: 12px;
          text-align: center;
        }

        .consequence-stat.positive {
          background: #d4edda;
          border: 2px solid #28a745;
        }

        .consequence-stat.negative {
          background: #f8d7da;
          border: 2px solid #dc3545;
        }

        .consequence-stat-label {
          font-size: 13px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .consequence-stat-value {
          font-size: 32px;
          font-weight: 800;
        }

        .consequences-explanation {
          padding: 20px;
          background: #f8f9fa;
          border-left: 4px solid #1877f2;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .consequences-explanation-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .consequences-explanation-text {
          font-size: 15px;
          line-height: 1.7;
          color: #333;
        }

        .consequences-close-btn {
          width: 100%;
          padding: 14px;
          background: #1877f2;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 700;
          color: white;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .consequences-close-btn:hover {
          background: #166fe5;
        }

        /* Interface demandes d'amis */
        .friend-requests-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 15000;
          animation: fadeIn 0.2s ease;
        }

        .friend-requests-container {
          background: white;
          border-radius: 12px;
          width: 900px;
          max-width: 95%;
          max-height: 85vh;
          overflow: hidden;
          display: flex;
          animation: slideUp 0.3s ease;
        }

        .friend-requests-list {
          width: 350px;
          background: #f0f2f5;
          border-right: 1px solid #e4e6eb;
          overflow-y: auto;
        }

        .friend-requests-header {
          padding: 20px;
          background: white;
          border-bottom: 1px solid #e4e6eb;
        }

        .friend-requests-title {
          font-size: 24px;
          font-weight: 700;
          color: #050505;
          margin-bottom: 8px;
        }

        .friend-requests-count {
          font-size: 15px;
          color: #65676b;
        }

        .friend-request-item {
          padding: 16px;
          background: white;
          margin: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
          border: 2px solid transparent;
        }

        .friend-request-item:hover {
          background: #f8f9fa;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .friend-request-item.selected {
          border-color: #1877f2;
          background: #e7f3ff;
        }

        .friend-request-header-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .friend-request-pic {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          flex-shrink: 0;
        }

        .friend-request-info-mini {
          flex: 1;
        }

        .friend-request-name-mini {
          font-size: 16px;
          font-weight: 600;
          color: #050505;
          margin-bottom: 4px;
        }

        .friend-request-mutual {
          font-size: 13px;
          color: #65676b;
        }

        .friend-request-details {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          background: white;
        }

        .friend-request-details-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #65676b;
          font-size: 16px;
          text-align: center;
        }

        .profile-header {
          text-align: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e4e6eb;
        }

        .profile-pic-large {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          margin: 0 auto 16px;
        }

        .profile-name {
          font-size: 28px;
          font-weight: 700;
          color: #050505;
          margin-bottom: 8px;
        }

        .profile-age {
          font-size: 16px;
          color: #e74c3c;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .profile-bio {
          font-size: 15px;
          color: #65676b;
          line-height: 1.5;
        }

        .profile-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .profile-stat {
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
          text-align: center;
        }

        .profile-stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #050505;
          margin-bottom: 4px;
        }

        .profile-stat-label {
          font-size: 13px;
          color: #65676b;
        }

        .profile-details-section {
          margin-bottom: 24px;
        }

        .profile-details-title {
          font-size: 18px;
          font-weight: 700;
          color: #050505;
          margin-bottom: 12px;
        }

        .profile-detail-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .profile-detail-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .profile-detail-icon.warning {
          background: #fff3cd;
        }

        .profile-detail-icon.danger {
          background: #f8d7da;
        }

        .profile-detail-icon.safe {
          background: #d4edda;
        }

        .profile-detail-text {
          flex: 1;
          font-size: 14px;
          color: #050505;
        }

        .profile-actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
        }

        .profile-action-btn {
          flex: 1;
          padding: 14px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .profile-action-btn.accept {
          background: #1877f2;
          color: white;
        }

        .profile-action-btn.accept:hover {
          background: #166fe5;
        }

        .profile-action-btn.decline {
          background: #e4e6eb;
          color: #050505;
        }

        .profile-action-btn.decline:hover {
          background: #d8dadf;
        }

        .friend-requests-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f2f5;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          z-index: 10;
        }

        .friend-requests-close:hover {
          background: #e4e6eb;
        }

        /* Message de phishing */
        .phishing-message-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 15000;
          animation: fadeIn 0.2s ease;
        }

        .phishing-message-container {
          background: white;
          border-radius: 12px;
          width: 700px;
          max-width: 90%;
          max-height: 85vh;
          overflow: auto;
          animation: slideUp 0.3s ease;
        }

        .phishing-header {
          padding: 24px;
          background: #f0f2f5;
          border-bottom: 1px solid #e4e6eb;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .phishing-sender-pic {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #1877f2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }

        .phishing-sender-info {
          flex: 1;
        }

        .phishing-sender-name {
          font-size: 18px;
          font-weight: 700;
          color: #050505;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .phishing-sender-label {
          font-size: 13px;
          color: #65676b;
          margin-top: 4px;
        }

        .phishing-content {
          padding: 32px;
        }

        .phishing-subject {
          font-size: 24px;
          font-weight: 700;
          color: #e74c3c;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .phishing-text {
          font-size: 16px;
          line-height: 1.7;
          color: #050505;
          margin-bottom: 24px;
        }

        .phishing-urgent {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 16px;
          margin-bottom: 24px;
          border-radius: 4px;
        }

        .phishing-urgent-text {
          font-size: 15px;
          font-weight: 600;
          color: #856404;
        }

        .phishing-link-box {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 24px;
          border: 2px solid #e4e6eb;
        }

        .phishing-link-label {
          font-size: 13px;
          font-weight: 600;
          color: #65676b;
          margin-bottom: 8px;
        }

        .phishing-link {
          font-size: 15px;
          color: #1877f2;
          word-break: break-all;
          font-family: monospace;
          background: white;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #e4e6eb;
        }

        .phishing-suspicious-url {
          color: #e74c3c;
          font-weight: 700;
        }

        .phishing-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 24px;
        }

        .phishing-action-btn {
          padding: 14px;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .phishing-action-btn.danger {
          background: #e74c3c;
          color: white;
        }

        .phishing-action-btn.danger:hover {
          background: #c0392b;
        }

        .phishing-action-btn.neutral {
          background: #95a5a6;
          color: white;
        }

        .phishing-action-btn.neutral:hover {
          background: #7f8c8d;
        }

        .phishing-action-btn.safe {
          background: #3498db;
          color: white;
        }

        .phishing-action-btn.safe:hover {
          background: #2980b9;
        }

        .phishing-action-btn.perfect {
          background: #27ae60;
          color: white;
        }

        .phishing-action-btn.perfect:hover {
          background: #229954;
        }

        .phishing-form {
          background: #f8f9fa;
          padding: 24px;
          border-radius: 8px;
          margin-top: 24px;
          border: 2px solid #e74c3c;
        }

        .phishing-form-title {
          font-size: 18px;
          font-weight: 700;
          color: #050505;
          margin-bottom: 16px;
        }

        .phishing-form-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #e4e6eb;
          border-radius: 6px;
          font-size: 15px;
          margin-bottom: 12px;
        }

        .phishing-form-submit {
          width: 100%;
          padding: 14px;
          background: #1877f2;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 8px;
        }

        .phishing-form-submit:hover {
          background: #166fe5;
        }

        .phishing-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f2f5;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          z-index: 10;
        }

        .phishing-close:hover {
          background: #e4e6eb;
        }

        .warning-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: #fff3cd;
          color: #856404;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        /* Conversation ami piraté */
        .hacked-friend-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 15000;
          animation: fadeIn 0.2s ease;
        }

        .hacked-friend-container {
          background: white;
          border-radius: 12px;
          width: 600px;
          max-width: 90%;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease;
        }

        .conversation-header {
          padding: 16px 20px;
          background: #1877f2;
          color: white;
          border-radius: 12px 12px 0 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .conversation-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .conversation-user-info {
          flex: 1;
        }

        .conversation-user-name {
          font-size: 16px;
          font-weight: 700;
        }

        .conversation-status {
          font-size: 12px;
          opacity: 0.9;
        }

        .conversation-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: #f0f2f5;
        }

        .message-bubble {
          max-width: 70%;
          margin-bottom: 12px;
          animation: messagePop 0.3s ease;
        }

        @keyframes messagePop {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .message-bubble.friend {
          margin-right: auto;
        }

        .message-bubble.user {
          margin-left: auto;
        }

        .message-content {
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 15px;
          line-height: 1.5;
        }

        .message-bubble.friend .message-content {
          background: white;
          border-bottom-left-radius: 4px;
        }

        .message-bubble.user .message-content {
          background: #1877f2;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message-time {
          font-size: 11px;
          color: #65676b;
          margin-top: 4px;
          padding: 0 8px;
        }

        .suspicious-indicator {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          background: #fff3cd;
          color: #856404;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          margin-left: 8px;
        }

        .conversation-actions {
          padding: 16px;
          background: white;
          border-top: 1px solid #e4e6eb;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .conversation-action-btn {
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .conversation-action-btn.danger {
          background: #e74c3c;
          color: white;
        }

        .conversation-action-btn.danger:hover {
          background: #c0392b;
        }

        .conversation-action-btn.warning {
          background: #f39c12;
          color: white;
        }

        .conversation-action-btn.warning:hover {
          background: #e67e22;
        }

        .conversation-action-btn.safe {
          background: #3498db;
          color: white;
        }

        .conversation-action-btn.safe:hover {
          background: #2980b9;
        }

        .conversation-action-btn.perfect {
          background: #27ae60;
          color: white;
        }

        .conversation-action-btn.perfect:hover {
          background: #229954;
        }

        .conversation-action-btn.neutral {
          background: #95a5a6;
          color: white;
        }

        .conversation-action-btn.neutral:hover {
          background: #7f8c8d;
        }

        .hacked-friend-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          color: white;
          z-index: 10;
        }

        .hacked-friend-close:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>

      {/* Barre Chrome */}
      <div className="chrome-nav">
        <div className="nav-buttons">
          <button className="nav-btn" disabled>
            <ArrowLeft size={18} />
          </button>
          <button className="nav-btn" disabled>
            <ArrowRight size={18} />
          </button>
          <button className="nav-btn">
            <RefreshCw size={18} />
          </button>
        </div>
        <div className="url-bar">
          <Lock size={16} color="#5f6368" />
          <div className="url-text">{currentUrl}</div>
        </div>
      </div>

      {/* Facebook */}
      <div className="facebook-container">
        {/* Header Facebook */}
        <div className="facebook-header">
          <div className="fb-logo">facebook</div>
          <div className="fb-search">
            <input 
              type="text" 
              className="fb-search-input" 
              placeholder="Rechercher sur Facebook"
            />
          </div>
          <div className="fb-nav-icons">
            <button className="fb-nav-icon">
              <Home size={20} />
            </button>
            <button 
              className="fb-nav-icon" 
              onClick={openFriendRequests}
              style={{ position: 'relative' }}
            >
              <Users size={20} />
              {currentTask && currentTask.id === 2 && !friendRequestHandled && (
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '12px',
                  height: '12px',
                  background: '#e74c3c',
                  borderRadius: '50%',
                  border: '2px solid white'
                }} />
              )}
            </button>
            <button 
              className="fb-nav-icon"
              onClick={openPhishingMessage}
              style={{ position: 'relative' }}
            >
              <MessageCircle size={20} />
              {currentTask && currentTask.id === 3 && !phishingHandled && (
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '12px',
                  height: '12px',
                  background: '#e74c3c',
                  borderRadius: '50%',
                  border: '2px solid white'
                }} />
              )}
            </button>
            <button 
              className="fb-nav-icon"
              onClick={openHackedFriendMessage}
              style={{ position: 'relative' }}
              title="Conversations"
            >
              💬
              {currentTask && currentTask.id === 4 && !hackedFriendHandled && (
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '12px',
                  height: '12px',
                  background: '#e74c3c',
                  borderRadius: '50%',
                  border: '2px solid white'
                }} />
              )}
            </button>
          </div>
        </div>

        {/* Contenu Facebook */}
        <div className="facebook-content">
          {/* Boîte de création de post */}
          {!hasPublished && (
            <div className="create-post-box">
              <div className="create-post-header">
                <div className="user-avatar">😊</div>
                <div 
                  className="create-post-input"
                  onClick={handlePublish}
                >
                  Quoi de neuf, Alex ?
                </div>
              </div>
              <div className="create-post-actions">
                <button className="post-action photo" onClick={handlePublish}>
                  📸 Photo
                </button>
              </div>
            </div>
          )}

          {/* Post publié */}
          {publishedPost && (
            <div className="fb-post">
              <div className="post-header">
                <div className="user-avatar">{publishedPost.authorPic}</div>
                <div className="post-author-info">
                  <div className="post-author-name">{publishedPost.author}</div>
                  <div className="post-time">{publishedPost.time}</div>
                </div>
                <button className="nav-btn">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="post-content">{publishedPost.content}</div>

              <div className="post-photo-container">
                {publishedPost.photo.thumbnail}
              </div>

              <div className="post-stats">
                <span>👍 {publishedPost.likes} J'aime</span>
                <span>{publishedPost.comments.length} Commentaires</span>
              </div>

              <div className="post-actions">
                <button className="post-action-btn">
                  <ThumbsUp size={18} />
                  J'aime
                </button>
                <button className="post-action-btn">
                  <MessageCircle size={18} />
                  Commenter
                </button>
                <button className="post-action-btn">
                  <Share2 size={18} />
                  Partager
                </button>
              </div>

              {publishedPost.comments.length > 0 && (
                <div className="post-comments">
                  {publishedPost.comments.map((comment, index) => (
                    <div key={index} className="post-comment">
                      <div className="comment-avatar">
                        {comment.author === 'Maman' ? '👩' : 
                         comment.author.includes('Inconnu') || comment.author.includes('Suspect') ? '❓' : '👤'}
                      </div>
                      <div className="comment-content">
                        <div className="comment-author">{comment.author}</div>
                        <div className="comment-text">{comment.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Posts de la tâche 5 : Fake News (3 fakes + 1 vrai) - AVANT le post du joueur */}
          {currentTask && currentTask.id === 5 && !fakeNewsHandled && fakeNewsPosts.map(post => {
            if (hiddenPosts.includes(post.id)) return null;
            
            const isReported = reportedPosts.includes(post.id);
            
            return (
              <div 
                key={post.id} 
                className="fb-post"
                style={isReported ? { opacity: 0.5, pointerEvents: 'none' } : {}}
              >
                <div className="post-header">
                  <div className="user-avatar">{post.authorPic}</div>
                  <div className="post-author-info">
                    <div className="post-author-name">
                      {post.author}
                      {post.verified && (
                        <span style={{
                          color: '#1877f2',
                          marginLeft: '4px',
                          fontSize: '14px'
                        }}>✓</span>
                      )}
                    </div>
                    <div className="post-time">{post.time}</div>
                  </div>
                  <button 
                    className="nav-btn"
                    onClick={() => openPostMenu(post.id)}
                    style={{ position: 'relative' }}
                  >
                    <MoreHorizontal size={20} />
                  </button>

                  {/* Menu contextuel */}
                  {showPostMenu === post.id && (
                    <div style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50px',
                      background: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      zIndex: 1000,
                      minWidth: '200px',
                      overflow: 'hidden'
                    }}>
                      <button
                        onClick={() => {
                          openFactCheck(post);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: 'none',
                          background: 'white',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f0f2f5'}
                        onMouseLeave={(e) => e.target.style.background = 'white'}
                      >
                        🔍 Analyser le post
                      </button>
                      <button
                        onClick={() => hidePost(post.id)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: 'none',
                          background: 'white',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          borderTop: '1px solid #e4e6eb'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f0f2f5'}
                        onMouseLeave={(e) => e.target.style.background = 'white'}
                      >
                        👁️‍🗨️ Masquer
                      </button>
                      <button
                        onClick={() => reportPost(post)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: 'none',
                          background: 'white',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          borderTop: '1px solid #e4e6eb',
                          color: '#e74c3c',
                          fontWeight: '600'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f0f2f5'}
                        onMouseLeave={(e) => e.target.style.background = 'white'}
                      >
                        🚩 Signaler la publication
                      </button>
                    </div>
                  )}
                </div>

                <div className="post-content">{post.content}</div>

                <div className="post-stats">
                  <span>👍 {post.likes} J'aime</span>
                  <span>{post.comments} Commentaires • {post.shares} Partages</span>
                </div>

                <div className="post-actions">
                  <button className="post-action-btn">
                    <ThumbsUp size={18} />
                    J'aime
                  </button>
                  <button className="post-action-btn">
                    <MessageCircle size={18} />
                    Commenter
                  </button>
                  <button className="post-action-btn">
                    <Share2 size={18} />
                    Partager
                  </button>
                </div>

                {isReported && (
                  <div style={{
                    padding: '12px',
                    background: '#e7f3ff',
                    borderTop: '1px solid #1877f2',
                    fontSize: '13px',
                    color: '#1877f2',
                    fontWeight: '600'
                  }}>
                    ✓ Publication signalée
                  </div>
                )}
              </div>
            );
          })}

          {/* Post publié par le joueur (Tâche 1) */}
          {feedPosts.map(post => (
            <div key={post.id} className="fb-post">
              <div className="post-header">
                <div className="user-avatar">{post.authorPic}</div>
                <div className="post-author-info">
                  <div className="post-author-name">{post.author}</div>
                  <div className="post-time">{post.time}</div>
                </div>
                <button className="nav-btn">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="post-content">{post.content}</div>

              <div className="post-stats">
                <span>👍 {post.likes} J'aime</span>
                <span>{post.comments} Commentaires</span>
              </div>

              <div className="post-actions">
                <button className="post-action-btn">
                  <ThumbsUp size={18} />
                  J'aime
                </button>
                <button className="post-action-btn">
                  <MessageCircle size={18} />
                  Commenter
                </button>
                <button className="post-action-btn">
                  <Share2 size={18} />
                  Partager
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de publication */}
      {showPublishModal && (
        <div className="publish-modal">
          <div className="publish-modal-content">
            <div className="publish-modal-header">
              <div className="publish-modal-title">Créer une publication</div>
              <button 
                className="publish-modal-close"
                onClick={() => setShowPublishModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="publish-modal-body">
              <div className="publish-user-info">
                <div className="user-avatar">😊</div>
                <div className="publish-username">Alex Martin</div>
              </div>
              <textarea
                className="publish-textarea"
                placeholder="Quoi de neuf, Alex ?"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
              />
              {selectedPhoto && (
                <>
                  <div className="publish-photo-preview">
                    {selectedPhoto.thumbnail}
                  </div>
                  <div className="publish-photo-name">
                    📎 {selectedPhoto.name}
                  </div>
                </>
              )}
              <button 
                className="publish-button"
                onClick={confirmPublish}
                disabled={!selectedPhoto}
              >
                Publier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal demandes d'amis */}
      {showFriendRequests && (
        <div className="friend-requests-modal">
          <div className="friend-requests-container">
            {/* Liste des demandes */}
            <div className="friend-requests-list">
              <div className="friend-requests-header">
                <div className="friend-requests-title">Demandes d'amis</div>
                <div className="friend-requests-count">{friendRequests.length} demandes</div>
              </div>
              
              {friendRequests.map(request => (
                <div
                  key={request.id}
                  className={`friend-request-item ${selectedProfile?.id === request.id ? 'selected' : ''}`}
                  onClick={() => selectProfile(request)}
                >
                  <div className="friend-request-header-item">
                    <div className="friend-request-pic">{request.profilePic}</div>
                    <div className="friend-request-info-mini">
                      <div className="friend-request-name-mini">{request.name}</div>
                      <div className="friend-request-mutual">
                        {request.mutualFriends > 0 
                          ? `${request.mutualFriends} ami(s) en commun`
                          : 'Aucun ami en commun'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Détails du profil sélectionné */}
            <div className="friend-request-details">
              {!selectedProfile ? (
                <div className="friend-request-details-empty">
                  👈 Sélectionne une demande d'ami<br />pour voir les détails du profil
                </div>
              ) : (
                <>
                  <div className="profile-header">
                    <div className="profile-pic-large">{selectedProfile.profilePic}</div>
                    <div className="profile-name">{selectedProfile.name}</div>
                    {selectedProfile.age && (
                      <div className="profile-age">⚠️ {selectedProfile.age}</div>
                    )}
                    <div className="profile-bio">{selectedProfile.bio}</div>
                  </div>

                  <div className="profile-stats">
                    <div className="profile-stat">
                      <div className="profile-stat-value">{selectedProfile.mutualFriends}</div>
                      <div className="profile-stat-label">Amis communs</div>
                    </div>
                    <div className="profile-stat">
                      <div className="profile-stat-value">{selectedProfile.posts}</div>
                      <div className="profile-stat-label">Publications</div>
                    </div>
                    <div className="profile-stat">
                      <div className="profile-stat-value">{selectedProfile.photos}</div>
                      <div className="profile-stat-label">Photos</div>
                    </div>
                  </div>

                  <div className="profile-details-section">
                    <div className="profile-details-title">📋 Informations</div>
                    
                    <div className="profile-detail-row">
                      <div className={`profile-detail-icon ${
                        selectedProfile.accountAge.includes('hier') || selectedProfile.accountAge.includes('jours') 
                          ? 'danger' 
                          : selectedProfile.accountAge.includes('mois') 
                          ? 'warning' 
                          : 'safe'
                      }`}>
                        📅
                      </div>
                      <div className="profile-detail-text">
                        <strong>Compte créé :</strong> {selectedProfile.accountAge}
                      </div>
                    </div>

                    <div className="profile-detail-row">
                      <div className={`profile-detail-icon ${
                        selectedProfile.mutualFriends > 0 ? 'safe' : 'danger'
                      }`}>
                        👥
                      </div>
                      <div className="profile-detail-text">
                        <strong>Amis en commun :</strong> {selectedProfile.mutualFriends > 0 
                          ? `${selectedProfile.mutualFriends} personne(s) que tu connais`
                          : 'Aucune connexion avec tes amis'}
                      </div>
                    </div>

                    <div className="profile-detail-row">
                      <div className="profile-detail-icon warning">
                        🔔
                      </div>
                      <div className="profile-detail-text">
                        <strong>Activité récente :</strong> {selectedProfile.recentActivity}
                      </div>
                    </div>
                  </div>

                  <div className="profile-actions">
                    <button 
                      className="profile-action-btn accept"
                      onClick={() => acceptFriendRequest(selectedProfile)}
                    >
                      ✓ Accepter
                    </button>
                    <button 
                      className="profile-action-btn decline"
                      onClick={declineFriendRequest}
                    >
                      ✗ Refuser
                    </button>
                  </div>
                </>
              )}
            </div>

            <button 
              className="friend-requests-close"
              onClick={() => setShowFriendRequests(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Modal fact-check détaillée (Tâche 5) */}
      {showFakeNews && selectedPost && (
        <div className="hacked-friend-modal">
          <div className="hacked-friend-container" style={{ maxWidth: '700px' }}>
            <div className="conversation-header" style={{ 
              background: selectedPost.type === 'fake' ? '#e74c3c' : '#27ae60'
            }}>
              <div className="conversation-avatar">
                {selectedPost.type === 'fake' ? '🚨' : '✓'}
              </div>
              <div className="conversation-user-info">
                <div className="conversation-user-name">
                  {selectedPost.type === 'fake' ? 'FAKE NEWS Détectée' : 'Post Authentique'}
                </div>
                <div className="conversation-status">Analyse complète</div>
              </div>
            </div>

            <div style={{ padding: '24px', maxHeight: '60vh', overflow: 'auto' }}>
              {/* Le post analysé */}
              <div style={{
                background: '#f8f9fa',
                border: `2px solid ${selectedPost.type === 'fake' ? '#e74c3c' : '#27ae60'}`,
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
                  {selectedPost.authorPic} {selectedPost.author}
                  {selectedPost.verified && <span style={{ color: '#1877f2' }}> ✓</span>}
                </div>
                <div style={{ fontSize: '14px', marginBottom: '8px', lineHeight: '1.6' }}>
                  {selectedPost.content}
                </div>
                <div style={{ fontSize: '12px', color: '#65676b' }}>
                  {selectedPost.time}
                </div>
              </div>

              {/* Analyse */}
              {selectedPost.type === 'fake' ? (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    marginBottom: '16px',
                    color: '#e74c3c'
                  }}>
                    🚨 C'est une FAKE NEWS !
                  </div>
                  
                  <div style={{
                    background: '#ffe6e6',
                    border: '2px solid #e74c3c',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
                      ❌ Information FAUSSE
                    </div>
                    <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                      Ce post contient de fausses informations. Aucun média sérieux ne confirme cette information.
                    </div>
                  </div>

                  <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
                    🔴 Signaux d'alerte détectés :
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedPost.fakeReasons.map((reason, index) => (
                      <div key={index} style={{
                        background: '#fff3cd',
                        padding: '12px',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}>
                        ⚠️ <strong>{reason}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    marginBottom: '16px',
                    color: '#27ae60'
                  }}>
                    ✓ Post Authentique
                  </div>
                  
                  <div style={{
                    background: '#d4edda',
                    border: '2px solid #27ae60',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
                      ✓ Information VÉRIFIÉE
                    </div>
                    <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                      Ce post provient du Parisien, un média reconnu avec un badge vérifié ✓. L'information est confirmée par plusieurs sources fiables.
                    </div>
                  </div>

                  <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
                    🟢 Signaux de fiabilité :
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{
                      background: '#d4edda',
                      padding: '12px',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}>
                      ✓ <strong>Source vérifiée :</strong> Média reconnu avec badge officiel
                    </div>
                    <div style={{
                      background: '#d4edda',
                      padding: '12px',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}>
                      ✓ <strong>Information factuelle :</strong> Résultat sportif vérifiable
                    </div>
                    <div style={{
                      background: '#d4edda',
                      padding: '12px',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}>
                      ✓ <strong>Pas de sensationnalisme :</strong> Ton neutre et factuel
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{
              padding: '16px',
              background: 'white',
              borderTop: '1px solid #e4e6eb',
              display: 'flex',
              gap: '8px'
            }}>
              <button 
                className="conversation-action-btn neutral"
                onClick={() => {
                  setShowFakeNews(false);
                  setSelectedPost(null);
                }}
                style={{ flex: 1 }}
              >
                Fermer
              </button>
              {selectedPost.type === 'fake' && !reportedPosts.includes(selectedPost.id) && (
                <button 
                  className="conversation-action-btn perfect"
                  onClick={() => {
                    setShowFakeNews(false);
                    reportPost(selectedPost);
                    setSelectedPost(null);
                  }}
                  style={{ flex: 1 }}
                >
                  🚩 Signaler
                </button>
              )}
            </div>

            <button 
              className="hacked-friend-close"
              onClick={() => {
                setShowFakeNews(false);
                setSelectedPost(null);
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Modal conversation ami piraté */}
      {showHackedFriendMessage && (
        <div className="hacked-friend-modal">
          <div className="hacked-friend-container">
            <div className="conversation-header">
              <div className="conversation-avatar">👦</div>
              <div className="conversation-user-info">
                <div className="conversation-user-name">Julien Moreau</div>
                <div className="conversation-status">Active maintenant</div>
              </div>
            </div>

            <div className="conversation-messages">
              {/* Message 1 : Julien demande quelque chose d'innocent */}
              <div className="message-bubble friend">
                <div className="message-content">
                  Salut ! Je te dérange pas ?
                </div>
                <div className="message-time">À l'instant</div>
              </div>

              <div className="message-bubble friend">
                <div className="message-content">
                  J'ai un truc important à te demander pour le projet de SVT
                </div>
                <div className="message-time">À l'instant</div>
              </div>

              {conversationStep >= 2 && (
                <>
                  <div className="message-bubble user">
                    <div className="message-content">
                      Oui vas-y, qu'est-ce qu'il y a ?
                    </div>
                    <div className="message-time">À l'instant</div>
                  </div>

                  <div className="message-bubble friend">
                    <div className="message-content">
                      En fait j'ai un probleme urgent... Mon frere est a lhopital j'ai besoin d'argent pour taxi URGENT
                      {conversationStep >= 3 && (
                        <span className="suspicious-indicator">⚠️ Urgence soudaine</span>
                      )}
                    </div>
                    <div className="message-time">À l'instant</div>
                  </div>

                  <div className="message-bubble friend">
                    <div className="message-content">
                      Tu peux me faire virement 50€ ?? Je te rembourse demain promis 🙏
                      {conversationStep >= 3 && (
                        <span className="suspicious-indicator">⚠️ Demande d'argent</span>
                      )}
                    </div>
                    <div className="message-time">À l'instant</div>
                  </div>
                </>
              )}

              {conversationStep >= 3 && (
                <div className="message-bubble friend">
                  <div className="message-content">
                    Ou sinon tu peux me donner ton code de verification Facebook ? J'ai perdu mon tel et je dois absolument me connecter
                    <span className="suspicious-indicator">🚨 Demande de code</span>
                  </div>
                  <div className="message-time">À l'instant</div>
                </div>
              )}
            </div>

            <div className="conversation-actions">
              {conversationStep === 1 && (
                <>
                  <button 
                    className="conversation-action-btn neutral"
                    onClick={continueConversation}
                    style={{ gridColumn: '1 / -1' }}
                  >
                    💬 Répondre
                  </button>
                </>
              )}

              {conversationStep === 2 && (
                <>
                  <button 
                    className="conversation-action-btn neutral"
                    onClick={continueConversation}
                  >
                    💬 Continuer
                  </button>
                  <button 
                    className="conversation-action-btn safe"
                    onClick={verifyWithRealEmma}
                  >
                    📞 Vérifier d'abord
                  </button>
                  <button 
                    className="conversation-action-btn perfect"
                    onClick={warnEmmaAndReport}
                    style={{ gridColumn: '1 / -1' }}
                  >
                    🚩 Signaler comme suspect
                  </button>
                </>
              )}

              {conversationStep >= 3 && (
                <>
                  <button 
                    className="conversation-action-btn danger"
                    onClick={sendMoneyToHacker}
                  >
                    💸 Envoyer 50€
                  </button>
                  <button 
                    className="conversation-action-btn warning"
                    onClick={giveVerificationCode}
                  >
                    🔢 Donner le code
                  </button>
                  <button 
                    className="conversation-action-btn safe"
                    onClick={verifyWithRealEmma}
                  >
                    📞 Appeler Julien
                  </button>
                  <button 
                    className="conversation-action-btn perfect"
                    onClick={warnEmmaAndReport}
                  >
                    🚩 Prévenir + Signaler
                  </button>
                </>
              )}
            </div>

            <button 
              className="hacked-friend-close"
              onClick={() => setShowHackedFriendMessage(false)}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {showPhishingMessage && (
        <div className="phishing-message-modal">
          <div className="phishing-message-container">
            <div className="phishing-header">
              <div className="phishing-sender-pic">🔒</div>
              <div className="phishing-sender-info">
                <div className="phishing-sender-name">
                  Facebook Security Team
                  <span className="warning-badge">⚠️ Non vérifié</span>
                </div>
                <div className="phishing-sender-label">security-team@facebook-verify.com</div>
              </div>
            </div>

            <div className="phishing-content">
              <div className="phishing-subject">
                🚨 Action Urgente Requise : Votre compte sera supprimé
              </div>

              <div className="phishing-text">
                <p><strong>Cher utilisateur,</strong></p>
                <br />
                <p>Nous avons détecté une activité suspecte sur votre compte Facebook. Pour des raisons de sécurité, votre compte sera <strong>définitivement supprimé dans les 24 heures</strong> si vous ne confirmez pas votre identité immédiatement.</p>
                <br />
                <p>Veuillez cliquer sur le lien ci-dessous et entrer vos informations pour vérifier votre compte :</p>
              </div>

              <div className="phishing-urgent">
                <div className="phishing-urgent-text">
                  ⏰ URGENT : Il vous reste moins de 24h pour agir !
                </div>
              </div>

              <div className="phishing-link-box">
                <div className="phishing-link-label">🔗 Lien de vérification :</div>
                <div className="phishing-link">
                  https://<span className="phishing-suspicious-url">facebook-security-verification.com</span>/verify
                </div>
              </div>

              {!showPhishingForm ? (
                <div className="phishing-actions">
                  <button 
                    className="phishing-action-btn danger"
                    onClick={clickPhishingLink}
                  >
                    🔗 Cliquer sur le lien
                  </button>
                  <button 
                    className="phishing-action-btn neutral"
                    onClick={ignorePhishing}
                  >
                    🚫 Ignorer
                  </button>
                  <button 
                    className="phishing-action-btn safe"
                    onClick={verifyPhishing}
                  >
                    🔍 Vérifier d'abord
                  </button>
                  <button 
                    className="phishing-action-btn perfect"
                    onClick={reportPhishing}
                  >
                    🚩 Signaler comme phishing
                  </button>
                </div>
              ) : (
                <div className="phishing-form">
                  <div className="phishing-form-title">
                    Vérification de sécurité Facebook
                  </div>
                  <input 
                    type="email" 
                    className="phishing-form-input" 
                    placeholder="Adresse email"
                  />
                  <input 
                    type="password" 
                    className="phishing-form-input" 
                    placeholder="Mot de passe"
                  />
                  <input 
                    type="text" 
                    className="phishing-form-input" 
                    placeholder="Numéro de carte bancaire"
                  />
                  <input 
                    type="text" 
                    className="phishing-form-input" 
                    placeholder="Code CVV"
                  />
                  <button 
                    className="phishing-form-submit"
                    onClick={submitPhishingForm}
                  >
                    Vérifier mon compte
                  </button>
                </div>
              )}
            </div>

            <button 
              className="phishing-close"
              onClick={() => setShowPhishingMessage(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Modal de conséquences */}
      {showConsequences && consequences && (
        <div className="consequences-modal" onClick={closeConsequences}>
          <div className="consequences-content" onClick={(e) => e.stopPropagation()}>
            <div className={`consequences-header ${consequences.type}`}>
              <div className="consequences-title">{consequences.title}</div>
              <div className="consequences-message">{consequences.message}</div>
            </div>
            <div className="consequences-body">
              {/* Stats */}
              {consequences.stats && (
                <div className="consequences-stats">
                  {consequences.stats.money && (
                    <div className={`consequence-stat ${consequences.stats.money > 0 ? 'positive' : 'negative'}`}>
                      <div className="consequence-stat-label">Argent</div>
                      <div className="consequence-stat-value">
                        {consequences.stats.money > 0 ? '+' : ''}{consequences.stats.money}€
                      </div>
                    </div>
                  )}
                  {consequences.stats.reputation && (
                    <div className={`consequence-stat ${consequences.stats.reputation > 0 ? 'positive' : 'negative'}`}>
                      <div className="consequence-stat-label">Réputation</div>
                      <div className="consequence-stat-value">
                        {consequences.stats.reputation > 0 ? '+' : ''}{consequences.stats.reputation}%
                      </div>
                    </div>
                  )}
                  {consequences.stats.parentsTrust && (
                    <div className="consequence-stat negative">
                      <div className="consequence-stat-label">Confiance Parents</div>
                      <div className="consequence-stat-value">
                        {consequences.stats.parentsTrust}%
                      </div>
                    </div>
                  )}
                  {consequences.stats.score && (
                    <div className={`consequence-stat ${consequences.stats.score > 0 ? 'positive' : 'negative'}`}>
                      <div className="consequence-stat-label">Score</div>
                      <div className="consequence-stat-value">
                        {consequences.stats.score > 0 ? '+' : ''}{consequences.stats.score}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Explications détaillées */}
              <div className="consequences-explanation">
                <div className="consequences-explanation-title">
                  💡 Ce que tu dois retenir :
                </div>
                <div className="consequences-explanation-text">
                  {consequences.type === 'success' && currentTask?.id === 1 && (
                    <>
                      <p><strong>✅ Bien joué !</strong> Cette photo ne contenait pas d'informations sensibles. Tu peux partager ce genre de contenu en toute sécurité.</p>
                      <br />
                      <p><strong>Règle d'or :</strong> Avant de publier, demande-toi : "Est-ce que cette photo révèle des infos personnelles que je ne voudrais pas qu'un inconnu connaisse ?"</p>
                    </>
                  )}
                  {consequences.type === 'success' && currentTask?.id === 2 && (
                    <>
                      <p><strong>✅ Excellent choix !</strong> Sarah est une vraie personne que tu connais, avec 8 amis en commun et un compte ancien. C'est exactement le type de profil à accepter !</p>
                      <br />
                      <p><strong>Signaux positifs à chercher :</strong></p>
                      <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                        <li>Plusieurs amis en commun</li>
                        <li>Compte ancien (plusieurs années)</li>
                        <li>Nombreuses publications et photos</li>
                        <li>Informations cohérentes (école, âge, etc.)</li>
                      </ul>
                    </>
                  )}
                  {consequences.type === 'critical' && consequences.title.includes('carte') && (
                    <>
                      <p><strong>🚨 ERREUR GRAVE !</strong> Tu as partagé des informations bancaires visibles (numéro de carte + CVV). Des hackers peuvent utiliser ces infos pour voler de l'argent.</p>
                      <br />
                      <p><strong>À NE JAMAIS partager :</strong></p>
                      <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                        <li>Cartes bancaires</li>
                        <li>Mots de passe</li>
                        <li>Documents d'identité</li>
                        <li>Codes de sécurité</li>
                      </ul>
                      <br />
                      <p>Dans la vraie vie, tu devrais <strong>immédiatement supprimer la photo</strong> et <strong>faire opposition sur ta carte</strong>.</p>
                    </>
                  )}
                  {consequences.type === 'critical' && consequences.title.includes('Faux profil') && (
                    <>
                      <p><strong>🚨 Profil frauduleux !</strong> Ce compte présente tous les signes d'un faux profil : créé récemment, 0 amis en commun, nom suspect, bio avec liens douteux.</p>
                      <br />
                      <p><strong>Signaux d'alerte :</strong></p>
                      <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                        <li>Compte créé très récemment (hier, quelques jours)</li>
                        <li>Aucun ami en commun</li>
                        <li>Nom bizarre avec emojis ou mots comme "sexy"</li>
                        <li>Très peu de publications</li>
                        <li>Bio avec liens suspects</li>
                      </ul>
                      <br />
                      <p>Ces profils envoient du spam, des virus et tentent de voler tes données !</p>
                    </>
                  )}
                  {consequences.type === 'critical' && consequences.title.includes('Adulte suspect') && (
                    <>
                      <p><strong>🚨 DANGER MAJEUR !</strong> Thomas est un adulte de 30 ans qui commente sur de nombreux profils d'ados. C'est un comportement typique de prédateur en ligne.</p>
                      <br />
                      <p><strong>RÈGLE ABSOLUE :</strong></p>
                      <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                        <li><strong>NE JAMAIS</strong> accepter d'adultes inconnus</li>
                        <li><strong>NE JAMAIS</strong> donner ton adresse ou numéro de téléphone</li>
                        <li><strong>NE JAMAIS</strong> accepter de rencontrer quelqu'un d'internet seul</li>
                        <li><strong>TOUJOURS</strong> en parler à un adulte de confiance si quelqu'un te met mal à l'aise</li>
                      </ul>
                      <br />
                      <p>Si un adulte inconnu te contacte, <strong>bloque-le immédiatement</strong> et <strong>préviens tes parents</strong> !</p>
                    </>
                  )}
                  {consequences.type === 'warning' && consequences.title.includes('V-Bucks') && (
                    <>
                      <p><strong>⚠️ Arnaque classique !</strong> Les offres de V-Bucks, Robux ou autre monnaie de jeu "gratuite" sont TOUJOURS des arnaques.</p>
                      <br />
                      <p><strong>Comment ça marche :</strong></p>
                      <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                        <li>Tu cliques sur le lien → Site qui ressemble au vrai</li>
                        <li>On te demande tes identifiants</li>
                        <li>Les hackers volent ton compte et tes infos</li>
                        <li>Ils utilisent ton compte pour arnaquer tes amis</li>
                      </ul>
                      <br />
                      <p><strong>Retiens bien :</strong> Rien n'est gratuit en ligne. Les vraies boutiques officielles ne donnent jamais de monnaie gratuite via des liens douteux !</p>
                    </>
                  )}
                  {consequences.type === 'warning' && consequences.title.includes('adresse') && (
                    <>
                      <p><strong>⚠️ Attention !</strong> Ta photo révèle ton adresse exacte (12 Rue des Lilas). Des personnes malveillantes pourraient utiliser cette info.</p>
                      <br />
                      <p><strong>Infos à éviter :</strong></p>
                      <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                        <li>Adresse précise</li>
                        <li>Nom de ton école</li>
                        <li>Plaques d'immatriculation</li>
                        <li>Lieux que tu fréquentes régulièrement</li>
                      </ul>
                      <br />
                      <p><strong>Conseil :</strong> Partage ce genre de photos uniquement en privé avec tes vrais amis.</p>
                    </>
                  )}
                  {consequences.type === 'info' && currentTask?.id === 1 && (
                    <>
                      <p><strong>💡 Photo OK, mais...</strong> Tu as oublié le <strong>droit à l'image</strong> !</p>
                      <br />
                      <p>En France, tu dois <strong>demander l'autorisation</strong> avant de publier une photo où apparaissent d'autres personnes. C'est la loi !</p>
                      <br />
                      <p><strong>Bonne pratique :</strong> Avant de poster une photo de groupe, envoie-la en privé à tes amis pour qu'ils valident. S'ils disent non, respecte leur choix !</p>
                    </>
                  )}
                  {consequences.type === 'critical' && consequences.title.includes('PIRATÉ') && (
                    <>
                      <p><strong>🚨 TU AS ÉTÉ VICTIME DE PHISHING !</strong> En donnant tes identifiants et infos bancaires, les hackers ont maintenant accès à ton compte et ton argent.</p>
                      <br />
                      <p><strong>Signaux d'alerte du phishing :</strong></p>
                      <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                        <li>URL suspecte : <strong>facebook-security-verification.com</strong> (pas facebook.com)</li>
                        <li>Pas de badge "vérifié" à côté du nom</li>
                        <li>Urgence artificielle : "24h pour agir !"</li>
                        <li>Demande de mot de passe ET infos bancaires</li>
                        <li>Adresse email bizarre : security-team@facebook-verify.com</li>
                      </ul>
                      <br />
                      <p><strong>RÈGLE D'OR :</strong> Facebook ne te demandera JAMAIS ton mot de passe ou tes infos bancaires par message ! En cas de doute, va directement sur le site officiel (tape facebook.com dans ton navigateur).</p>
                    </>
                  )}
                  {consequences.type === 'success' && consequences.badge === 'Cyber-Vigilant' && (
                    <>
                      <p><strong>🏆 EXCELLENT RÉFLEXE !</strong> Tu as identifié le phishing et l'as signalé. Tu protèges non seulement ton compte, mais aussi les autres utilisateurs !</p>
                      <br />
                      <p><strong>Comment reconnaître le phishing :</strong></p>
                      <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                        <li><strong>Vérifie l'URL</strong> : doit être exactement facebook.com (pas facebook-verify, facebook-security, etc.)</li>
                        <li><strong>Badge vérifié</strong> : les vrais comptes officiels ont un ✓ bleu</li>
                        <li><strong>Adresse email</strong> : facebook.com, pas facebook-verify.com</li>
                        <li><strong>Urgence suspecte</strong> : "24h sinon suppression" = technique de pression</li>
                        <li><strong>Demandes inhabituelles</strong> : mot de passe + carte bancaire = JAMAIS légitime</li>
                      </ul>
                      <br />
                      <p><strong>Que faire :</strong> Signale toujours les tentatives de phishing pour aider Facebook à protéger les autres !</p>
                    </>
                  )}
                  {consequences.type === 'success' && consequences.title.includes('réflexion') && currentTask?.id === 3 && (
                    <>
                      <p><strong>✅ Bon réflexe !</strong> Vérifier avant d'agir, c'est exactement ce qu'il faut faire face à un message suspect.</p>
                      <br />
                      <p><strong>Indices qui prouvent que c'était du phishing :</strong></p>
                      <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                        <li>L'URL n'est pas facebook.com</li>
                        <li>Pas de badge vérifié</li>
                        <li>Demande de mot de passe ET carte bancaire (jamais légitime)</li>
                        <li>Urgence artificielle pour te stresser</li>
                      </ul>
                      <br />
                      <p><strong>En cas de doute :</strong> Va directement sur le site officiel en tapant l'URL toi-même. Ne clique jamais sur les liens dans les messages suspects !</p>
                    </>
                  )}
                  {consequences.type === 'info' && consequences.title.includes('ignoré') && currentTask?.id === 3 && (
                    <>
                      <p><strong>🤔 Pas mal...</strong> Ignorer un message suspect est mieux que de cliquer, mais tu peux faire encore mieux !</p>
                      <br />
                      <p><strong>Pourquoi signaler le phishing :</strong></p>
                      <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                        <li>Tu protèges les autres utilisateurs qui pourraient tomber dans le piège</li>
                        <li>Facebook peut bloquer ces escrocs</li>
                        <li>Plus il y a de signalements, plus vite le compte est supprimé</li>
                      </ul>
                      <br />
                      <p><strong>Prochaine fois :</strong> Prends 2 secondes pour signaler. Tu sauves peut-être quelqu'un de se faire pirater !</p>
                    </>
                  )}
                  {consequences.type === 'critical' && consequences.title.includes('ARNAQUER') && (
                    <>
                      <p><strong>🚨 ARNAQUE CLASSIQUE !</strong> Le compte de Julien a été piraté. Le hacker utilise son identité pour arnaquer ses contacts. Tu viens de perdre 50€.</p>
                      <br />
                      <p><strong>Signaux d'alarme à repérer :</strong></p>
                      <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                        <li><strong>Changement brutal de sujet</strong> : "projet SVT" → "frère à l'hôpital"</li>
                        <li><strong>Urgence suspecte</strong> : "c'est URGENT !!!" = technique de pression</li>
                        <li><strong>Histoire émotionnelle</strong> : "frère à l'hôpital" pour te forcer à agir vite</li>
                        <li><strong>Demande d'argent</strong> : un vrai ami t'appellerait ou demanderait à tes parents</li>
                        <li><strong>Mauvaise orthographe</strong> : "lhopital", "probleme" = hackers ne font pas attention</li>
                      </ul>
                      <br />
                      <p><strong>QUE FAIRE :</strong> Toujours vérifier par un autre moyen (SMS, appel, en personne) avant d'envoyer de l'argent !</p>
                    </>
                  )}
                  {consequences.type === 'critical' && consequences.title.includes('compte a été piraté') && (
                    <>
                      <p><strong>🚨 TON COMPTE EST COMPROMIS !</strong> En donnant ton code de vérification, tu as permis au hacker d'accéder à TON compte.</p>
                      <br />
                      <p><strong>Pourquoi c'est dangereux :</strong></p>
                      <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                        <li>Le hacker peut maintenant se connecter à ton compte</li>
                        <li>Il va arnaquer TES amis en se faisant passer pour toi</li>
                        <li>Il peut voler tes photos et infos personnelles</li>
                        <li>Il peut changer ton mot de passe et te bloquer</li>
                      </ul>
                      <br />
                      <p><strong>RÈGLE ABSOLUE :</strong> Ne JAMAIS donner de code de vérification à PERSONNE ! Facebook ne te demandera jamais ce code par message !</p>
                    </>
                  )}
                  {consequences.type === 'success' && consequences.title.includes('Bonne décision') && currentTask?.id === 4 && (
                    <>
                      <p><strong>✅ EXCELLENT RÉFLEXE !</strong> En vérifiant par téléphone, tu as découvert que Julien n'avait rien demandé. Son compte était piraté !</p>
                      <br />
                      <p><strong>Comment vérifier :</strong></p>
                      <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                        <li><strong>Appeler</strong> : Le moyen le plus sûr</li>
                        <li><strong>SMS</strong> : Vérifier le numéro de téléphone réel</li>
                        <li><strong>En personne</strong> : Si possible (école, etc.)</li>
                        <li><strong>Autre réseau social</strong> : Instagram, Snapchat du vrai compte</li>
                      </ul>
                      <br />
                      <p><strong>Règle d'or :</strong> Face à une demande urgente d'argent ou d'infos, TOUJOURS vérifier par un autre moyen de contact !</p>
                    </>
                  )}
                  {consequences.type === 'success' && consequences.badge === 'Protecteur' && (
                    <>
                      <p><strong>🏆 TU ES UN HÉROS !</strong> Tu as prévenu Julien que son compte était piraté ET signalé le compte frauduleux. Tu as protégé Julien et tous ses contacts !</p>
                      <br />
                      <p><strong>Impact de ton action :</strong></p>
                      <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                        <li>Julien peut reprendre le contrôle de son compte</li>
                        <li>Le hacker ne peut plus arnaquer d'autres personnes</li>
                        <li>Facebook peut bloquer et supprimer le compte piraté</li>
                        <li>Les autres amis de Julien sont protégés</li>
                      </ul>
                      <br />
                      <p><strong>Toujours se rappeler :</strong> Quand tu vois quelque chose de suspect, AGIS ! Préviens la personne concernée et signale à la plateforme. Tu peux sauver quelqu'un !</p>
                    </>
                  )}
                  {consequences.type === 'critical' && consequences.title.includes('FAKE NEWS') && (
                    <>
                      <p><strong>🚨 TU AS PROPAGÉ DE LA DÉSINFORMATION !</strong> Ce post était complètement FAUX. TikTok et Instagram ne ferment pas. En partageant sans vérifier, tu as contribué à répandre la panique.</p>
                      <br />
                      <p><strong>Pourquoi c'est grave :</strong></p>
                      <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                        <li>Tes amis vont croire une fausse information</li>
                        <li>Certains vont paniquer et la partager aussi</li>
                        <li>La fake news va se propager exponentiellement</li>
                        <li>Ta crédibilité est atteinte (tu partages n'importe quoi)</li>
                      </ul>
                      <br />
                      <p><strong>Comment reconnaître une fake news :</strong></p>
                      <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                        <li><strong>Source inconnue</strong> : Vérifie qui publie l'info</li>
                        <li><strong>Pas de badge vérifié</strong> : Les vrais médias ont un ✓</li>
                        <li><strong>Titre sensationnaliste</strong> : "URGENT", "INCROYABLE", emojis partout</li>
                        <li><strong>Incitation au partage</strong> : "PARTAGE avant qu'il soit trop tard"</li>
                        <li><strong>Aucun autre média n'en parle</strong> : Si c'était vrai, tous les médias en parleraient</li>
                      </ul>
                      <br />
                      <p><strong>RÈGLE D'OR :</strong> Toujours vérifier sur des sources fiables (20 Minutes, Le Monde, France Info) avant de partager une info choquante !</p>
                    </>
                  )}
                  {consequences.type === 'success' && consequences.badge === 'Fact-Checker' && (
                    <>
                      <p><strong>🏆 BRAVO FACT-CHECKER !</strong> Tu as détecté la fake news et l'as signalée. Tu protèges ta communauté contre la désinformation !</p>
                      <br />
                      <p><strong>Comment fact-checker :</strong></p>
                      <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                        <li><strong>Vérifier la source</strong> : Est-ce un média connu ? A-t-il un badge vérifié ?</li>
                        <li><strong>Chercher sur Google</strong> : D'autres sites sérieux en parlent-ils ?</li>
                        <li><strong>Vérifier la date</strong> : La photo/vidéo est-elle récente ou recyclée ?</li>
                        <li><strong>Lire l'article entier</strong> : Pas que le titre sensationnaliste</li>
                        <li><strong>Sites de fact-checking</strong> : AFP Factuel, Les Décodeurs du Monde</li>
                      </ul>
                      <br />
                      <p><strong>Impact de ton action :</strong> En signalant, tu aides Facebook à limiter la portée de cette fake news et à protéger les autres utilisateurs !</p>
                    </>
                  )}
                  {consequences.type === 'success' && consequences.title.includes('Bon réflexe') && currentTask?.id === 5 && (
                    <>
                      <p><strong>✅ EXCELLENT RÉFLEXE !</strong> Tu as pris le temps de vérifier avant de partager. C'est exactement ce qu'il faut faire !</p>
                      <br />
                      <p><strong>Tu as découvert que :</strong></p>
                      <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                        <li>Aucun média sérieux ne parle de cette "fermeture"</li>
                        <li>Le site "info-jeunesse-actu.com" n'existe même pas</li>
                        <li>C'est une rumeur créée pour obtenir des clics et des partages</li>
                      </ul>
                      <br />
                      <p><strong>Toujours se rappeler :</strong> Si une info te choque ou te surprend, c'est NORMAL d'avoir des doutes. Vérifie sur des sources fiables avant de partager !</p>
                    </>
                  )}
                  {consequences.type === 'info' && consequences.title.includes('Post ignoré') && currentTask?.id === 5 && (
                    <>
                      <p><strong>🤔 Pas mal...</strong> Tu n'as pas partagé, c'est déjà bien. Mais tu aurais pu aller plus loin !</p>
                      <br />
                      <p><strong>Pourquoi signaler les fake news :</strong></p>
                      <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                        <li>Facebook peut réduire la portée du post</li>
                        <li>D'autres utilisateurs verront un avertissement</li>
                        <li>Le compte qui propage des fakes peut être sanctionné</li>
                        <li>Tu protèges les personnes moins vigilantes</li>
                      </ul>
                      <br />
                      <p><strong>Prochaine fois :</strong> Prends 2 secondes pour signaler. Tu aides à combattre la désinformation !</p>
                    </>
                  )}
                  {consequences.type === 'info' && currentTask?.id === 1 && (
                    <>
                      <p><strong>💡 Photo OK, mais...</strong> Tu as oublié le <strong>droit à l'image</strong> !</p>
                      <br />
                      <p>En France, tu dois <strong>demander l'autorisation</strong> avant de publier une photo où apparaissent d'autres personnes. C'est la loi !</p>
                      <br />
                      <p><strong>Bonne pratique :</strong> Avant de poster une photo de groupe, envoie-la en privé à tes amis pour qu'ils valident. S'ils disent non, respecte leur choix !</p>
                    </>
                  )}
                </div>
              </div>

              <button 
                className="consequences-close-btn"
                onClick={closeConsequences}
              >
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
