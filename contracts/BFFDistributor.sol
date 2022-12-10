//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

error InvalidAddress();
error InvalidSignature();
error ZeroAmount();
error ExceedAmount();

contract BFFDistributor is 
    Ownable
{
    using SafeERC20Upgradeable for IERC20Upgradeable;

    // BFFToken to be the underlying award
    address public immutable BFFToken;

    mapping (address => mapping (uint256 => uint256)) public claimedAmount;

    // This event is triggered whenever a call to #allocation succeeds.
    event Allocation(uint256 _totalAllocation);
    // This event is triggered whenever a call to #claimTokens succeeds.
    event Claimed(address _claimer, uint256 _amount);
    // This event is triggered whenever a call to #withdrawTokens succeeds.
    event WithdrawFund(address _to, uint256 _amount);

    /** 
     * @param _token Address of reward token
     */
    constructor(address _token) {
        if (_token == address(0)) {
            revert InvalidAddress();
        }
        BFFToken = _token;
    }

    /** 
     * @dev Transfer weekly allocation reward
     * @param _totalAllocation Amount of weekly reward
     */
    function allocation(
        uint256 _totalAllocation
    )
        external
        onlyOwner
    {
        IERC20Upgradeable(BFFToken).safeTransferFrom(msg.sender, address(this), _totalAllocation);
        emit Allocation(_totalAllocation);
    }

    /**
     * @dev Check whether an address is able to claim
     * @param _claimer Address of the claiming user
     * @param _batch Timestamp to seperate different reward allocation
     * @param _maxClaimable Maximum Quantity of tokens that an address can claim
     * @param _signature Signature used to verify the address is able to claim
     */
    function verify(
        address _claimer,
        uint256 _batch,
        uint256 _maxClaimable,
        bytes calldata _signature
    ) 
        public
        view
        returns(bool _whitelisted)
    {
        bytes32 hash = ECDSA.toEthSignedMessageHash(
            keccak256(
                abi.encodePacked(_claimer, _batch, _maxClaimable)
            )
        );

        return owner() == ECDSA.recover(hash, _signature);
    }

    /** 
     * @dev Distribute amount of reward token to the claimer address
     * @param _amount Amount the address can claim
     * @param _signature Merkle proof used to verify the claimer address and amount of reward token
     */
    function claimTokens(
        uint256 _batch,
        uint256 _amount,
        uint256 _maxClaimable,
        bytes calldata _signature
    )
        external
    {
        if (_amount == 0) {
            revert ZeroAmount();
        }

        if (!verify(msg.sender, _batch, _maxClaimable, _signature)) {
            revert InvalidSignature();
        }

        if (claimedAmount[msg.sender][_batch] + _amount > _maxClaimable) {
            revert ExceedAmount();
        }

        claimedAmount[msg.sender][_batch] += _amount;

        IERC20Upgradeable(BFFToken).safeTransfer(msg.sender, _amount);
        emit Claimed(msg.sender, _amount);
    }

    /** 
     * @dev Withdraw remaining reward in the distributor contract
     * @param _to Address to transfer the reward token in the distributor contract
     * @param _amount Amount of reward token to withdraw
     */
    function withdrawTokens(
        address _to, 
        uint256 _amount
    ) 
        external
        onlyOwner
    {
        IERC20Upgradeable(BFFToken).safeTransfer(_to, _amount);
        emit WithdrawFund(_to, _amount);
    }
}