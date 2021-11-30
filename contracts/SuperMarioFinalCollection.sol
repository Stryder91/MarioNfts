pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SuperMarioFinalCollection is ERC1155, Ownable {
    
    string public name;
    string public symbol;
    uint public tokenCount;
    string public baseUri;

    constructor(
        string memory _name, string memory _symbol, string memory _baseUri
        ) ERC1155(_baseUri) {
        name = _name;
        symbol = _symbol;
        baseUri = _baseUri;
    }

    function mint(uint amount) public onlyOwner {
        tokenCount +=1;
        // A qui on mint, l'id du token, la quantité, la data
        _mint(msg.sender, tokenCount, amount, "");
    }


    function uri(uint _tokenId) override public view returns(string memory) {
        return string (
            abi.encodePacked(
                baseUri, // URL
                Strings.toString(_tokenId), // + tokenID
                ".json" // extension
            )
        ); // => URL/1.json
    }
}