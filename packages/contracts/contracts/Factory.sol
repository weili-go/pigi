pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

/* External Imports */
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

/* Internal Imports */
import {CommitmentChain} from "./CommitmentChain.sol";
import {Deposit} from "./Deposit.sol";

contract AggregatorWithIPCreationProxy {
  constructor(PlasmaRegistry _plasmaRegistry, address _authenticationAddress, string _ip) {
    // Create new PlasmaRegistry if it doesn't exist
    PlasmaRegistry pr = _plasmaRegistry;
    if (pr == 0) {
      pr = new PlasmaRegistry();
    }
    Aggregator newAggregator = pr.newAggregator(_authenticationAddress);
    newAggregator.setMetadata("ip", _ip);
    selfdestruct(this);
  }
}

contract PlasmaRegistry {
  address[] public aggregators;
  address[] public contracts;

  // Deploy a new aggregator
  function newAggregator(address _authenticationAddress) public returns(address newAggregator) {
    uint id = getAggregatorCount() + 1;
    Aggregator a = new Aggregator(id, _authenticationAddress);
    aggregators.push(a);
    return a;
  }

  // Get length of aggregators
  function getAggregatorCount() public returns(uint aggregatorCount) {
    return aggregators.length;
  }
}

contract Aggregator {
  address public authenticationAddress;
  CommitmentChain public commitmentChain;
  mapping(address => Deposit) public depositContracts;
  uint public id;
  mapping(bytes32 => string) public metadata;

  constructor(address _authenticationAddress, uint _id) public {
    authenticationAddress = _authenticationAddress;
    commitmentChain = new CommitmentChain(_authenticationAddress);
    id = _id;
  }

  function addCommitmentContract(address _erc20, address _commitmentChain) public returns (deposit newDeposit) {
    Deposit d = new Deposit(_erc20, _commitmentChain);
    depositContracts.push(d);
    return d;
  }

  function addDepositContract(ERC20 _erc20) public returns (deposit newDeposit) {
    require(msg.sender == authenticationAddress, "addDepositContract can only be called by authenticated address.");
    Deposit d = new Deposit(_erc20, commitmentChain);
    depositContracts[_erc20] = d;
    return d;
  }

  function setMetadata(bytes32 _ip, string _value) public {
    require(msg.sender == authenticationAddress, "setMetadata can only be called by authenticated address.");
    metadata[_ip] = _value;
  }

  function deleteMetadata(bytes32 _ip) public {
    require(msg.sender == authenticationAddress, "deleteMetadata can only be called by authenticated address.");
    delete metadata[_ip];
  }
}