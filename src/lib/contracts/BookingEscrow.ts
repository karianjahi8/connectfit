// BookingEscrow ABI - Smart contract for booking payments and escrow
// Deploy this contract via Hardhat to Avalanche Fuji/Mainnet

export const BOOKING_ESCROW_ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_platformWallet', type: 'address' },
      { internalType: 'uint256', name: '_platformFeePercent', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'bookingId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'client', type: 'address' },
      { indexed: true, internalType: 'address', name: 'trainer', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'sessionTime', type: 'uint256' },
    ],
    name: 'BookingCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'bookingId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'trainerPayout', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'platformFee', type: 'uint256' },
    ],
    name: 'BookingCompleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'bookingId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'refundAmount', type: 'uint256' },
    ],
    name: 'BookingCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'bookingId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'client', type: 'address' },
      { indexed: false, internalType: 'uint8', name: 'rating', type: 'uint8' },
      { indexed: false, internalType: 'string', name: 'reviewHash', type: 'string' },
    ],
    name: 'ReviewSubmitted',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: '_trainer', type: 'address' },
      { internalType: 'uint256', name: '_sessionTime', type: 'uint256' },
      { internalType: 'string', name: '_sessionType', type: 'string' },
    ],
    name: 'createBooking',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_bookingId', type: 'uint256' }],
    name: 'completeSession',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_bookingId', type: 'uint256' }],
    name: 'cancelBooking',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_bookingId', type: 'uint256' },
      { internalType: 'uint8', name: '_rating', type: 'uint8' },
      { internalType: 'string', name: '_reviewHash', type: 'string' },
    ],
    name: 'submitReview',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_bookingId', type: 'uint256' }],
    name: 'getBooking',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'address', name: 'client', type: 'address' },
          { internalType: 'address', name: 'trainer', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint256', name: 'sessionTime', type: 'uint256' },
          { internalType: 'string', name: 'sessionType', type: 'string' },
          { internalType: 'uint8', name: 'status', type: 'uint8' },
          { internalType: 'uint8', name: 'rating', type: 'uint8' },
          { internalType: 'string', name: 'reviewHash', type: 'string' },
        ],
        internalType: 'struct BookingEscrow.Booking',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_trainer', type: 'address' }],
    name: 'getTrainerStats',
    outputs: [
      { internalType: 'uint256', name: 'totalBookings', type: 'uint256' },
      { internalType: 'uint256', name: 'completedSessions', type: 'uint256' },
      { internalType: 'uint256', name: 'totalEarnings', type: 'uint256' },
      { internalType: 'uint256', name: 'averageRating', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'bookingCounter',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'platformFeePercent',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Solidity source code for reference - deploy via Hardhat
export const BOOKING_ESCROW_SOURCE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BookingEscrow is ReentrancyGuard, Ownable {
    enum BookingStatus { Pending, Confirmed, Completed, Cancelled, Disputed }
    
    struct Booking {
        uint256 id;
        address client;
        address trainer;
        uint256 amount;
        uint256 sessionTime;
        string sessionType; // "virtual" or "in-person"
        BookingStatus status;
        uint8 rating;
        string reviewHash; // IPFS hash
    }
    
    struct TrainerStats {
        uint256 totalBookings;
        uint256 completedSessions;
        uint256 totalEarnings;
        uint256 totalRatingPoints;
        uint256 ratingCount;
    }
    
    uint256 public bookingCounter;
    uint256 public platformFeePercent;
    address public platformWallet;
    
    mapping(uint256 => Booking) public bookings;
    mapping(address => TrainerStats) public trainerStats;
    mapping(address => uint256[]) public clientBookings;
    mapping(address => uint256[]) public trainerBookings;
    
    event BookingCreated(uint256 indexed bookingId, address indexed client, address indexed trainer, uint256 amount, uint256 sessionTime);
    event BookingCompleted(uint256 indexed bookingId, uint256 trainerPayout, uint256 platformFee);
    event BookingCancelled(uint256 indexed bookingId, uint256 refundAmount);
    event ReviewSubmitted(uint256 indexed bookingId, address indexed client, uint8 rating, string reviewHash);
    
    constructor(address _platformWallet, uint256 _platformFeePercent) Ownable(msg.sender) {
        require(_platformFeePercent <= 30, "Fee too high");
        platformWallet = _platformWallet;
        platformFeePercent = _platformFeePercent;
    }
    
    function createBooking(
        address _trainer,
        uint256 _sessionTime,
        string calldata _sessionType
    ) external payable nonReentrant returns (uint256) {
        require(msg.value > 0, "Payment required");
        require(_trainer != address(0) && _trainer != msg.sender, "Invalid trainer");
        require(_sessionTime > block.timestamp, "Invalid session time");
        
        bookingCounter++;
        
        bookings[bookingCounter] = Booking({
            id: bookingCounter,
            client: msg.sender,
            trainer: _trainer,
            amount: msg.value,
            sessionTime: _sessionTime,
            sessionType: _sessionType,
            status: BookingStatus.Pending,
            rating: 0,
            reviewHash: ""
        });
        
        clientBookings[msg.sender].push(bookingCounter);
        trainerBookings[_trainer].push(bookingCounter);
        trainerStats[_trainer].totalBookings++;
        
        emit BookingCreated(bookingCounter, msg.sender, _trainer, msg.value, _sessionTime);
        
        return bookingCounter;
    }
    
    function completeSession(uint256 _bookingId) external nonReentrant {
        Booking storage booking = bookings[_bookingId];
        require(booking.id != 0, "Booking not found");
        require(booking.client == msg.sender || booking.trainer == msg.sender, "Not authorized");
        require(booking.status == BookingStatus.Pending || booking.status == BookingStatus.Confirmed, "Invalid status");
        
        booking.status = BookingStatus.Completed;
        
        uint256 platformFee = (booking.amount * platformFeePercent) / 100;
        uint256 trainerPayout = booking.amount - platformFee;
        
        trainerStats[booking.trainer].completedSessions++;
        trainerStats[booking.trainer].totalEarnings += trainerPayout;
        
        (bool successTrainer, ) = payable(booking.trainer).call{value: trainerPayout}("");
        require(successTrainer, "Trainer transfer failed");
        
        (bool successPlatform, ) = payable(platformWallet).call{value: platformFee}("");
        require(successPlatform, "Platform transfer failed");
        
        emit BookingCompleted(_bookingId, trainerPayout, platformFee);
    }
    
    function cancelBooking(uint256 _bookingId) external nonReentrant {
        Booking storage booking = bookings[_bookingId];
        require(booking.id != 0, "Booking not found");
        require(booking.client == msg.sender || booking.trainer == msg.sender, "Not authorized");
        require(booking.status == BookingStatus.Pending, "Cannot cancel");
        
        booking.status = BookingStatus.Cancelled;
        
        uint256 refundAmount = booking.amount;
        // Apply cancellation fee if within 24 hours
        if (block.timestamp >= booking.sessionTime - 24 hours) {
            uint256 cancellationFee = (booking.amount * 10) / 100;
            refundAmount = booking.amount - cancellationFee;
            (bool successPlatform, ) = payable(platformWallet).call{value: cancellationFee}("");
            require(successPlatform, "Platform transfer failed");
        }
        
        (bool successClient, ) = payable(booking.client).call{value: refundAmount}("");
        require(successClient, "Refund failed");
        
        emit BookingCancelled(_bookingId, refundAmount);
    }
    
    function submitReview(uint256 _bookingId, uint8 _rating, string calldata _reviewHash) external {
        Booking storage booking = bookings[_bookingId];
        require(booking.id != 0, "Booking not found");
        require(booking.client == msg.sender, "Only client can review");
        require(booking.status == BookingStatus.Completed, "Session not completed");
        require(booking.rating == 0, "Already reviewed");
        require(_rating >= 1 && _rating <= 5, "Invalid rating");
        
        booking.rating = _rating;
        booking.reviewHash = _reviewHash;
        
        trainerStats[booking.trainer].totalRatingPoints += _rating;
        trainerStats[booking.trainer].ratingCount++;
        
        emit ReviewSubmitted(_bookingId, msg.sender, _rating, _reviewHash);
    }
    
    function getBooking(uint256 _bookingId) external view returns (Booking memory) {
        return bookings[_bookingId];
    }
    
    function getTrainerStats(address _trainer) external view returns (
        uint256 totalBookings,
        uint256 completedSessions,
        uint256 totalEarnings,
        uint256 averageRating
    ) {
        TrainerStats memory stats = trainerStats[_trainer];
        uint256 avgRating = stats.ratingCount > 0 
            ? (stats.totalRatingPoints * 100) / stats.ratingCount 
            : 0;
        return (stats.totalBookings, stats.completedSessions, stats.totalEarnings, avgRating);
    }
}
`;
