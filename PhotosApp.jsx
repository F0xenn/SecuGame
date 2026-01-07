import React, { useState, useEffect } from 'react';
import { Folder, Image, X, ChevronLeft, Eye, AlertTriangle, CheckCircle } from 'lucide-react';

export default function PhotosApp({ onPhotoSelect, onAppOpened }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // Notifier que l'app est ouverte (pour l'étape 1 de la tâche)
  useEffect(() => {
    if (onAppOpened) {
      onAppOpened();
    }
  }, []);

  // Les 5 photos de la Situation 1
  const photos = [
    {
      id: 'setup_gaming',
      name: 'setup_gaming.jpg',
      thumbnail: '🖥️',
      size: '2.4 MB',
      date: new Date().toLocaleDateString('fr-FR'),
      description: 'Mon nouveau setup gaming avec écrans et clavier RGB',
      preview: `
        ╔════════════════════════════════╗
        ║  🖥️  SETUP GAMING  🖥️         ║
        ║                                ║
        ║    ▓▓▓▓▓▓▓      ▓▓▓▓▓▓▓       ║
        ║    ▓ 🎮 ▓      ▓ 🎮 ▓       ║
        ║    ▓▓▓▓▓▓▓      ▓▓▓▓▓▓▓       ║
        ║                                ║
        ║      ⌨️ Clavier RGB ⌨️         ║
        ║   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓        ║
        ║                                ║
        ║   🖱️ Souris  🎧 Casque        ║
        ╚════════════════════════════════╝
      `
    },
    {
      id: 'gateau_anniversaire',
      name: 'gateau_anniversaire.jpg',
      thumbnail: '🎂',
      size: '1.8 MB',
      date: new Date().toLocaleDateString('fr-FR'),
      description: 'Moi qui souffle les bougies de mon anniversaire',
      preview: `
        ╔════════════════════════════════╗
        ║    JOYEUX ANNIVERSAIRE ! 🎉    ║
        ║                                ║
        ║           🕯️ 🕯️ 🕯️            ║
        ║       ═══════════════          ║
        ║      ║   🎂  GÂTEAU  ║         ║
        ║      ║  AU CHOCOLAT  ║         ║
        ║       ═══════════════          ║
        ║                                ║
        ║         😊 MOI 😊              ║
        ║                                ║
        ║      🎈 🎁 🎊 🎉 🎈            ║
        ╚════════════════════════════════╝
      `
    },
    {
      id: 'carte_bancaire',
      name: 'carte_bancaire_cadeau.jpg',
      thumbnail: '💳',
      size: '0.9 MB',
      date: new Date().toLocaleDateString('fr-FR'),
      description: 'Ma carte bancaire cadeau posée sur le bureau',
      preview: `
        ╔════════════════════════════════╗
        ║     💳 CARTE BANCAIRE 💳       ║
        ║                                ║
        ║  ┌──────────────────────────┐  ║
        ║  │ 💳 MA BANQUE JEUNE      │  ║
        ║  │                          │  ║
        ║  │ 4532 1234 5678 9012      │  ║
        ║  │                          │  ║
        ║  │ ALEX MARTIN              │  ║
        ║  │ 12/27        CVV: 123    │  ║
        ║  └──────────────────────────┘  ║
        ║                                ║
        ╚════════════════════════════════╝
      `
    },
    {
      id: 'famille_maison',
      name: 'famille_maison.jpg',
      thumbnail: '🏠',
      size: '3.1 MB',
      date: new Date().toLocaleDateString('fr-FR'),
      description: 'Photo de famille devant la maison',
      preview: `
        ╔════════════════════════════════╗
        ║      PHOTO DE FAMILLE 👨‍👩‍👧     ║
        ║                                ║
        ║        ╱╲  MAISON  ╱╲         ║
        ║       ╱  ╲        ╱  ╲        ║
        ║      ╱____╲______╱____╲       ║
        ║      │ 🚪  │  🪟  │  🪟│       ║
        ║      │  12 RUE DES LILAS  │   ║
        ║      └────────────────────┘   ║
        ║                                ║
        ║     👨 👩 👧  FAMILLE          ║
        ╚════════════════════════════════╝
      `
    },
    {
      id: 'potes',
      name: 'moi_et_potes.jpg',
      thumbnail: '👥',
      size: '2.2 MB',
      date: new Date().toLocaleDateString('fr-FR'),
      description: 'Moi avec mes meilleurs amis au parc',
      preview: `
        ╔════════════════════════════════╗
        ║       AU PARC AVEC LES POTES   ║
        ║                                ║
        ║     🌳      🌳      🌳         ║
        ║                                ║
        ║   😊  😎  🤩  😁              ║
        ║   │   │   │   │               ║
        ║  MOI LUCAS EMMA TOM           ║
        ║                                ║
        ║  💬 "Trop cool cette aprem !"  ║
        ╚════════════════════════════════╝
      `
    }
  ];

  const handlePhotoClick = (photo) => {
    setPreviewPhoto(photo);
  };

  const handlePhotoSelect = (photo) => {
    setSelectedPhoto(photo);
    if (onPhotoSelect) {
      onPhotoSelect(photo);
    }
  };

  const closePreview = () => {
    setPreviewPhoto(null);
  };

  return (
    <div className="photos-app">
      <style>{`
        .photos-app {
          width: 100%;
          height: 100%;
          background: #f5f6fa;
          display: flex;
          flex-direction: column;
        }

        /* Header de l'explorateur */
        .explorer-header {
          background: white;
          padding: 16px 24px;
          border-bottom: 1px solid #e1e8ed;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .explorer-nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-button {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid #dfe6e9;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          color: #2d3436;
        }

        .nav-button:hover {
          background: #f1f3f5;
          border-color: #b2bec3;
        }

        .nav-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .explorer-path {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #f8f9fa;
          border: 1px solid #e1e8ed;
          border-radius: 8px;
          font-size: 14px;
          color: #2d3436;
        }

        .path-icon {
          color: #0984e3;
        }

        .path-text {
          font-weight: 500;
        }

        /* Info bar */
        .info-bar {
          background: #e3f2fd;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #90caf9;
          font-size: 13px;
          color: #1565c0;
        }

        .info-bar-icon {
          color: #1976d2;
        }

        /* Contenu principal */
        .explorer-content {
          flex: 1;
          padding: 24px;
          overflow: auto;
        }

        .photos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        /* Carte photo */
        .photo-card {
          background: white;
          border: 2px solid #e1e8ed;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
        }

        .photo-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          border-color: #0984e3;
        }

        .photo-card.selected {
          border-color: #0984e3;
          border-width: 3px;
          box-shadow: 0 4px 16px rgba(9, 132, 227, 0.3);
        }

        .photo-thumbnail {
          height: 160px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 72px;
          position: relative;
        }

        .photo-info {
          padding: 16px;
        }

        .photo-name {
          font-size: 14px;
          font-weight: 600;
          color: #2d3436;
          margin-bottom: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .photo-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #636e72;
        }

        .photo-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .photo-action-btn {
          flex: 1;
          padding: 8px;
          background: #f1f3f5;
          border: 1px solid #e1e8ed;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #2d3436;
        }

        .photo-action-btn:hover {
          background: #e9ecef;
          border-color: #0984e3;
          color: #0984e3;
        }

        .photo-action-btn.select {
          background: linear-gradient(135deg, #0984e3, #74b9ff);
          border: none;
          color: white;
        }

        .photo-action-btn.select:hover {
          background: linear-gradient(135deg, #0770c7, #5fa3e8);
        }

        /* Modal de prévisualisation */
        .preview-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.2s ease;
          padding: 40px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .preview-container {
          background: white;
          border-radius: 16px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow: auto;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease;
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

        .preview-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e1e8ed;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .preview-title {
          font-size: 18px;
          font-weight: 700;
          color: #2d3436;
        }

        .preview-close {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f3f5;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
          color: #2d3436;
        }

        .preview-close:hover {
          background: #e74c3c;
          color: white;
        }

        .preview-content {
          padding: 32px;
        }

        .preview-image-area {
          background: #2d3436;
          border-radius: 12px;
          padding: 40px;
          margin-bottom: 24px;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-ascii {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          line-height: 1.2;
          color: #00ff00;
          white-space: pre;
          text-align: left;
        }

        .preview-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .preview-detail {
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .preview-detail-label {
          font-size: 12px;
          font-weight: 600;
          color: #636e72;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .preview-detail-value {
          font-size: 15px;
          font-weight: 600;
          color: #2d3436;
        }

        .preview-description {
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
          border-left: 4px solid #0984e3;
          margin-bottom: 24px;
        }

        .preview-description-title {
          font-size: 14px;
          font-weight: 700;
          color: #2d3436;
          margin-bottom: 8px;
        }

        .preview-description-text {
          font-size: 14px;
          color: #636e72;
          line-height: 1.6;
        }

        .preview-actions {
          display: flex;
          gap: 12px;
        }

        .preview-action-btn {
          flex: 1;
          padding: 14px;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .preview-action-btn.primary {
          background: linear-gradient(135deg, #0984e3, #74b9ff);
          color: white;
        }

        .preview-action-btn.primary:hover {
          background: linear-gradient(135deg, #0770c7, #5fa3e8);
          transform: translateY(-2px);
        }

        .preview-action-btn.secondary {
          background: #f1f3f5;
          color: #2d3436;
        }

        .preview-action-btn.secondary:hover {
          background: #e9ecef;
        }
      `}</style>

      {/* Header */}
      <div className="explorer-header">
        <div className="explorer-nav">
          <button className="nav-button" disabled>
            <ChevronLeft size={18} />
          </button>
        </div>
        <div className="explorer-path">
          <Folder size={18} className="path-icon" />
          <span className="path-text">Bureau › Mes Photos</span>
        </div>
      </div>

      {/* Info bar */}
      <div className="info-bar">
        <Image size={16} className="info-bar-icon" />
        <span>{photos.length} photos disponibles • Clique pour prévisualiser</span>
      </div>

      {/* Contenu */}
      <div className="explorer-content">
        <div className="photos-grid">
          {photos.map(photo => (
            <div
              key={photo.id}
              className={`photo-card ${selectedPhoto?.id === photo.id ? 'selected' : ''}`}
            >
              <div 
                className="photo-thumbnail"
                onClick={() => handlePhotoClick(photo)}
              >
                {photo.thumbnail}
              </div>
              <div className="photo-info">
                <div className="photo-name">{photo.name}</div>
                <div className="photo-meta">
                  <span>{photo.size}</span>
                  <span>{photo.date}</span>
                </div>
                <div className="photo-actions">
                  <button 
                    className="photo-action-btn"
                    onClick={() => handlePhotoClick(photo)}
                  >
                    <Eye size={14} />
                    Voir
                  </button>
                  <button 
                    className="photo-action-btn select"
                    onClick={() => handlePhotoSelect(photo)}
                  >
                    <CheckCircle size={14} />
                    Sélectionner
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de prévisualisation */}
      {previewPhoto && (
        <div className="preview-modal" onClick={closePreview}>
          <div className="preview-container" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <div className="preview-title">{previewPhoto.name}</div>
              <button className="preview-close" onClick={closePreview}>
                <X size={20} />
              </button>
            </div>
            
            <div className="preview-content">
              {/* Image preview (ASCII art) */}
              <div className="preview-image-area">
                <pre className="preview-ascii">{previewPhoto.preview}</pre>
              </div>

              {/* Détails */}
              <div className="preview-details">
                <div className="preview-detail">
                  <div className="preview-detail-label">Taille</div>
                  <div className="preview-detail-value">{previewPhoto.size}</div>
                </div>
                <div className="preview-detail">
                  <div className="preview-detail-label">Date</div>
                  <div className="preview-detail-value">{previewPhoto.date}</div>
                </div>
              </div>

              {/* Description */}
              <div className="preview-description">
                <div className="preview-description-title">📝 Description</div>
                <div className="preview-description-text">{previewPhoto.description}</div>
              </div>

              {/* Actions */}
              <div className="preview-actions">
                <button 
                  className="preview-action-btn primary"
                  onClick={() => {
                    handlePhotoSelect(previewPhoto);
                    closePreview();
                  }}
                >
                  <CheckCircle size={18} />
                  Sélectionner cette photo
                </button>
                <button 
                  className="preview-action-btn secondary"
                  onClick={closePreview}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
