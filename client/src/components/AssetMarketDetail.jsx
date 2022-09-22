import AssetBuyComplete from "./AssetBuyComplete";
import styled from "styled-components";

const Modal = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
`;

const ModalContainer = styled.div`
  width: 750px;
  max-height: 90vh;
  overflow-y: auto;
  background-color: white;
  position: relative;
  box-sizing: border-box;
  margin: 50px auto;
  padding: 20px;
  background: #fff;

  span:nth-child(1) {
    cursor: pointer;
  }

  #create {
    cursor: pointer;
  }
`;

const ModalContents = styled.form`
  margin: 0 auto;
  width: 100%;
  position: relative;
  padding: 0 20px 32px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  flex-direction: column;

  h1 {
    font-weight: 400;
  }

  h2 {
    font-weight: 400;
  }

  input[type="button"] {
    background-color: #495057;
    color: white;
    font-size: 19px;
    margin-top: 55px;
    padding: 15px;
    border: none;
    border-radius: 10px;
  }
`;

const ModalContents__title = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
`;

const ModalContents__name = styled.div`
  input {
    border: 1px solid #bababa;
    padding: 10px;
    font-size: 17px;
  }
`;

const ModalContents__author = styled.div`
  input {
    border: 1px solid #bababa;
    padding: 10px;
    font-size: 17px;
  }
`;

const ModalContents__description = styled.div`
  textarea {
    border: 1px solid #bababa;
    padding: 10px;
    font-size: 17px;
  }
`;

const ModalContents__price = styled.div`
  input {
    border: none;
    padding: 10px;
    font-size: 17px;
  }
  div {
    border: 1px solid #bababa;
  }

  div > span {
    margin-left: 15px;
  }
`;

const AssetMarketDetail = ({
  asset,
  accounts,
  purchaseContract,
  isOpen,
  isUpdateDone,
  close,
  updateCheck,
}) => {
  const buyToken = (event) => {
    //구매 로직 작성
    //purchase컨트랙트, 내 계좌, 토큰 id, 토큰 주인 계좌(메타)
    //구매했으면 메타데이터 수정
    updateCheck();
  };

  if (isOpen && !isUpdateDone) {
    return (
      <Modal>
        <ModalContainer>
          <span className="modalContainer__close" onClick={close}>
            &times;
          </span>
          <ModalContents>
            <ModalContents__title>
              <h1>세부정보</h1>
            </ModalContents__title>
            <ModalContents__name>
              <h2>제목 : {asset.metadata.name}</h2>
            </ModalContents__name>
            <ModalContents__author>
              <h2>아티스트 : {asset.metadata.keyvalues.author}</h2>
            </ModalContents__author>
            <ModalContents__description>
              <h2>설명 : {asset.metadata.keyvalues.description}</h2>
            </ModalContents__description>
            <ModalContents__price>
              <h2>가격 : {asset.metadata.keyvalues.price} ETH</h2>
            </ModalContents__price>
            <input type="button" id="buy" value="구매하기" onClick={buyToken} />
          </ModalContents>
        </ModalContainer>
      </Modal>
    );
  } else if (isOpen && isUpdateDone) {
    return <AssetBuyComplete close={close}></AssetBuyComplete>;
  } else {
    return null;
  }
};

export default AssetMarketDetail;
