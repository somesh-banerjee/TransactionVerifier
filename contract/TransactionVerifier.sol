pragma solidity 0.8.7;

contract TransactionVerifier{
    struct cTransaction{
        address from;
        address to;
        uint256 amount;
        uint256 time;
    }
    struct oTransaction{
        string paymentID;
        string ipfs;
        bytes32 hash;
        bool present;
    }
    mapping(uint256 => cTransaction) public ctransactions;
    mapping(string => oTransaction) public otransactions;
    mapping(address => uint256) public userTransactionCount;
    address public owner;
    uint256 cTc;

    constructor(){
        owner = msg.sender;
        cTc = 0;
    }

    function makeTransaction(address _receiver) public payable returns(uint256) {
        cTransaction memory newObj = cTransaction(msg.sender,_receiver,msg.value,block.timestamp);
        cTc = cTc +1;
        ctransactions[cTc] = newObj;
        (bool success,)= _receiver.call{value: msg.value}("");
        return cTc;
    }

    function addTransaction(string memory _paymentId, string memory _ipfs) public {
        bytes32 _hash = keccak256(abi.encode(_paymentId, _ipfs));
        oTransaction memory newObj = oTransaction(_paymentId,_ipfs,_hash,true);
        otransactions[_paymentId] = newObj;
    }

    function verifycTransaction(address _sender, address _receiver, uint256 _amount, uint256 _time) public view returns(bool){
        bool res = false;
        for(uint256 i=1;i<=cTc;i++){
            res = ctransactions[i].from == _sender && ctransactions[i].to == _receiver && ctransactions[i].amount == _amount && ctransactions[i].time == _time;
            if(res==true)
                break;
        }
        return res;
    }

    function verifyoTransaction(string memory _paymentId) public view returns(bool){
        return otransactions[_paymentId].present;
    }
    
    function verifyoTransaction(string memory _paymentId, string memory _ipfs) public view returns(bool){
        bytes32 _hash = keccak256(abi.encode(_paymentId, _ipfs));
        return otransactions[_paymentId].hash == _hash;
    }
}