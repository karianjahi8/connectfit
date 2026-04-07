import { getContract, defineChain } from 'thirdweb';
import { thirdwebClient } from './thirdwebClient';
import { CONTRACTS, areContractsDeployed } from './wagmiConfig';
import { BOOKING_ESCROW_ABI } from '../contracts/BookingEscrow';
import { TRAINER_REGISTRY_ABI } from '../contracts/TrainerRegistry';

// Avalanche chains for thirdweb
export const avalancheChain = defineChain(43114);
export const avalancheFujiChain = defineChain(43113);

/**
 * Get the BookingEscrow contract instance.
 * Returns null if contracts aren't deployed yet.
 */
export function getBookingEscrowContract(network: 'fuji' | 'mainnet' = 'fuji') {
  if (!areContractsDeployed(network)) return null;

  return getContract({
    client: thirdwebClient,
    chain: network === 'mainnet' ? avalancheChain : avalancheFujiChain,
    address: CONTRACTS[network].bookingEscrow,
    abi: BOOKING_ESCROW_ABI as any,
  });
}

/**
 * Get the TrainerRegistry contract instance.
 * Returns null if contracts aren't deployed yet.
 */
export function getTrainerRegistryContract(network: 'fuji' | 'mainnet' = 'fuji') {
  if (!areContractsDeployed(network)) return null;

  return getContract({
    client: thirdwebClient,
    chain: network === 'mainnet' ? avalancheChain : avalancheFujiChain,
    address: CONTRACTS[network].trainerRegistry,
    abi: TRAINER_REGISTRY_ABI as any,
  });
}
