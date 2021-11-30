import './App.css';
import styled from 'styled-components';
import { NFTCard } from './components/NFTCard';
import { useState, useEffect } from 'react';
import { NFTModal } from './components/NFTModal';
import { ethers } from 'ethers';
import { connect } from './helpers';
import axios from 'axios';

function App() {
  let initial_nfts = [
    {
    name: "Mario",
    symbol: "FNAL",
    copies: 10,
    image: "https://via.placeholder.com/150"
    },
    {
    name: "Mario",
    symbol: "FNAL",
    copies: 10,
    image: "https://via.placeholder.com/150"
    },
    {
    name: "Mario",
    symbol: "FNAL",
    copies: 10,
    image: "https://via.placeholder.com/150"
    },
    {
    name: "Mario",
    symbol: "FNAL",
    copies: 10,
    image: "https://via.placeholder.com/150"
    }
  ];

  const [showModal, setShowModal] = useState(false);
  const [selectedNft, setSelectedNft] = useState();
  const [nfts, setNfts] = useState(initial_nfts);

  useEffect(() => {
    (async() => {
      const address = await connect();
      if (address) {
        getNfts(address)
      }
    })();
  }, []);

  function toggleModal(i) {
    if (i >= 0) {
      setSelectedNft(nfts[i]);
    }
    setShowModal(!showModal);
  }

  async function getMetadataFromIpfs(tokenURI) {
    let metadata = await axios.get(tokenURI);
    return metadata.data;
  }

  async function getNfts(address) {
    const rpc="https://rpc-mumbai.maticvigil.com/"; // Alchemy
    const ethersProvider = new ethers.providers.JsonRpcProvider(rpc);

    let abi = [
      "function symbol() public view returns(string memory)",
      "function tokenCount() public view returns(uint)",
      "function uri(uint _tokenId) public view returns(string memory)",
      "function balanceOfBatch(address[] accounts, uint[] ids) public view returns(uint[])"
    ];

    // latest
    // 0xD1E5BA665198E53B48C8DDA5fD59C168085A6783
    let nftCollection = new ethers.Contract(
      "0xD1E5BA665198E53B48C8DDA5fD59C168085A6783",
      abi,
      ethersProvider
    )

    let numberOfNfts = (await nftCollection.tokenCount()).toNumber();
    let collectionSymbol = await nftCollection.symbol();

    let accounts = Array(numberOfNfts).fill(address);
    let ids = Array.from({ length: numberOfNfts }, (_, i) => i+1);
    let copies = await nftCollection.balanceOfBatch(accounts, ids);

    let tempArray = [];
    let baseUrl = "";

    for (let i = 1; i <= numberOfNfts; i++) {
      if (i == 1) { 
        let tokenURI = await nftCollection.uri(i)
        baseUrl = tokenURI.replace(/\d+.json/, "")
        let metadata = await getMetadataFromIpfs(tokenURI)
        metadata.symbol = collectionSymbol
        metadata.copies = copies[i - 1]
        tempArray.push(metadata)
      } else {
        let metadata = await getMetadataFromIpfs(baseUrl + `${i}.json`)
        metadata.symbol = collectionSymbol
        metadata.copies = copies[i - 1]
        tempArray.push(metadata)
      }
    }
    console.log("tempArray",tempArray)
    setNfts(tempArray);
  }

  return (
    <div className="App">
      <Container >
        <Title>Welcome to Mario Nft's</Title>
        <Subtitle ></Subtitle>
        <Grid>
        {nfts.map((n, i) => 
          <NFTCard key={i} nft={n} toggleModal={() => toggleModal(i)}/>
        )}
        </Grid>
      </Container>
      {
        showModal && 
        <NFTModal 
          nft={selectedNft} 
          toggleModal={() => toggleModal()}
        />
      }
    </div>
  );
}

const Title = styled.h1`
margin: 0;
text-align: center;
`
const Subtitle = styled.h4`
color: grey;
margin-top:0;
text-align:center;
`
const Container = styled.div`
width: 70%;
max-width: 1200px;
margin: auto;
margin-top: 100px;
`

const Grid = styled.div`
display: grid;
grid-template-columns: 1fr 1fr 1fr 1fr;
row-gap: 40px;
`
export default App;
