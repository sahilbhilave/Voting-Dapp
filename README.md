# Tech Stack: Ethereum, Solidity, Ethers.js, TailwindCSS, MetaMask

Developed a decentralized voting application (DApp) on the Ethereum blockchain to enable secure and transparent elections. The application allows users to connect their MetaMask wallet, vote for candidates, and view results in real time. Key features include:

<ul>
<li><b>Smart Contract</b>: Written in Solidity to manage election logic, including starting and ending elections, adding/removing candidates, and ensuring secure voting with access control.</li>
<li><b>Frontend</b>: Built with HTML, JavaScript (Ethers.js), and styled with TailwindCSS, providing an intuitive interface for both voters and admins.</li>
<li><b>Admin Controls</b>: Admins can manage candidates, start/end elections, and view voting results.</li>
<li><b>Blockchain Integration</b>: Utilized Ethers.js to interact with the Ethereum blockchain for wallet connection, voting transactions, and state changes.</li>
<li><b>MetaMask Integration</b>: Users can connect their MetaMask wallet for secure and anonymous voting.</li>
</ul>
This is a url with no SSL, i created this url for my IOT project
Website URL : http://watertank.mooo.com/Voting/



# Run the project
The solidity has been deployed on https://amoy.polygonscan.com/address/0x4eF62513a98dD792666c050f176c06345Aa6Db1c
Deployed on the Polygon Amoy Testnet

To Deploy the project
```shell
npx hardhat run scripts/deploy.js --network amoy
```
