pragma solidity 0.8.7;

contract TransactionVerifier{
    struct cTransaction{
        address from;
        address to;
        uint256 amount;
        uint256 time;
    }
    mapping(uint256 => cTransaction) public ctransactions;
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

    function addTransaction() public {

    }

    function verifyTransaction(address _sender, address _receiver, uint256 _amount, uint256 _time) public view returns(bool){
        bool res = false;
        for(uint256 i=1;i<=cTc;i++){
            res = ctransactions[i].from == _sender && ctransactions[i].to == _receiver && ctransactions[i].amount == _amount && ctransactions[i].time == _time;
            if(res==true)
                break;
        }
        return res;
    }
}