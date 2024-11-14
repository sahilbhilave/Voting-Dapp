pragma solidity ^0.8.2;

contract Voting {
    struct Candidate {
        uint256 id;
        string name;
        uint256 numberOfVotes;
    }

    Candidate[] public candidates;
    address public owner;

    mapping(address => bool) public voters;
    address[] public listOfVoters;

    bool public electionStarted;

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not authorized to start the election");
        _;
    }

    modifier electionOngoing() {
        require(electionStarted, "No election is currently ongoing");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function startElection(string[] memory _candidates) public onlyOwner {
        require(!electionStarted, "Election is currently ongoing");
        delete candidates;
        resetAllVotersStatus();

        for (uint256 i = 0; i < _candidates.length; i++) {
            candidates.push(Candidate({
                id: i,
                name: _candidates[i],
                numberOfVotes: 0
            }));
        }

        electionStarted = true;
    }

    function endVoting() public onlyOwner electionOngoing {
        electionStarted = false; 
        resetAllVotersStatus();
    }

    function addCandidate(string memory _name) public onlyOwner electionOngoing {
        candidates.push(Candidate({
            id: candidates.length,
            name: _name,
            numberOfVotes: 0
        }));
    }

    function voterStatus(address _voter) public view electionOngoing returns(bool) {
        return voters[_voter];
    }

    function voteTo(uint256 _id) public electionOngoing {
        require(!voterStatus(msg.sender), "You have already voted!");

        candidates[_id].numberOfVotes++;
        voters[msg.sender] = true;
        listOfVoters.push(msg.sender);
    }

    function retrieveVotes() public view returns (Candidate[] memory) {
        return candidates;
    }

    function resetAllVotersStatus() public onlyOwner {
        for (uint256 i = 0; i < listOfVoters.length; i++) {
            voters[listOfVoters[i]] = false;
        }
        delete listOfVoters;
    }

    function removeCandidate(uint256 _id) public onlyOwner {
        require(_id < candidates.length, "Candidate ID does not exist");
        
        candidates[_id] = candidates[candidates.length - 1];
        candidates.pop(); 
    }

    function removeAllCandidates() public onlyOwner {
        delete candidates; 
    }
}
