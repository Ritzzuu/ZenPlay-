// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/// --- Governance Token ---
contract ZenPlayToken is ERC20, ERC20Votes {
    constructor() ERC20("ZenPlay Token", "ZPT") ERC20Votes() {
        _mint(msg.sender, 1000000 * 10 ** decimals()); // 1M supply
    }

    // Required overrides
    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }
    function _mint(address to, uint256 amount)
        internal override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }
    function _burn(address account, uint256 amount)
        internal override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}

/// --- DAO Governance ---
contract ZenPlayDAO is Governor, GovernorCountingSimple {
    ZenPlayToken public token;
    mapping(address => uint256) public activityPoints;

    constructor(ERC20Votes _token)
        Governor("ZenPlayDAO")
    {
        token = ZenPlayToken(address(_token));
    }

    // Voting params
    function votingDelay() public pure override returns (uint256) {
        return 1; // 1 block
    }
    function votingPeriod() public pure override returns (uint256) {
        return 45818; // ~1 week
    }
    function quorum(uint256 blockNumber) public pure override returns (uint256) {
        return 100e18; // 100 tokens required
    }

    // Override voting power
    function getVotes(address account, uint256 blockNumber)
        public view override returns (uint256)
    {
        return token.getPastVotes(account, blockNumber);
    }

    // Gamification: reward points for voting
    function castVote(uint256 proposalId, uint8 support)
        public override returns (uint256)
    {
        uint256 weight = super.castVote(proposalId, support);
        activityPoints[msg.sender] += 10; // +10 XP for every vote
        return weight;
    }

    // Function to claim reward (simple example: 100 points = mint token)
    function claimReward() external {
        require(activityPoints[msg.sender] >= 100, "Not enough points");
        activityPoints[msg.sender] -= 100;
        token.mint(msg.sender, 50 * 10 ** 18); // reward 50 ZPT
    }
}
