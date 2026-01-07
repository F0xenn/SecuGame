import React, { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';

export default function BankApp({ gameState, onUpdateGameState, transactions = [] }) {
  const [previousMoney, setPreviousMoney] = useState(gameState.money);
  const [isAnimating, setIsAnimating] = useState(false);
  const [moneyChange, setMoneyChange] = useState(0);

  // Transactions venant des props (gérées par le parent)

  // Détecter les changements d'argent et animer
  useEffect(() => {
    if (gameState.money !== previousMoney) {
      const change = gameState.money - previousMoney;
      setMoneyChange(change);
      setIsAnimating(true);
      
      // Animation pendant 2 secondes
      setTimeout(() => {
        setIsAnimating(false);
        setPreviousMoney(gameState.money);
      }, 2000);
    }
  }, [gameState.money]);

  // Animation du compteur de solde
  const [displayMoney, setDisplayMoney] = useState(gameState.money);
  
  useEffect(() => {
    if (displayMoney !== gameState.money) {
      const diff = gameState.money - displayMoney;
      const increment = diff / 20; // 20 étapes pour l'animation
      
      const timer = setInterval(() => {
        setDisplayMoney(prev => {
          const next = prev + increment;
          if ((increment > 0 && next >= gameState.money) || 
              (increment < 0 && next <= gameState.money)) {
            clearInterval(timer);
            return gameState.money;
          }
          return next;
        });
      }, 50);
      
      return () => clearInterval(timer);
    }
  }, [gameState.money]);

  return (
    <div className="bank-app">
      <style>{`
        .bank-app {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          display: flex;
          flex-direction: column;
        }

        /* Header de la banque */
        .bank-header {
          background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
          padding: 30px 40px;
          color: white;
          box-shadow: 0 4px 20px rgba(0, 184, 148, 0.3);
        }

        .bank-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .bank-subtitle {
          font-size: 14px;
          opacity: 0.9;
          font-weight: 400;
        }

        /* Section solde */
        .balance-section {
          background: white;
          margin: 30px 40px;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }

        .balance-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #00b894, #00cec9);
        }

        .balance-label {
          font-size: 14px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }

        .balance-amount-container {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .balance-amount {
          font-size: 56px;
          font-weight: 800;
          color: #2d3436;
          transition: all 0.3s ease;
          font-family: 'Segoe UI', monospace;
        }

        .balance-amount.positive {
          color: #00b894;
        }

        .balance-amount.negative {
          color: #d63031;
        }

        .balance-currency {
          font-size: 36px;
          font-weight: 700;
          color: #636e72;
          margin-left: -10px;
        }

        /* Animation de changement d'argent */
        .money-change-indicator {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 30px;
          font-size: 20px;
          font-weight: 700;
          animation: slideInRight 0.4s ease, pulse 0.5s ease infinite alternate;
        }

        .money-change-indicator.gain {
          background: linear-gradient(135deg, #00b894, #00cec9);
          color: white;
        }

        .money-change-indicator.loss {
          background: linear-gradient(135deg, #d63031, #e17055);
          color: white;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.05);
          }
        }

        /* Barre de progression visuelle */
        .balance-bar {
          width: 100%;
          height: 8px;
          background: #e9ecef;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
        }

        .balance-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #00b894, #00cec9);
          border-radius: 10px;
          transition: width 1s ease;
          position: relative;
        }

        .balance-bar-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .balance-info {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          font-size: 13px;
          color: #636e72;
        }

        /* Section historique */
        .transactions-section {
          flex: 1;
          background: white;
          margin: 0 40px 30px 40px;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          overflow: auto;
        }

        .transactions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e9ecef;
        }

        .transactions-title {
          font-size: 20px;
          font-weight: 700;
          color: #2d3436;
        }

        .transactions-count {
          font-size: 14px;
          color: #636e72;
          background: #f1f3f5;
          padding: 6px 14px;
          border-radius: 20px;
          font-weight: 600;
        }

        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .transaction-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px;
          background: #f8f9fa;
          border-radius: 12px;
          transition: all 0.2s ease;
          border-left: 4px solid transparent;
        }

        .transaction-item:hover {
          background: #e9ecef;
          transform: translateX(4px);
        }

        .transaction-item.credit {
          border-left-color: #00b894;
        }

        .transaction-item.debit {
          border-left-color: #d63031;
        }

        .transaction-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .transaction-icon.credit {
          background: linear-gradient(135deg, #00b894, #00cec9);
          color: white;
        }

        .transaction-icon.debit {
          background: linear-gradient(135deg, #d63031, #e17055);
          color: white;
        }

        .transaction-details {
          flex: 1;
        }

        .transaction-description {
          font-size: 15px;
          font-weight: 600;
          color: #2d3436;
          margin-bottom: 4px;
        }

        .transaction-datetime {
          font-size: 13px;
          color: #636e72;
        }

        .transaction-amount {
          font-size: 20px;
          font-weight: 700;
          font-family: 'Segoe UI', monospace;
        }

        .transaction-amount.credit {
          color: #00b894;
        }

        .transaction-amount.debit {
          color: #d63031;
        }

        /* Message vide */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #636e72;
        }

        .empty-state-icon {
          font-size: 64px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-state-text {
          font-size: 16px;
          font-weight: 500;
        }

        /* Alerte sécurité */
        .security-alert {
          background: linear-gradient(135deg, #fdcb6e, #e17055);
          margin: 0 40px 20px 40px;
          padding: 20px 24px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 16px;
          color: white;
          box-shadow: 0 4px 15px rgba(253, 203, 110, 0.3);
        }

        .security-alert-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .security-alert-text {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.5;
        }
      `}</style>

      {/* Header */}
      <div className="bank-header">
        <div className="bank-title">
          <DollarSign size={28} />
          Ma Banque Jeune
        </div>
        <div className="bank-subtitle">Compte Épargne • Alex Martin</div>
      </div>

      {/* Alerte sécurité (si solde bas) */}
      {gameState.money < 200 && (
        <div className="security-alert">
          <div className="security-alert-icon">
            <AlertCircle size={24} />
          </div>
          <div className="security-alert-text">
            ⚠️ <strong>Attention !</strong> Ton solde est faible. Fais attention aux arnaques en ligne pour ne pas perdre plus d'argent !
          </div>
        </div>
      )}

      {/* Section Solde */}
      <div className="balance-section">
        <div className="balance-label">Solde disponible</div>
        <div className="balance-amount-container">
          <div 
            className={`balance-amount ${
              isAnimating 
                ? moneyChange > 0 ? 'positive' : 'negative' 
                : ''
            }`}
          >
            {Math.floor(displayMoney)}
          </div>
          <div className="balance-currency">€</div>
          
          {isAnimating && (
            <div className={`money-change-indicator ${moneyChange > 0 ? 'gain' : 'loss'}`}>
              {moneyChange > 0 ? (
                <>
                  <TrendingUp size={24} />
                  +{moneyChange}€
                </>
              ) : (
                <>
                  <TrendingDown size={24} />
                  {moneyChange}€
                </>
              )}
            </div>
          )}
        </div>

        <div className="balance-bar">
          <div 
            className="balance-bar-fill" 
            style={{ width: `${Math.min((gameState.money / 500) * 100, 100)}%` }}
          />
        </div>
        <div className="balance-info">
          <span>Solde initial : 500€</span>
          <span>
            {gameState.money >= 500 ? (
              <span style={{ color: '#00b894' }}>✓ Au-dessus du départ</span>
            ) : (
              <span style={{ color: '#d63031' }}>
                ⚠ {500 - gameState.money}€ en moins
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Section Historique */}
      <div className="transactions-section">
        <div className="transactions-header">
          <div className="transactions-title">Historique des transactions</div>
          <div className="transactions-count">{transactions.length} transaction(s)</div>
        </div>

        <div className="transactions-list">
          {transactions.length > 0 ? (
            transactions.map(transaction => (
              <div 
                key={transaction.id} 
                className={`transaction-item ${transaction.type}`}
              >
                <div className={`transaction-icon ${transaction.type}`}>
                  {transaction.type === 'credit' ? (
                    <TrendingUp size={24} />
                  ) : (
                    <TrendingDown size={24} />
                  )}
                </div>
                <div className="transaction-details">
                  <div className="transaction-description">
                    {transaction.description}
                  </div>
                  <div className="transaction-datetime">
                    {transaction.date} • {transaction.time}
                  </div>
                </div>
                <div className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'credit' ? '+' : '-'}
                  {Math.abs(transaction.amount)}€
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <div className="empty-state-text">
                Aucune transaction pour le moment
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
