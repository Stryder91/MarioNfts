const { ethers } = require("hardhat");

async function main() {

  const SuperMarioWorld = await ethers.getContractFactory("SuperMarioFinalCollection");
  const superMarioWorld = await SuperMarioWorld.deploy(
    "SuperMarioFinalCollection", 
    "FNAL", 
    "https://ipfs.io/ipfs/QmU7DewZ5sscECBsp6qCiuunix8zVMqfWCa9zDwhATk2Rj/"
  );

  await superMarioWorld.deployed();
  console.log("Success! Contract was deployed to: ", superMarioWorld.address);

  await superMarioWorld.mint(10);
  await superMarioWorld.mint(10);
  await superMarioWorld.mint(10);
  await superMarioWorld.mint(10);
  await superMarioWorld.mint(1);
  await superMarioWorld.mint(1);
  await superMarioWorld.mint(1);
  await superMarioWorld.mint(1);

  console.log("NFT successfully minted");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });