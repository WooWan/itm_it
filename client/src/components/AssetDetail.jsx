import React, { useState, useContext, useRef } from "react";
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

const AssetDetail = ({ asset, isOpen, isUpdateDone, close, updateCheck }) => {
  const titleRef = useRef();
  const authorRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();

  const updateMeta = async (event) => {
    const selectState = document.getElementById("state");
    const newState = selectState.options[selectState.selectedIndex].value;
    const newMeta = {
      name: titleRef.current.value || "",
      keyvalues: {
        author: authorRef.current.value || "",
        description: descriptionRef.current.value || "",
        price: priceRef.current.value || "",
        state: newState,
      },
    };
    await pinata.hashMetadata(asset.asset.ipfs_pin_hash, newMeta);
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
              <h1>메타데이터 수정</h1>
            </ModalContents__title>
            <ModalContents__name>
              <h2>제목</h2>
              <input
                ref={titleRef}
                type="text"
                id="setTitle"
                size="71"
                placeholder={asset.asset.metadata.name}
              ></input>
            </ModalContents__name>
            <ModalContents__author>
              <h2>아티스트</h2>
              <input
                ref={authorRef}
                type="text"
                id="setAuthor"
                size="71"
                placeholder={asset.asset.metadata.keyvalues.author}
              ></input>
            </ModalContents__author>
            <ModalContents__description>
              <h2>설명</h2>
              <textarea
                ref={descriptionRef}
                id="setDescription"
                cols="63"
                rows="10"
                placeholder={asset.asset.metadata.keyvalues.description}
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
                  placeholder={asset.asset.metadata.keyvalues.price}
                ></input>
                <span>ETH</span>
              </div>
            </ModalContents__price>
            <h2>공개여부</h2>
            <select name="state" id="state">
              <option value="public">public</option>
              <option value="private">private</option>
            </select>
            <input
              type="button"
              id="create"
              value="수정하기"
              onClick={updateMeta}
            />
          </ModalContents>
        </ModalContainer>
      </Modal>
    );
  } else if (isOpen && isUpdateDone) {
    return <AssetAddFormComplete close={close}></AssetAddFormComplete>;
  } else {
    return null;
  }
};

export default AssetDetail;
