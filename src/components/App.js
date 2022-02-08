import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import kryptoBirdzArray from "./kryptoBirdz";
import detectEtherProvider from "@metamask/detect-provider";
import KryptoBird from "../abis/KryptoBird.json";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBBtn
} from "mdb-react-ui-kit";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      contract: null,
      totalSupply: 0,
      kryptoBirdz: []
    };
  }
  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    // const connection = Web3.HTTPProvider("https://rinkeby.infura.io/v3/c5995d228cf444e291839dc4cc54e7e5")
    // chain_id = 4
    // myAddress = 0x2e4b2E6555d826B21cD6CeBa4e39423Bc4CCeBDa
    // privateKey =64bb6cc6d93d8579596a2f4dfbd2c4d96954a370812f61f9a0bb3aa9e658fdd8
    let provider = await detectEtherProvider();
    if (provider) {
      console.log("wallet connected");
    } else {
      provider = new Web3(
        new Web3.providers.HttpProvider(
          "https://rinkeby.infura.io/v3/c5995d228cf444e291839dc4cc54e7e5"
        )
      );
    }
  }

  async loadBlockchainData() {
    // eslint-disable-next-line no-undef
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });
    this.setState({ account: accounts[0] });
    let web3 = new Web3(window.ethereum);
    const networkId = await web3.eth.net.getId();
    const networkData = KryptoBird.networks[networkId];

    if (networkData) {
      const abi = KryptoBird.abi;
      const address = networkData.address;

      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract });

      const totalSupply = await contract.methods.totalSupply().call();
      this.setState({ totalSupply });
      for (let i = 1; i <= totalSupply; i++) {
        const kryptoBird = await contract.methods.kryptoBirdz(i - 1).call();
        this.setState({ kryptoBirdz: [...this.state.kryptoBirdz, kryptoBird] });
      }
    } else {
      window.alert("Smart contract not deployed");
    }
  }

  mint = kryptoBird => {
    this.state.contract.methods
      .mint(kryptoBird)
      .send({ from: this.state.account })
      .on("confirmation", receipt => {
        this.setState({
          kryptoBirdz: [...this.state.kryptoBirdz, kryptoBird]
        });
        window.location.reload();
      });
  };

  render() {
    return (
      <div className="container-filled">
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-wrap p-0 shadow">
          <div
            className="navbar-brand col-sm-3 col-md-3  mr-0"
            style={{ color: "white" }}
          >
            Kryto Birdz NFTs
          </div>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">
                Current Account: {this.state.account}
              </small>
            </li>
          </ul>
        </nav>

        <div className="container-fluid mt-1 ml-4">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div
                className="content mr-auto ml-auto"
                style={{ opacity: "0.8" }}
              >
                <h1>KryptoBirdz - NFT Marketplace</h1>
                <form
                  style={{ marginTop: "25px" }}
                  onSubmit={event => {
                    event.preventDefault();
                    let kryptoBird;
                    kryptoBird = this.kryptoBird.value;
                    this.mint(kryptoBird);
                  }}
                >
                  <input
                    type="text"
                    placeholder="Add a file location address to mint your own NFT"
                    className="form-control mb-1"
                    ref={input => (this.kryptoBird = input)}
                  />
                  <input
                    style={{ margin: "6px" }}
                    type="submit"
                    value="MINT YOUR OWN NFT"
                    className="btn btn-secondary btn-black"
                  />
                </form>
                <form
                  style={{ marginTop: "25px" }}
                  onSubmit={event => {
                    event.preventDefault();
                    let kryptoBird;
                    let random = Math.floor(Math.random() * 11);
                    kryptoBird = kryptoBirdzArray[random];

                    this.mint(kryptoBird);
                  }}
                >
                  <input
                    type="text"
                    placeholder="Make a wish to generate a random NFT!"
                    className="form-control mb-1"
                  />
                  <input
                    style={{ margin: "6px" }}
                    type="submit"
                    value="GENERATE A RANDOM NFT"
                    className="btn btn-secondary btn-black"
                  />
                </form>
              </div>
            </main>
          </div>
          <hr />
          <div className="row textCenter">
            {this.state.kryptoBirdz.length === 0 && (
              <div style={{ margin: "40px auto" }}>
                <h3>Your NFTs will be displayed here</h3>
                <p>
                  Input an image link to create your own NFT or click on
                  GENERATE RANDOM NFT button to generate a random NFT
                </p>
              </div>
            )}
            {this.state.kryptoBirdz.map((kryptoBird, key) => {
              return (
                <div>
                  <div>
                    <MDBCard
                      className="token img"
                      style={{ maxWidth: "22rem" }}
                    >
                      <MDBCardImage
                        src={kryptoBird}
                        position="top"
                        style={{
                          marginRight: "4px",
                          height: "150px",
                          objectFit: "contain"
                        }}
                      />
                      <MDBCardBody>
                        <MDBCardTitle>KryptoBirdz</MDBCardTitle>
                        <MDBCardText>
                          The kryptoBirdz are uniquely generated{" "}
                        </MDBCardText>
                        <MDBBtn color="secondary" outline href={kryptoBird}>
                          Download
                        </MDBBtn>
                      </MDBCardBody>
                    </MDBCard>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
