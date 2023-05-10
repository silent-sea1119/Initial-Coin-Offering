//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

contract ICO {

    address public owner;
    uint public totalToken = 5000;
    uint public priceToken = 0.001 * 10**18;

    uint public totalMoney = 0;
    uint public startTime = 1683586800;
    uint public endTime = 1683626400;
    uint public softCap = 0.1 * 10**18;
    uint public hardCap = 2 * 10**18;
    uint public minPurchase = 0.001 * 10**18;
    uint public maxPurchase = 0.5 * 10**18;
    // bool public withDraw = false;
    mapping(address => uint) public deposits;
    mapping(address => uint) public balances;

    event Deposit(address indexed investor, uint amount);
    event Withdraw(address indexed investor, uint amount);
    event Claim(address indexed investor, uint amount);
    
    constructor(){
        owner = msg.sender;
        balances[owner] = totalToken;
    }

    // modifier onlyOwner() {
    //     require(msg.sender == owner, "Only contract owner can call this function.");
    //     _;
    // }

    modifier onlyDuringICO() {
        require(block.timestamp >= startTime, "ICO has not yet started.");
        require(block.timestamp <= endTime, "ICO has ended.");
        _;
    }

    function deposit() public payable onlyDuringICO {
        require(msg.value >= minPurchase, "Deposit amount is below minimum.");
        require(msg.value <= maxPurchase, "Deposit amount is above maximum.");
        require((msg.value) + totalMoney <= hardCap, "Deposit amount exceeds hard cap.");

        deposits[msg.sender] += msg.value;
        totalMoney += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw() public payable {
        require(block.timestamp > endTime, "Withdrawals not allowed at this time.");
        require(deposits[msg.sender] > 0, "You don't haven't ever deposited.");
        require(totalMoney < softCap, "This is successful beal.");

        uint amount = deposits[msg.sender];
        totalMoney -= amount;
        deposits[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }

    function claim() public payable {
        require(block.timestamp > endTime, "Claims not allowed at this time.");
        require(deposits[msg.sender] > 0, "You don't haven't ever deposited.");
        require(totalMoney >= softCap, "This is successful beal.");

        uint amount = deposits[msg.sender] / priceToken;
        payable(owner).transfer(deposits[msg.sender]);
        deposits[msg.sender] = 0;
        balances[msg.sender] += amount;
        balances[owner] -= amount;
        emit Claim(msg.sender, amount);
    }

    function myDeposit() external view returns (uint) {
        return deposits[msg.sender];
    }
}