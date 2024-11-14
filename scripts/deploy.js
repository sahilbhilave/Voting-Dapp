const hre = require("hardhat");

async function main()
{
    const votingContract = await hre.ethers.getContractFactory("Voting");
    const deployedVotingContract = await votingContract.deploy();

    console.log(`Contract address deployed : ${deployedVotingContract.target}`);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
//Old Address : 0x592232E34731B6356877bfb69C3Ff4639436c472
//Address Deployed : 0x196Ac1899E2Fe2834FB19B1E51f4C7Cd14758979

//New Deployment : 0x4eF62513a98dD792666c050f176c06345Aa6Db1c

// https://amoy.polygonscan.com/address/0x4eF62513a98dD792666c050f176c06345Aa6Db1c#code

//Command npx hardhat run scripts/deploy.js --network amoy


/*

Compiler Version: v0.8.27+commit.40a35a09
Optimization Enabled: 0
Runs: 200

*/