// USDC on Avalanche Mainnet (Circle's official deployment)
export const USDC_CONTRACT_ADDRESS =
  '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E' as `0x${string}`;

// USDT on Avalanche Mainnet
export const USDT_CONTRACT_ADDRESS =
  '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7' as `0x${string}`;

// USDC on Avalanche Fuji Testnet (for development)
export const USDC_FUJI_ADDRESS =
  '0x5425890298aed601595a70AB815c96711a31Bc65' as `0x${string}`;

// Minimal ERC-20 ABI — only the functions we actually call
export const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;
