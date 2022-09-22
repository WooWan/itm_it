import React, { useState, useRef } from "react";
import AssetAddFormComplete from "./Asset_add_form_complete";
import styled from "styled-components";

const pinataSDK = require("@pinata/sdk");
const pinata = pinataSDK(
  "2b7b1e2284f63479d880",
  "8a2fe76b94ecaddfc60194c0aae5b7820e09ee0b44fa2dfc757c7adbf82d21f6"
);
const { create } = require("ipfs-http-client");
const ipfs = create({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

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

const ModalContents__uploadAudio = styled.div`
  span {
    opacity: 0.6;
  }
`;

const ModalContents__uploadPreview = styled.div`
  span {
    opacity: 0.6;
  }
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

const AssetAddForm = ({
  contract,
  accounts,
  isOpen,
  isMintDone,
  close,
  mintCheck,
}) => {
  const [audioBuffer, setAudioBuffer] = useState();
  const [imageBuffer, setImageBuffer] = useState();

  const titleRef = useRef();
  const authorRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();

  const audioCapture = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      Buffer();
      setAudioBuffer(Buffer(reader.result));
    };
  };

  const imageCapture = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setImageBuffer(Buffer(reader.result));
    };
  };

  const createToken = async (event) => {
    //ipfs에 저장
    console.log("click");
    const myAccount = accounts[0];

    const myImageResult = await ipfs.add(imageBuffer);
    const myImageResultPin = await pinata.pinByHash(myImageResult.path);

    const options = {
      pinataMetadata: {
        name: titleRef.current.value || "",
        keyvalues: {
          author: authorRef.current.value || "",
          description: descriptionRef.current.value || "",
          price: priceRef.current.value || "",
          image: "https://gateway.pinata.cloud/ipfs/" + myImageResult.path,
          show: "y",
          state: "private",
          account: myAccount,
        },
      },
    };
    //pinning
    const myAssetResult = await ipfs.add(audioBuffer);
    const pinataResult = await pinata.pinByHash(myAssetResult.path, options);

    //nft mint
    const nft = await contract.methods
      .mint(accounts[0], pinataResult.ipfsHash)
      .send({ from: accounts[0] });

    mintCheck();
  };

  if (isOpen && !isMintDone) {
    return (
      <Modal>
        <ModalContainer>
          <span className="modalContainer__close" onClick={close}>
            &times;
          </span>
          <ModalContents>
            <ModalContents__title>
              <h1>새 아이템 만들기</h1>
            </ModalContents__title>
            <ModalContents__uploadAudio>
              <h2>오디오 업로드하기</h2>
              <span>지원되는 파일 : mp4, mp3, Max size : 40MB</span>
              <input type="file" id="setAudio" onChange={audioCapture} />
            </ModalContents__uploadAudio>
            <ModalContents__uploadPreview>
              <h2>프리뷰 업로드하기</h2>
              <span>
                업로드한 아이템을 설명할 수 있는 이미지를
                업로드하세요.(PNG,JPG,GIF)
              </span>
              <input type="file" id="setImage" onChange={imageCapture} />
            </ModalContents__uploadPreview>
            <ModalContents__name>
              <h2>제목</h2>
              <input
                ref={titleRef}
                type="text"
                id="setTitle"
                size="71"
                placeholder="아이템 제목을 입력해주세요."
              ></input>
            </ModalContents__name>
            <ModalContents__author>
              <h2>아티스트</h2>
              <input
                ref={authorRef}
                type="text"
                id="setAuthor"
                size="71"
                placeholder="아티스트를 입력해주세요."
              ></input>
            </ModalContents__author>
            <ModalContents__description>
              <h2>설명</h2>
              <textarea
                ref={descriptionRef}
                id="setDescription"
                cols="63"
                rows="10"
                placeholder="아이템에 대한 추가적인 설명을 작성해주세요."
              ></textarea>
            </ModalContents__description>
            <ModalContents__price>
              <h2>가격</h2>
              <div>
                <input
                  ref={priceRef}
                  type="text"
                  id="setPrice"
                  size="65"
                  placeholder="가격을 입력해주세요."
                ></input>
                <span>ETH</span>
              </div>
            </ModalContents__price>
            <input
              type="button"
              id="create"
              value="업로드하기"
              onClick={createToken}
            />
          </ModalContents>
        </ModalContainer>
      </Modal>
    );
  } else if (isOpen && isMintDone) {
    return <AssetAddFormComplete close={close}></AssetAddFormComplete>;
  } else {
    return null;
  }
};

export default AssetAddForm;
