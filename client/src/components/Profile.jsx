import React from "react";
import AssetAddForm from "./Asset_add_form";
import { WebDispatch } from "../App";
import { useContext, useEffect, useState } from "react";
import Asset from "./Asset";
import Modalbutton from "./ModalButton";

const pinataSDK = require("@pinata/sdk");
const pinata = pinataSDK(
  "2b7b1e2284f63479d880",
  "8a2fe76b94ecaddfc60194c0aae5b7820e09ee0b44fa2dfc757c7adbf82d21f6"
);

const Profile = ({ accounts, contract }) => {
  const [myAssets, setMyAssets] = useState({});
  const { state, dispatch } = useContext(WebDispatch);

  useEffect(() => {
    const myAccount = accounts[0];
    const filter = {
      status: "pinned",
      metadata: {
        keyvalues: {
          show: {
            value: "y",
            op: "eq",
          },
          account: {
            value: myAccount,
            op: "eq",
          },
        },
      },
    };
    async function fetchPinned() {
      const tokens = await pinata.pinList(filter);
      setMyAssets(tokens.rows);
    }
    fetchPinned();
  }, []);

  return (
    <div>
      <Modalbutton contract={contract} accounts={accounts} />
      {Object.keys(myAssets).map((key) => (
        <Asset asset={myAssets[key]} />
      ))}
      ;
    </div>
  );
};

export default Profile;
