const connectWalletMsg = document.querySelector('#connectWalletMessage');
const connectWalletBtn = document.querySelector('#connectWallet');
const votingStation = document.querySelector('#votingStation');
const timerTime = document.querySelector('#time');
const timerMessage = document.querySelector('#timerMessage');
const mainBoard = document.querySelector('#mainBoard');
const voteForm = document.querySelector('#voteForm');
const vote = document.querySelector('#vote');
const voteBtn = document.querySelector('#sendVote');
const showResultContainer = document.querySelector('#showResultContainer');
const showResult = document.querySelector('#showResult');
const result = document.querySelector('#result');
const admin = document.querySelector('#admin');
const candidates = document.querySelector('#candidates');
const startAnElection = document.getElementById('startAnElection');
const candidate = document.querySelector('#candidate');
const addTheCandidate = document.getElementById('addTheCandidate');
const removeCandidateBtn = document.getElementById('removeCandidate');
const removeAllCandidatesBtn = document.getElementById('removeAllCandidates');
const refreshBtn = document.getElementById('refreshBtn');

// Configuring Ethers
const contractAddress = '0x4eF62513a98dD792666c050f176c06345Aa6Db1c';
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "numberOfVotes",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "electionStarted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "endVoting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "listOfVoters",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "removeAllCandidates",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "removeCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "resetAllVotersStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "retrieveVotes",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "numberOfVotes",
            "type": "uint256"
          }
        ],
        "internalType": "struct Voting.Candidate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "_candidates",
        "type": "string[]"
      }
    ],
    "name": "startElection",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "voteTo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_voter",
        "type": "address"
      }
    ],
    "name": "voterStatus",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "voters",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];


let contract;
let signer;

const provider = new ethers.providers.Web3Provider(window.ethereum); // Use window.ethereum

async function connectWallet() {
    try {
        await provider.send("eth_requestAccounts", []);
        const accounts = await provider.listAccounts();

        if (accounts.length > 0) {
            signer = provider.getSigner(accounts[0]);
            contract = new ethers.Contract(contractAddress, contractABI, signer);

            connectWalletBtn.textContent = `${accounts[0].slice(0, 10)}...`;
            connectWalletBtn.disabled = true;

            checkIfAdmin();
        } else {
            console.error("No accounts found.");
        }
    } catch (error) {
        console.error("Error connecting to wallet:", error);
    }
}

connectWalletBtn.addEventListener('click', connectWallet);

const getAllCandidates = async function() {
    const candidateBoard = document.getElementById("candidateBoard");
    if (candidateBoard) {
        candidateBoard.remove();
    }

    const board = document.createElement("table");
    board.classList.add("min-w-full", "border", "border-gray-300", "text-left");
    board.id = "candidateBoard";
    mainBoard.appendChild(board);

    const tableHeader = document.createElement("tr");
    tableHeader.classList.add("bg-gray-200");
    tableHeader.innerHTML = `<th class="border px-4 py-2">ID No.</th><th class="border px-4 py-2">Candidate</th>`;
    board.appendChild(tableHeader);

    const candidatesList = await contract.retrieveVotes();
    candidatesList.forEach(candidate => {
        const row = document.createElement("tr");
        row.innerHTML = `<td class="border px-4 py-2">${parseInt(candidate[0])}</td><td class="border px-4 py-2">${candidate[1]}</td>`;
        board.appendChild(row);
    });
};

const getResult = async function() {
    const resultBoard = document.getElementById('resultBoard');
    if (!contract) {
      console.error("Contract is not initialized. Please connect the wallet.");
      return;
  }

  const isElectionStarted = await contract.electionStarted();
  if (isElectionStarted) {
      alert('Election is ongoing, wait for it to end!!');
      return;
  }
    
    if (resultBoard) {
        resultBoard.remove();
    }

    const newResultBoard = document.createElement("table");
    newResultBoard.classList.add("min-w-full", "border", "border-gray-300", "text-left");
    newResultBoard.id = "resultBoard";
    result.appendChild(newResultBoard);

    const tableHeader = document.createElement("tr");
    tableHeader.classList.add("bg-gray-200");
    tableHeader.innerHTML = `<th class="border px-4 py-2">ID No.</th><th>Candidate</th><th class="border px-4 py-2">Number of Votes</th>`;
    newResultBoard.appendChild(tableHeader);

    const candidatesList = await contract.retrieveVotes();
    candidatesList.forEach(candidate => {
        const row = document.createElement("tr");
        row.innerHTML = `<td class="border px-4 py-2">${parseInt(candidate[0])}</td><td class="border px-4 py-2">${candidate[1]}</td><td class="border px-4 py-2">${parseInt(candidate[2])}</td>`;
        newResultBoard.appendChild(row); 
    });
};

