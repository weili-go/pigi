pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

/* External Imports */
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

/* Internal Imports */
import { CommitmentChain } from "./CommitmentChain.sol";
import { Deposit } from "./Deposit.sol";

contract Aggregator {
  address public authenticationAddress;
  CommitmentChain public commitmentChain;
  mapping(address => Deposit) public depositContracts;
  uint public id;
  mapping(bytes32 => string) public metadata;

  constructor(address _authenticationAddress, uint _id) public {
    authenticationAddress = _authenticationAddress;
    commitmentChain = CommitmentChain(_authenticationAddress);
    id = _id;
  }

  function addDepositContract(ERC20 _erc20) public returns (Deposit newDeposit) {
    require(msg.sender == authenticationAddress, "addDepositContract can only be called by authenticated address.");
    Deposit d = new Deposit(address(_erc20), address(commitmentChain));
    depositContracts[address(_erc20)] = d;
    return d;
  }

  function setMetadata(bytes32 _ip, string memory data) public {
    require(msg.sender == authenticationAddress, "setMetadata can only be called by authenticated address.");
    metadata[_ip] = data;
  }

  function deleteMetadata(bytes32 _ip) public {
    require(msg.sender == authenticationAddress, "deleteMetadata can only be called by authenticated address.");
    delete metadata[_ip];
  }
}