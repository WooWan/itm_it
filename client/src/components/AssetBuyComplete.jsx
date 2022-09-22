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

  span {
    margin-top: 50px;
    text-align: center;
    font-size: 19px;
  }

  input[type="button"] {
    background-color: #495057;
    color: white;
    font-size: 19px;
    margin-top: 55px;
    padding: 15px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
  }
`;

const AssetBuyComplete = ({ close }) => {
  return (
    <Modal>
      <ModalContainer>
        <span className="modalContainer__close" onClick={close}>
          &times;
        </span>
        <ModalContents>
          <span className="modalContents__message">구매가 완료되었습니다.</span>
          <input type="button" id="ok" value="확인" onClick={close} />
        </ModalContents>
      </ModalContainer>
    </Modal>
  );
};

export default AssetBuyComplete;