const refreshPage = async function() {
    const isElectionStarted = await contract.electionStarted();
    if (isElectionStarted) {
        showResultContainer.style.display = 'block';
    } else {
        //timerMessage.textContent = "No election is ongoing.";
        showResultContainer.style.display = 'block';
    }

    getAllCandidates();
    //getResult();
};

const sendVote = async function() {
    try {
        await contract.voteTo(vote.value);
        vote.value = "";
        alert("Vote submitted successfully!");
    } catch (error) {
        console.log(error);
        if (error.message.includes("voted")){
          alert("You Have Already Voted!!");
          voteForm.style.display = 'none';
        }
        else if (error.message.includes("No election")){
          alert("Voting has ended!");
          voteForm.style.display = 'none';
        }
        else if(error.message.includes("out-of-bounds"))
        {
          alert("No Candidate with that ID!");
        }
        else
        {
          alert("Cannot Vote!");
        }
        //voteForm.style.display = 'none';
    }
};

const startElection = async () => {
    try {
        if (!contract) {
            console.error("Contract is not initialized. Please connect the wallet.");
            return;
        }

        const isElectionStarted = await contract.electionStarted();
        if (isElectionStarted) {
            alert('An election is currently ongoing. Please wait for it to end before starting a new one.');
            return;
        }

        if (!candidates.value) {
            alert('Please provide candidates');
            return;
        }

        const _candidates = candidates.value.split(",");

        const tx = await contract.startElection(_candidates);
        await tx.wait();

        // Reset input fields
        candidates.value = "";
        showResultContainer.style.display = "none";
        refreshPage(); // Refresh candidates and results
    } catch (error) {
        console.error("Error starting election:", error);
        if (error.message.includes("execution reverted")) {
            alert("Failed to start election. Check if an election is already ongoing.");
        }
    }
};

const addCandidate = async function() {
    try {
        if (!candidate.value) {
            alert('Please provide the candidate name first');
            return;
        }
        await contract.addCandidate(candidate.value);
        refreshPage();
        candidate.value = "";
    } catch (error) {
      if (error.message.includes("authorized")) {
        alert("You are not authorized to add candidate!");
      }
      else
      {
        alert("There was a problem!");
      }
    }
};

const checkIfAdmin = async function() {
  if (!contract) {
      console.error("Contract is not initialized. Please connect the wallet.");
      return;
  }

  try {
      const owner = await contract.owner(); // Fetch the owner of the contract
      const currentAccount = await signer.getAddress(); // Get the currently connected account

      console.log("Contract owner:", owner); // Debugging line
      console.log("Current account:", currentAccount); // Debugging line

      if (owner.toLowerCase() === currentAccount.toLowerCase()) {
          console.log("User is the original owner/admin");
          admin.style.display = "block"; // Show admin controls
      } else {
          console.log("User is not the original owner/admin");
          admin.style.display = "none"; // Hide admin controls
      }

      await refreshPage(); // Call refreshPage to update candidates and results
  } catch (error) {
      console.error("Error checking admin status:", error);
  }
};


const removeCandidate = async function() {
    const candidateId = document.getElementById('candidateIdToRemove').value;
    if (!candidateId) {
        alert('Please enter a candidate ID');
        return;
    }

    try {
        await contract.removeCandidate(parseInt(candidateId, 10));
        alert('Candidate removed successfully!');
        refreshPage();
    } catch (error) {
        console.error('Error removing candidate:', error);
    }
};

const removeAllCandidates = async function() {
    try {
        await contract.removeAllCandidates();
        alert('All candidates removed successfully!');
        refreshPage();
    } catch (error) {
        console.error('Error removing all candidates:', error);
    }
};

const endElection = async () => {
    try {
        await contract.endVoting();
        alert('Voting ended successfully!');
        refreshPage();
    } catch (error) {
        console.error('Error ending voting:', error);
        if (error.message.includes("authorized")) {
          alert("You are not authorized to end voting!");
        }
        else
        {
          alert("There was a problem!");
        }
    }
};

connectWalletBtn.addEventListener('click', async () => {
    await connectWallet();
    if (contract) {
        addTheCandidate.addEventListener('click', addCandidate);
        startAnElection.addEventListener('click', startElection);
        refreshBtn.addEventListener('click', refreshPage);
        // Add the end election button listener
        document.getElementById('endElection').addEventListener('click', endElection);
    }
});

// Event listeners
removeCandidateBtn.addEventListener('click', removeCandidate);
removeAllCandidatesBtn.addEventListener('click', removeAllCandidates);
showResult.addEventListener('click', getResult);
voteBtn.addEventListener('click', sendVote);