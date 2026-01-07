import React, { useState } from 'react';
import { Folder, CreditCard, Globe, X, Minimize, Maximize } from 'lucide-react';
import BankApp from './BankApp';
import PhotosApp from './PhotosApp';
import ChromeApp from './ChromeApp';

export default function WindowsEnvironment() {
  const [time, setTime] = useState(new Date());
  const [openWindows, setOpenWindows] = useState([]);
  const [gameState, setGameState] = useState({
    money: 500,
    reputation: 100,
    accountSecurity: 100,
    parentsTrust: 100
  });
  const [draggingWindow, setDraggingWindow] = useState(null);
  const [showStatsTooltip, setShowStatsTooltip] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [focusedWindow, setFocusedWindow] = useState(null);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: new Date().toLocaleDateString('fr-FR'),
      time: '14:32',
      description: 'Cadeau d\'anniversaire',
      amount: 500,
      type: 'credit'
    }
  ]);
  
  // Système de slides et tâches
  const [showIntroSlides, setShowIntroSlides] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showTaskTitle, setShowTaskTitle] = useState(false);
  const [showTaskTooltip, setShowTaskTooltip] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // Définition des tâches
  const tasks = [
    {
      id: 1,
      title: 'Tâche 1 : Photo d\'anniversaire',
      description: 'Publie une photo de ton anniversaire sur Facebook',
      steps: [
        { id: 1, label: 'Ouvrir "Mes Photos"', completed: false },
        { id: 2, label: 'Choisir une photo', completed: false },
        { id: 3, label: 'Publier sur Facebook', completed: false }
      ]
    },
    {
      id: 2,
      title: 'Tâche 2 : Demandes d\'amis',
      description: 'Analyse et gère tes demandes d\'amis sur Facebook',
      steps: [
        { id: 1, label: 'Ouvrir les demandes d\'amis', completed: false },
        { id: 2, label: 'Analyser les profils suspects', completed: false },
        { id: 3, label: 'Faire ton choix', completed: false }
      ]
    },
    {
      id: 3,
      title: 'Tâche 3 : Message suspect',
      description: 'Tu reçois un message de "Facebook Security"',
      steps: [
        { id: 1, label: 'Lire le message', completed: false },
        { id: 2, label: 'Analyser les indices suspects', completed: false },
        { id: 3, label: 'Prendre la bonne décision', completed: false }
      ]
    },
    {
      id: 4,
      title: 'Tâche 4 : Message suspect',
      description: 'Julien, un camarade de classe, t\'envoie un message...',
      steps: [
        { id: 1, label: 'Lire le message de Julien', completed: false },
        { id: 2, label: 'Repérer les comportements suspects', completed: false },
        { id: 3, label: 'Réagir correctement', completed: false }
      ]
    },
    {
      id: 5,
      title: 'Tâche 5 : Trouve la fake news',
      description: 'Repère et signale les fake news dans ton fil d\'actualité',
      steps: [
        { id: 1, label: 'Analyser les posts du fil', completed: false },
        { id: 2, label: 'Identifier les fake news', completed: false },
        { id: 3, label: 'Signaler les publications suspectes', completed: false }
      ]
    }
  ];

  // Mettre à jour l'heure toutes les secondes
  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Applications disponibles
  const desktopIcons = [
    {
      id: 'photos',
      name: 'Mes Photos',
      icon: <Folder size={48} />,
      color: '#FFB800'
    },
    {
      id: 'bank',
      name: 'Ma Banque',
      icon: <CreditCard size={48} />,
      color: '#00B894'
    },
    {
      id: 'chrome',
      name: 'Chrome',
      icon: <Globe size={48} />,
      color: '#4285F4'
    }
  ];

  // Ouvrir une fenêtre
  const openWindow = (appId) => {
    // Vérifier si la fenêtre n'est pas déjà ouverte
    if (!openWindows.find(w => w.id === appId)) {
      const newWindow = {
        id: appId,
        title: desktopIcons.find(icon => icon.id === appId).name,
        isMaximized: false,
        isMinimized: false,
        position: { 
          x: 100 + openWindows.length * 40, 
          y: 50 + openWindows.length * 40 
        },
        size: { width: 800, height: 600 }
      };
      setOpenWindows([...openWindows, newWindow]);
      setFocusedWindow(appId); // Définir le focus sur la nouvelle fenêtre
    } else {
      // Si la fenêtre existe déjà, la mettre au premier plan
      setFocusedWindow(appId);
    }
  };

  // Commencer le drag
  const handleMouseDown = (e, windowId) => {
    if (e.target.closest('.window-controls')) return; // Ne pas drag si on clique sur les boutons
    
    const window = openWindows.find(w => w.id === windowId);
    if (window.isMaximized) return; // Ne pas drag si maximisé

    // Mettre la fenêtre au premier plan
    setFocusedWindow(windowId);

    setDraggingWindow({
      id: windowId,
      startX: e.clientX,
      startY: e.clientY,
      windowX: window.position.x,
      windowY: window.position.y
    });
  };

  // Mettre une fenêtre au premier plan au clic
  const bringToFront = (windowId) => {
    setFocusedWindow(windowId);
  };

  // Drag en cours
  const handleMouseMove = (e) => {
    if (!draggingWindow) return;

    const deltaX = e.clientX - draggingWindow.startX;
    const deltaY = e.clientY - draggingWindow.startY;

    setOpenWindows(openWindows.map(w => 
      w.id === draggingWindow.id 
        ? { 
            ...w, 
            position: {
              x: draggingWindow.windowX + deltaX,
              y: draggingWindow.windowY + deltaY
            }
          }
        : w
    ));
  };

  // Fin du drag
  const handleMouseUp = () => {
    setDraggingWindow(null);
  };

  // Ajouter les event listeners pour le drag
  React.useEffect(() => {
    if (draggingWindow) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingWindow]);

  // Fermer une fenêtre
  const closeWindow = (appId) => {
    setOpenWindows(openWindows.filter(w => w.id !== appId));
  };

  // Minimiser une fenêtre
  const minimizeWindow = (appId) => {
    setOpenWindows(openWindows.map(w => 
      w.id === appId ? { ...w, isMinimized: true } : w
    ));
  };

  // Maximiser/Restaurer une fenêtre
  const toggleMaximize = (appId) => {
    setOpenWindows(openWindows.map(w => 
      w.id === appId ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  };

  // Restaurer depuis la barre des tâches
  const restoreWindow = (appId) => {
    setOpenWindows(openWindows.map(w => 
      w.id === appId ? { ...w, isMinimized: false } : w
    ));
    // Mettre la fenêtre au premier plan
    setFocusedWindow(appId);
  };

  // Mettre à jour le gameState (pour les apps qui modifient les stats)
  const updateGameState = (updates) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  // Ajouter une transaction bancaire
  const addTransaction = (transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  // Gestion des slides d'intro
  const nextSlide = () => {
    if (currentSlide < 2) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Fin des slides, démarrer la première tâche
      setShowIntroSlides(false);
      startTask(1);
    }
  };

  const previousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Démarrer une tâche
  const startTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    setCurrentTask(task);
    setShowTaskTitle(true);
    
    // Masquer le titre après 4 secondes
    setTimeout(() => {
      setShowTaskTitle(false);
    }, 4000);
  };

  // Mettre à jour une étape de tâche
  const updateTaskStep = (taskId, stepId, completed) => {
    if (currentTask && currentTask.id === taskId) {
      setCurrentTask(prev => ({
        ...prev,
        steps: prev.steps.map(step => 
          step.id === stepId ? { ...step, completed } : step
        )
      }));
    }
  };

  // Rendre le contenu de chaque application
  const renderAppContent = (appId) => {
    switch(appId) {
      case 'bank':
        return (
          <BankApp 
            gameState={gameState}
            onUpdateGameState={updateGameState}
            transactions={transactions}
          />
        );
      case 'photos':
        return (
          <PhotosApp 
            onPhotoSelect={(photo) => {
              setSelectedPhoto(photo);
              console.log('Photo sélectionnée:', photo);
              // ✅ Étape 2 complétée : Choisir une photo
              updateTaskStep(1, 2, true);
            }}
            onAppOpened={() => {
              // ✅ Étape 1 complétée : Ouvrir "Mes Photos"
              updateTaskStep(1, 1, true);
            }}
          />
        );
      case 'chrome':
        return (
          <ChromeApp 
            gameState={gameState}
            onUpdateGameState={updateGameState}
            selectedPhoto={selectedPhoto}
            onAddTransaction={addTransaction}
            onPhotoPublished={() => {
              // ✅ Étape 3 complétée : Publier sur Facebook
              updateTaskStep(1, 3, true);
            }}
            currentTask={currentTask}
            onTaskStepComplete={updateTaskStep}
            onStartNextTask={() => {
              // Démarrer la tâche suivante
              if (currentTask && currentTask.id < tasks.length) {
                startTask(currentTask.id + 1);
              }
            }}
          />
        );
      default:
        return (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Application</h2>
            <p>Contenu à venir...</p>
          </div>
        );
    }
  };

  return (
    <div className="windows-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          overflow: hidden;
        }

        .windows-container {
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        /* Effet de texture sur le fond */
        .windows-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 0%, transparent 50%);
          pointer-events: none;
        }

        /* Bureau (Desktop) */
        .desktop {
          width: 100%;
          height: calc(100% - 48px);
          padding: 20px;
          display: grid;
          grid-template-columns: repeat(auto-fill, 100px);
          grid-auto-rows: 110px;
          gap: 20px;
          align-content: start;
        }

        /* Icône du bureau */
        .desktop-icon {
          width: 100px;
          height: 110px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: transparent;
          position: relative;
        }

        .desktop-icon:hover {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
        }

        .desktop-icon:active {
          transform: scale(0.95);
        }

        .icon-wrapper {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        }

        .desktop-icon:hover .icon-wrapper {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .icon-name {
          font-size: 12px;
          font-weight: 500;
          color: white;
          text-align: center;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
          line-height: 1.3;
          max-width: 90px;
          word-wrap: break-word;
        }

        /* Fenêtre d'application */
        .window {
          position: absolute;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: windowOpen 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 100;
        }

        .window.focused {
          z-index: 300;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.4);
        }

        .window.maximized {
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: calc(100vh - 48px) !important;
          border-radius: 0;
        }

        /* Fenêtre maximisée mais pas focusée - z-index plus bas */
        .window.maximized:not(.focused) {
          z-index: 150;
        }

        @keyframes windowOpen {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .window.minimized {
          display: none;
        }

        /* SUPPRIMÉ .window.normal car on utilise maintenant les positions dynamiques */

        /* Barre de titre de la fenêtre */
        .window-titlebar {
          height: 40px;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          border-bottom: 1px solid #e0e0e0;
          cursor: move;
          user-select: none;
        }

        .window-title {
          font-size: 13px;
          font-weight: 600;
          color: #333;
        }

        .window-controls {
          display: flex;
          gap: 8px;
        }

        .window-control-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          color: #666;
        }

        .window-control-btn:hover {
          background: #e0e0e0;
          color: #333;
        }

        .window-control-btn.close:hover {
          background: #e81123;
          color: white;
        }

        /* Contenu de la fenêtre */
        .window-content {
          flex: 1;
          overflow: auto;
          background: white;
        }

        /* Barre des tâches */
        .taskbar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 48px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 8px;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
          z-index: 40000;
        }

        .start-button {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: white;
          font-size: 20px;
          font-weight: 700;
        }

        .start-button:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .start-button:active {
          transform: scale(0.95);
        }

        .taskbar-apps {
          flex: 1;
          display: flex;
          gap: 4px;
          margin-left: 8px;
        }

        .taskbar-app {
          height: 40px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          font-size: 13px;
          color: #333;
          font-weight: 500;
        }

        .taskbar-app:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .taskbar-app.active {
          background: rgba(102, 126, 234, 0.15);
          border-bottom: 2px solid #667eea;
        }

        .taskbar-indicator {
          width: 4px;
          height: 4px;
          background: #667eea;
          border-radius: 50%;
        }

        .taskbar-time {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          padding: 0 12px;
          font-size: 12px;
          color: #333;
          line-height: 1.2;
        }

        .time-hour {
          font-weight: 600;
        }

        .time-date {
          font-size: 11px;
          opacity: 0.7;
        }

        /* Widget Stats dans la barre des tâches */
        .stats-widget {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
          margin-right: 8px;
        }

        .stats-widget:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .stats-widget-icon {
          display: flex;
          gap: 4px;
        }

        .mini-stat {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .mini-stat.money {
          background: linear-gradient(135deg, #00b894, #55efc4);
        }

        .mini-stat.reputation {
          background: linear-gradient(135deg, #0984e3, #74b9ff);
        }

        .mini-stat.security {
          background: linear-gradient(135deg, #6c5ce7, #a29bfe);
        }

        .mini-stat.trust {
          background: linear-gradient(135deg, #fd79a8, #fdcb6e);
        }

        /* Tooltip des stats */
        .stats-tooltip {
          position: absolute;
          bottom: 55px;
          right: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          min-width: 280px;
          animation: tooltipAppear 0.2s ease;
          z-index: 50000;
        }

        @keyframes tooltipAppear {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tooltip-header {
          font-size: 14px;
          font-weight: 700;
          color: #333;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f0f0f0;
        }

        .tooltip-stat {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.15s ease;
        }

        .tooltip-stat:hover {
          background: #f8f9fa;
        }

        .tooltip-stat:last-child {
          margin-bottom: 0;
        }

        .tooltip-stat-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .tooltip-stat-icon.money {
          background: linear-gradient(135deg, #00b894, #55efc4);
        }

        .tooltip-stat-icon.reputation {
          background: linear-gradient(135deg, #0984e3, #74b9ff);
        }

        .tooltip-stat-icon.security {
          background: linear-gradient(135deg, #6c5ce7, #a29bfe);
        }

        .tooltip-stat-icon.trust {
          background: linear-gradient(135deg, #fd79a8, #fdcb6e);
        }

        .tooltip-stat-info {
          flex: 1;
        }

        .tooltip-stat-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: #666;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .tooltip-stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #333;
        }

        .tooltip-stat-bar {
          width: 100%;
          height: 4px;
          background: #e0e0e0;
          border-radius: 2px;
          margin-top: 6px;
          overflow: hidden;
        }

        .tooltip-stat-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        /* Slides d'introduction */
        .intro-slides {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100000;
          animation: fadeIn 0.4s ease;
        }

        .slide-container {
          background: white;
          border-radius: 24px;
          max-width: 800px;
          width: 90%;
          max-height: 80vh;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.5s ease;
        }

        .slide-content {
          padding: 60px;
          text-align: center;
        }

        .slide-emoji {
          font-size: 80px;
          margin-bottom: 24px;
        }

        .slide-title {
          font-size: 36px;
          font-weight: 800;
          color: #2d3436;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .slide-text {
          font-size: 20px;
          color: #636e72;
          line-height: 1.7;
          margin-bottom: 32px;
        }

        .slide-examples {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin: 32px 0;
        }

        .slide-example {
          padding: 20px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          flex: 1;
          max-width: 200px;
        }

        .slide-example.good {
          background: linear-gradient(135deg, #d4edda, #c3e6cb);
          border: 2px solid #00b894;
          color: #00b894;
        }

        .slide-example.bad {
          background: linear-gradient(135deg, #f8d7da, #f5c6cb);
          border: 2px solid #d63031;
          color: #d63031;
        }

        .slide-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 60px;
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
        }

        .slide-dots {
          display: flex;
          gap: 8px;
        }

        .slide-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #dfe6e9;
          transition: all 0.3s ease;
        }

        .slide-dot.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          width: 32px;
          border-radius: 6px;
        }

        .slide-btn {
          padding: 12px 32px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .slide-btn.previous {
          background: #f1f3f5;
          color: #2d3436;
        }

        .slide-btn.previous:hover {
          background: #e9ecef;
        }

        .slide-btn.next {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .slide-btn.next:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .slide-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Widget de tâche dans la taskbar */
        .task-widget {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 16px;
          background: rgba(102, 126, 234, 0.1);
          border: 2px solid #667eea;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
          margin-right: 16px;
        }

        .task-widget:hover {
          background: rgba(102, 126, 234, 0.15);
          transform: translateY(-2px);
        }

        .task-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .task-info-compact {
          display: flex;
          flex-direction: column;
        }

        .task-number {
          font-size: 13px;
          font-weight: 700;
          color: #667eea;
        }

        .task-progress-mini {
          font-size: 11px;
          color: #636e72;
        }

        /* Tooltip de la tâche */
        .task-tooltip {
          position: absolute;
          bottom: 55px;
          right: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          min-width: 320px;
          animation: tooltipAppear 0.2s ease;
          z-index: 50000;
        }

        .task-tooltip-header {
          font-size: 16px;
          font-weight: 700;
          color: #2d3436;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f0f0f0;
        }

        .task-step {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 8px;
          transition: all 0.15s ease;
        }

        .task-step:hover {
          background: #f8f9fa;
        }

        .task-step-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        .task-step-icon.completed {
          background: #00b894;
          color: white;
        }

        .task-step-icon.pending {
          background: #dfe6e9;
          color: #b2bec3;
        }

        .task-step-label {
          font-size: 14px;
          font-weight: 500;
          flex: 1;
        }

        .task-step-label.completed {
          color: #636e72;
          text-decoration: line-through;
        }

        .task-step-label.pending {
          color: #2d3436;
        }

        /* Overlay de titre de tâche */
        .task-title-overlay {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 40px 60px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          z-index: 90000;
          text-align: center;
          animation: taskTitleAppear 0.5s ease;
        }

        @keyframes taskTitleAppear {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .task-title-overlay-emoji {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .task-title-overlay-title {
          font-size: 32px;
          font-weight: 800;
          color: #2d3436;
          margin-bottom: 12px;
        }

        .task-title-overlay-description {
          font-size: 18px;
          color: #636e72;
        }
      `}</style>

      {/* Slides d'introduction */}
      {showIntroSlides && (
        <div className="intro-slides">
          <div className="slide-container">
            {/* Slide 1 */}
            {currentSlide === 0 && (
              <div className="slide-content">
                <div className="slide-emoji">🎮</div>
                <div className="slide-title">
                  Bienvenue dans le Challenge Facebook !
                </div>
                <div className="slide-text">
                  Tu devras effectuer <strong>plusieurs tâches sur Facebook</strong> en essayant de faire le <strong>moins de bêtises possible</strong>.
                  <br /><br />
                  Chaque choix que tu feras aura des conséquences sur ton argent, ta réputation et la confiance de tes parents !
                </div>
              </div>
            )}

            {/* Slide 2 */}
            {currentSlide === 1 && (
              <div className="slide-content">
                <div className="slide-emoji">⚖️</div>
                <div className="slide-title">
                  Choisis avec sagesse !
                </div>
                <div className="slide-text">
                  Une tâche peut avoir <strong>plusieurs étapes</strong>.<br />
                  Tu seras <strong>récompensé ou puni</strong> selon tes choix.
                </div>
                <div className="slide-examples">
                  <div className="slide-example good">
                    ✅ Bon choix<br />
                    +Réputation<br />
                    +Score
                  </div>
                  <div className="slide-example bad">
                    ❌ Mauvais choix<br />
                    -Argent<br />
                    -Confiance
                  </div>
                </div>
              </div>
            )}

            {/* Slide 3 */}
            {currentSlide === 2 && (
              <div className="slide-content">
                <div className="slide-emoji">🎯</div>
                <div className="slide-title">
                  Prêt à commencer ?
                </div>
                <div className="slide-text">
                  Tu peux retrouver <strong>la tâche en cours</strong> et <strong>ton avancement</strong> en bas à droite de l'écran, juste à gauche de tes statistiques.
                  <br /><br />
                  Passe ta souris dessus pour voir le détail des étapes !
                  <br /><br />
                  <strong>Bonne chance ! 🍀</strong>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="slide-navigation">
              <button 
                className="slide-btn previous"
                onClick={previousSlide}
                disabled={currentSlide === 0}
              >
                ← Précédent
              </button>

              <div className="slide-dots">
                <div className={`slide-dot ${currentSlide === 0 ? 'active' : ''}`} />
                <div className={`slide-dot ${currentSlide === 1 ? 'active' : ''}`} />
                <div className={`slide-dot ${currentSlide === 2 ? 'active' : ''}`} />
              </div>

              <button 
                className="slide-btn next"
                onClick={nextSlide}
              >
                {currentSlide === 2 ? 'Commencer ! 🚀' : 'Suivant →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay de titre de tâche */}
      {showTaskTitle && currentTask && (
        <div className="task-title-overlay">
          <div className="task-title-overlay-emoji">📸</div>
          <div className="task-title-overlay-title">{currentTask.title}</div>
          <div className="task-title-overlay-description">{currentTask.description}</div>
        </div>
      )}

      {/* Stats HUD */}
      {/* SUPPRIMÉ - maintenant dans la barre des tâches */}

      {/* Bureau avec icônes */}
      <div className="desktop">
        {desktopIcons.map(icon => (
          <div
            key={icon.id}
            className="desktop-icon"
            onClick={() => openWindow(icon.id)}
            onDoubleClick={() => openWindow(icon.id)}
          >
            <div className="icon-wrapper" style={{ color: icon.color }}>
              {icon.icon}
            </div>
            <div className="icon-name">{icon.name}</div>
          </div>
        ))}
      </div>

      {/* Fenêtres ouvertes */}
      {openWindows.map(window => (
        <div
          key={window.id}
          className={`window ${window.isMaximized ? 'maximized' : 'normal'} ${window.isMinimized ? 'minimized' : ''} ${focusedWindow === window.id ? 'focused' : ''}`}
          style={
            !window.isMaximized ? {
              left: `${window.position.x}px`,
              top: `${window.position.y}px`,
              width: `${window.size.width}px`,
              height: `${window.size.height}px`
            } : {}
          }
          onClick={() => bringToFront(window.id)}
        >
          <div 
            className="window-titlebar"
            onMouseDown={(e) => handleMouseDown(e, window.id)}
          >
            <div className="window-title">{window.title}</div>
            <div className="window-controls">
              <button 
                className="window-control-btn"
                onClick={() => minimizeWindow(window.id)}
              >
                <Minimize size={16} />
              </button>
              <button 
                className="window-control-btn"
                onClick={() => toggleMaximize(window.id)}
              >
                <Maximize size={16} />
              </button>
              <button 
                className="window-control-btn close"
                onClick={() => closeWindow(window.id)}
              >
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="window-content">
            {renderAppContent(window.id)}
          </div>
        </div>
      ))}

      {/* Barre des tâches */}
      <div className="taskbar">
        <button className="start-button">⊞</button>
        
        <div className="taskbar-apps">
          {openWindows.map(window => (
            <button
              key={window.id}
              className={`taskbar-app ${!window.isMinimized ? 'active' : ''}`}
              onClick={() => {
                if (window.isMinimized) {
                  restoreWindow(window.id);
                } else {
                  // Juste mettre au premier plan si déjà visible
                  setFocusedWindow(window.id);
                }
              }}
            >
              {desktopIcons.find(icon => icon.id === window.id)?.icon}
              <span>{window.title}</span>
              {!window.isMinimized && <div className="taskbar-indicator" />}
            </button>
          ))}
        </div>

        {/* Widget de tâche (déplacé ici, avant les stats) */}
        {currentTask && (
          <div 
            className="task-widget"
            onMouseEnter={() => setShowTaskTooltip(true)}
            onMouseLeave={() => setShowTaskTooltip(false)}
          >
            <div className="task-icon">📋</div>
            <div className="task-info-compact">
              <div className="task-number">Tâche n°{currentTask.id}</div>
              <div className="task-progress-mini">
                {currentTask.steps.filter(s => s.completed).length}/{currentTask.steps.length} étapes
              </div>
            </div>

            {/* Tooltip de la tâche */}
            {showTaskTooltip && (
              <div className="task-tooltip">
                <div className="task-tooltip-header">
                  📋 {currentTask.title}
                </div>
                {currentTask.steps.map(step => (
                  <div key={step.id} className="task-step">
                    <div className={`task-step-icon ${step.completed ? 'completed' : 'pending'}`}>
                      {step.completed ? '✓' : step.id}
                    </div>
                    <div className={`task-step-label ${step.completed ? 'completed' : 'pending'}`}>
                      {step.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Widget Stats */}
        <div 
          className="stats-widget"
          onMouseEnter={() => setShowStatsTooltip(true)}
          onMouseLeave={() => setShowStatsTooltip(false)}
        >
          <div className="stats-widget-icon">
            <div className="mini-stat money">💰</div>
            <div className="mini-stat reputation">⭐</div>
            <div className="mini-stat security">🔐</div>
            <div className="mini-stat trust">❤️</div>
          </div>

          {showStatsTooltip && (
            <div className="stats-tooltip">
              <div className="tooltip-header">📊 Vos Statistiques</div>
              
              <div className="tooltip-stat">
                <div className="tooltip-stat-icon money">💰</div>
                <div className="tooltip-stat-info">
                  <div className="tooltip-stat-label">Argent</div>
                  <div className="tooltip-stat-value">{gameState.money}€</div>
                </div>
              </div>

              <div className="tooltip-stat">
                <div className="tooltip-stat-icon reputation">⭐</div>
                <div className="tooltip-stat-info">
                  <div className="tooltip-stat-label">Réputation</div>
                  <div className="tooltip-stat-value">{gameState.reputation}%</div>
                  <div className="tooltip-stat-bar">
                    <div 
                      className="tooltip-stat-bar-fill" 
                      style={{ width: `${gameState.reputation}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="tooltip-stat">
                <div className="tooltip-stat-icon security">🔐</div>
                <div className="tooltip-stat-info">
                  <div className="tooltip-stat-label">Sécurité</div>
                  <div className="tooltip-stat-value">{gameState.accountSecurity}%</div>
                  <div className="tooltip-stat-bar">
                    <div 
                      className="tooltip-stat-bar-fill" 
                      style={{ width: `${gameState.accountSecurity}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="tooltip-stat">
                <div className="tooltip-stat-icon trust">❤️</div>
                <div className="tooltip-stat-info">
                  <div className="tooltip-stat-label">Confiance Parents</div>
                  <div className="tooltip-stat-value">{gameState.parentsTrust}%</div>
                  <div className="tooltip-stat-bar">
                    <div 
                      className="tooltip-stat-bar-fill" 
                      style={{ width: `${gameState.parentsTrust}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="taskbar-time">
          <div className="time-hour">
            {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="time-date">
            {time.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
}
