// TrainerRegistry ABI - Smart contract for trainer verification
// Deploy this contract via Hardhat to Avalanche Fuji/Mainnet

export const TRAINER_REGISTRY_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'trainer', type: 'address' },
      { indexed: false, internalType: 'string', name: 'certificationHash', type: 'string' },
    ],
    name: 'VerificationRequested',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'trainer', type: 'address' },
      { indexed: true, internalType: 'address', name: 'verifier', type: 'address' },
    ],
    name: 'TrainerVerified',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'trainer', type: 'address' },
    ],
    name: 'TrainerRevoked',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'string', name: '_certificationHash', type: 'string' }],
    name: 'requestVerification',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_trainer', type: 'address' }],
    name: 'verifyTrainer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_trainer', type: 'address' }],
    name: 'revokeTrainer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_trainer', type: 'address' }],
    name: 'isVerified',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_trainer', type: 'address' }],
    name: 'getTrainerInfo',
    outputs: [
      { internalType: 'bool', name: 'verified', type: 'bool' },
      { internalType: 'string', name: 'certificationHash', type: 'string' },
      { internalType: 'uint256', name: 'verifiedAt', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_verifier', type: 'address' }],
    name: 'addVerifier',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_verifier', type: 'address' }],
    name: 'removeVerifier',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

// Solidity source code for reference - deploy via Hardhat
export const TRAINER_REGISTRY_SOURCE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract TrainerRegistry is AccessControl {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    
    struct TrainerInfo {
        bool verified;
        bool pendingVerification;
        string certificationHash; // IPFS hash of certification docs
        uint256 verifiedAt;
        address verifiedBy;
    }
    
    mapping(address => TrainerInfo) public trainers;
    address[] public verifiedTrainers;
    
    event VerificationRequested(address indexed trainer, string certificationHash);
    event TrainerVerified(address indexed trainer, address indexed verifier);
    event TrainerRevoked(address indexed trainer);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }
    
    function requestVerification(string calldata _certificationHash) external {
        require(bytes(_certificationHash).length > 0, "Certification required");
        require(!trainers[msg.sender].verified, "Already verified");
        
        trainers[msg.sender] = TrainerInfo({
            verified: false,
            pendingVerification: true,
            certificationHash: _certificationHash,
            verifiedAt: 0,
            verifiedBy: address(0)
        });
        
        emit VerificationRequested(msg.sender, _certificationHash);
    }
    
    function verifyTrainer(address _trainer) external onlyRole(VERIFIER_ROLE) {
        require(trainers[_trainer].pendingVerification, "No pending request");
        
        trainers[_trainer].verified = true;
        trainers[_trainer].pendingVerification = false;
        trainers[_trainer].verifiedAt = block.timestamp;
        trainers[_trainer].verifiedBy = msg.sender;
        
        verifiedTrainers.push(_trainer);
        
        emit TrainerVerified(_trainer, msg.sender);
    }
    
    function revokeTrainer(address _trainer) external onlyRole(VERIFIER_ROLE) {
        require(trainers[_trainer].verified, "Not verified");
        
        trainers[_trainer].verified = false;
        
        // Remove from verified list
        for (uint i = 0; i < verifiedTrainers.length; i++) {
            if (verifiedTrainers[i] == _trainer) {
                verifiedTrainers[i] = verifiedTrainers[verifiedTrainers.length - 1];
                verifiedTrainers.pop();
                break;
            }
        }
        
        emit TrainerRevoked(_trainer);
    }
    
    function isVerified(address _trainer) external view returns (bool) {
        return trainers[_trainer].verified;
    }
    
    function getTrainerInfo(address _trainer) external view returns (
        bool verified,
        string memory certificationHash,
        uint256 verifiedAt
    ) {
        TrainerInfo memory info = trainers[_trainer];
        return (info.verified, info.certificationHash, info.verifiedAt);
    }
    
    function getVerifiedTrainersCount() external view returns (uint256) {
        return verifiedTrainers.length;
    }
    
    function addVerifier(address _verifier) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(VERIFIER_ROLE, _verifier);
    }
    
    function removeVerifier(address _verifier) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(VERIFIER_ROLE, _verifier);
    }
}
`;
