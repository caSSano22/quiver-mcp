'use client';

import { useEffect, useState } from 'react';

function shortAddress(a) {
  if (!a) return '';
  return a.slice(0, 6) + '…' + a.slice(-4);
}

export function ConnectButton({ onConnect }) {
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    const eth = window.ethereum;
    eth.on?.('accountsChanged', (accs) => {
      const a = accs?.[0] || null;
      setAddress(a);
      onConnect?.(a);
    });
    eth.on?.('chainChanged', (c) => setChainId(parseInt(c, 16)));
    eth.request?.({ method: 'eth_accounts' }).then((accs) => {
      const a = accs?.[0] || null;
      setAddress(a);
      onConnect?.(a);
    });
  }, [onConnect]);

  async function connect() {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('No wallet detected. Install MetaMask / Rabby / Coinbase Wallet.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const a = accs?.[0] || null;
      setAddress(a);
      const chain = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(parseInt(chain, 16));
      onConnect?.(a);
    } catch (e) {
      setError(e?.message || 'connect failed');
    } finally {
      setBusy(false);
    }
  }

  function disconnect() {
    setAddress(null);
    onConnect?.(null);
  }

  async function switchToBase() {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2105' }], // Base mainnet
      });
    } catch (e) {
      // chain not added — try to add
      if (e?.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x2105',
            chainName: 'Base',
            rpcUrls: ['https://mainnet.base.org'],
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            blockExplorerUrls: ['https://basescan.org'],
          }],
        });
      }
    }
  }

  if (address) {
    const onBase = chainId === 8453;
    return (
      <div className="inline-flex items-center gap-2">
        {!onBase && (
          <button
            type="button"
            onClick={switchToBase}
            className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-300/15"
          >
            switch to Base
          </button>
        )}
        <span className="font-mono text-xs text-white/75">{shortAddress(address)}</span>
        <button
          type="button"
          onClick={disconnect}
          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70 hover:bg-white/[0.08]"
        >
          disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={connect}
        disabled={busy}
        className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
      >
        {busy ? 'connecting…' : 'Connect wallet'}
      </button>
      {error && <span className="text-[10px] text-rose-300">{error}</span>}
    </div>
  );
}
