import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";

const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Address of the deployed contract

function App() {
  const [greeting, setGreetingValue] = useState("");

  const [varDoBuga] = useState("");
  console.log(varDoBuga);

  const [varDoBuga2] = useState("");
  console.log(varDoBuga2);

  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum); // There are other providers to use: https://docs.ethers.io/v5/api/providers/
      const contract = new ethers.Contract( // Creates the contract to access the functions that the contract itself exports
        greeterAddress,
        Greeter.abi,
        provider
      );

      try {
        const data = await contract.greet(); // Reads the greeting variable from the blockchain
        console.log("data: ", data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  async function setGreeting() {
    // Sets the value of the greeting blockchain variable
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum); // There are other providers to use: https://docs.ethers.io/v5/api/providers/
      const signer = provider.getSigner(); //This function updates the blockchain, so we need to sign the transaction using a signer
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer); // Creates the contract to access the functions that the contract itself exports, but it uses the signer
      const transaction = await contract.setGreeting(greeting);
      setGreetingValue("");
      await transaction.wait(); // Waiting for the transaction to be confirmed on the blockchain
      fetchGreeting(); // logs out the new value from the blockchain
    }
  }

  async function requestAccount() {
    // Connect to metamask wallet, can return 1 or an array of accounts
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input
          onChange={(e) => setGreetingValue(e.target.value)}
          placeholder="Set Greeting variable"
          value={greeting}
        ></input>
      </header>
    </div>
  );
}

export default App;
