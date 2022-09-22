/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { useHistory } from "react-router-dom";

const walletStyle = css`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  background-color: white;
  span {
    text-align: center;
  }
`;

const Wallet = ({ handleWeb }) => {
  const history = useHistory();

  const onSubmit = async (event) => {
    event.preventDefault();
    await handleWeb();
    history.push("/market");
  };
  return (
    <div css={walletStyle}>
      <span>Sign in your wallet</span>
      <img src="images/metamask.png" alt="metamask" />
      <button onClick={onSubmit}>로그인하기</button>
    </div>
  );
};

export default Wallet;
