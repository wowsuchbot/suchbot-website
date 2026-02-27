import React from 'react';
import Web3Provider from './Web3Provider.jsx';
import { ConnectWallet } from './ConnectWallet.jsx';
import TipButton from './TipButton.jsx';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  walletSection: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  tipSection: {
    marginTop: '0.5rem',
  },
};

export default function WalletAndTip({ showConnect = true, showTip = true }) {
  return (
    <Web3Provider>
      <div style={styles.container}>
        {showConnect && (
          <div style={styles.walletSection}>
            <ConnectWallet />
          </div>
        )}
        {showTip && (
          <div style={styles.tipSection}>
            <TipButton />
          </div>
        )}
      </div>
    </Web3Provider>
  );
}
