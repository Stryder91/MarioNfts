pragma solidity ^0.8.2;

contract ERC1155 {

    event TransferSingle(address indexed _operator, address indexed _from, address indexed _to, uint _id, uint _value);
    event TransferBatch(address _operator, address _from, address _to, uint[] _ids, uint256[] values);
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    // mapping from TokenID to account balances
    // pour chaque token, on va avoir une adresse et la quantité qu'elle possède de ce token particulier
    mapping(uint => mapping(address => uint)) internal _balances;

    // Mapping from account to operator approvals
    // pour chaque compte, quels comptes sont approuvés ?
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    
    // gets the balance of an account tokens
    function balanceOf(address account, uint id) public view returns(uint) {
        require(account != address(0), "Address is zero");
        return _balances[id][account];
    }

    // gets the balance of multiple accounts tokens
    function balanceOfBatch(address[] memory accounts, uint[] memory ids) public view returns(uint[] memory) {

        require(accounts.length == ids.length, "Accounts and ids are not the same length");
        // Pour que le tableau qu'on crée match avec la longueur du tableau passé en paramètre
        uint[] memory batchBalances = new uint[](accounts.length);

        for(uint i=0; i < accounts.length; ++i) {
            batchBalances[i] = balanceOf(accounts[i], ids[i]);
        }

        // batchBalances c'est donc un tableau de mapping de mapping 
        return batchBalances;
    }

    // checks if an address is an operator for another address
    function isApprovedForAll(address owner, address operator) public view returns(bool) {
        return _operatorApprovals[owner][operator];
    }

    function setApprovalForAll(address operator, bool approved) public {
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function _transfer(address from, address to, uint id, uint amount) private {

        // On récupère la quantité de nft du holder
        uint fromBalance = _balances[id][from];

        require(fromBalance >= amount, "Insufficient balance");
        _balances[id][from] = fromBalance - amount;
        _balances[id][to] += amount; 
    }

    function safeTransferFrom(address from, address to, uint id, uint amount) public virtual {
        require(from == msg.sender || isApprovedForAll(from, msg.sender), "Msg.sender is not the owner or approved for transfer");
        require(to != address(0), "Address is zero");
        _transfer(from, to, id, amount);
        emit TransferSingle(msg.sender, from, to, id, amount);

        require(_checkOnERC1155Received(), "Receiver is not implemented");
    }

    // Oversimplified, on écrase la vraie fonction pour que ça marche
    function _checkOnERC1155Received() private pure returns(bool) {
        return true;
    }

    function safeBatchTransferFrom(address from, address to, uint[] memory ids, uint[] memory amounts) public  {
        require(from == msg.sender || isApprovedForAll(from, msg.sender), "Msg.sender is not the owner or approved for transfer");
        require(to != address(0), "Address is zero");
        require(ids.length == amounts.length, "Ids and amounts length are not equal");
        for (uint i=0; i < ids.length; ++i) {
            uint id = ids[i];
            uint amount = amounts[i];

            _transfer(from, to, id, amount);
        }

        emit TransferBatch(msg.sender, from, to, ids, amounts);
        require(_checkOnBatchERC1155Received(), "Receiver is not implemented");
    }

    // Oversimplified, on écrase la vraie fonction pour que ça marche
    function _checkOnBatchERC1155Received() private pure returns(bool) {
        return true;
    }

        
    // ERC 165 compliant
    // Tell everyone we support the ERC1155 function
    // interfaceId == 0xd9b67a26;
    function supportsInterface(bytes4 interfaceId) public pure virtual returns(bool) {
        return interfaceId == 0xd9b67a26;
    }
}