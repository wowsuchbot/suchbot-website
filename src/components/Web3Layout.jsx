import React from 'react';
import Web3Provider from './Web3Provider.jsx';

export default function Web3Layout({ children }) {
  return <Web3Provider>{children}</Web3Provider>;
}

Web3Layout.$$client = true;

