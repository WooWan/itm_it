/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { createContext, useEffect, useReducer, useState } from "react";
import ERC_721 from "./contracts/ERC721.json";
import Purchase from "./contracts/Purchase.json";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Market from "./components/Market";
import Layout from "./components/Layout";
import Profile from "./components/Profile";
import Wallet from "./components/Wallet";
import getWeb3 from "./service/getWeb3";

const app = css`
  height: 100vh;
`;

export const WebDispatch = createContext({});

const reducer = (state, action) => {
  switch (action.type) {
    case "setMethod":
      return {
        ...state,
        methods: action.methods,
      };
    case "setAccount":
      return {
        ...state,
        accounts: action.accounts,
      };
    default:
      return state;
  }
};

const pinataSDK = require("@pinata/sdk");
const pinataObj = pinataSDK(
  "2b7b1e2284f63479d880",
  "8a2fe76b94ecaddfc60194c0aae5b7820e09ee0b44fa2dfc757c7adbf82d21f6"
);

const App = () => {
  const initialState = null;
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  const [accounts, setAccounts] = useState();
  const [ERC721Contract, setERC721Contract] = useState();
  const [purchaseContract, setPurchaseContract] = useState();
  const [pinata, setPinata] = useState(pinataObj);

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");
    isLogin && connectWeb3();
  }, []);

  const connectWeb3 = async () => {
    try {
      const web = await getWeb3();
      const accounts = await web.eth.getAccounts();
      const networkId = await web.eth.net.getId();
      const deployedNetwork = ERC_721.networks[networkId];
      const ERC721 = await new web.eth.Contract(
        ERC_721.abi,
        deployedNetwork && deployedNetwork.address
      );
      const purchase = await new web.eth.Contract(
        Purchase.abi,
        deployedNetwork && deployedNetwork.address
      );
      setPurchaseContract(purchase);
      setAccounts(accounts);
      setERC721Contract(ERC721);

      localStorage.setItem("isLogin", "true");

      dispatch({ type: "setMethod", methods: ERC721.methods });
      dispatch({ type: "setAccount", accounts: accounts });
    } catch (error) {
      console.log(error);
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
    }
  };

  return (
    <div css={app} className="App">
      <WebDispatch.Provider value={value}>
        <Router>
          <Switch>
            <Layout>
              <Route
                exact
                path="/"
                render={(props) => (
                  <Market
                    {...props}
                    accounts={accounts}
                    ERC721Contract={ERC721Contract}
                    purchaseContract={purchaseContract}
                    pinata={pinata}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/profile"
                render={(props) => (
                  <Profile
                    {...props}
                    accounts={accounts}
                    ERC721Contract={ERC721Contract}
                    purchaseContract={purchaseContract}
                    pinata={pinata}
                  />
                )}
              />
              <Route
                exact
                path="/wallet"
                render={(props) => (
                  <Wallet {...props} connectWeb3={connectWeb3} />
                )}
              />
            </Layout>
          </Switch>
        </Router>
      </WebDispatch.Provider>
    </div>
  );
};

export default App;
