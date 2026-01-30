// USDC Token ABI - Standard ERC20 methods
// USDC on Avalanche C-Chain

export const USDC_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'sender', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
] as const;

// USDC Contract Addresses on Avalanche
export const USDC_ADDRESSES = {
  // Avalanche Mainnet - Official Circle USDC
  mainnet: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
  // Avalanche Fuji Testnet - Test USDC (you may need to deploy a mock)
  fuji: '0x5425890298aed601595a70AB815c96711a31Bc65',
} as const;

// USDC has 6 decimals (not 18 like most tokens)
export const USDC_DECIMALS = 6;

export function parseUSDC(amount: number): bigint {
  return BigInt(Math.floor(amount * 10 ** USDC_DECIMALS));
}

export function formatUSDC(amount: bigint): number {
  return Number(amount) / 10 ** USDC_DECIMALS;
}
