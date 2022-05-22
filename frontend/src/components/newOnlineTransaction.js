import React, { useState } from "react";
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { Button, Form } from "semantic-ui-react";
import { create as ipfsHttpClient } from 'ipfs-http-client'

import {
  contractAddress
} from './../config'

import ABI from "./../web3/abi.json"

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

function App() {
  const [paymentId,setPaymentId] = useState(null)
  const [orderId,setOrderId] = useState(null)
  const [otherDetail,setOtherDetail] = useState(null)
  const [ipfsHash,setIpfsHash] = useState(null)

  const uploadIPFS = async() =>{
    const data = JSON.stringify({
      paymentId, orderId, otherDetail
    })

    try {
      const added = await client.add(
          data,
          {
              progress: (prog) => console.log(`received: ${prog}`)
          }
      )
      console.log(added.path)
      setIpfsHash(added.path)
      return true
    } catch (error) {
        console.log(error);
    }
    return false
  }

  const submit = async(e) => {
      e.preventDefault()
      if(paymentId === null)
        return

      // const done = await uploadIPFS()
      // if(!done) return

      const data = JSON.stringify({
        paymentId, orderId, otherDetail
      })
      let added
      try {
        added = await client.add(
            data,
            {
                progress: (prog) => console.log(`received: ${prog}`)
            }
        )
        console.log(added.path)
        setIpfsHash(added.path)
      } catch (error) {
          console.log(error);
      }

      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      const Contract = new ethers.Contract(contractAddress, ABI, signer)
      try {
        console.log(paymentId)
        console.log(ipfsHash)
          let transaction = await Contract.addTransaction(paymentId,added.path)
          console.log(transaction)
      } catch (er) {
          console.log(er)
      }
  }

    return (
      <div className="verify-o-tx">
        <h1>Save Online Transaction</h1>
        <Form>
            <Form.Field>
                <label>Payment ID</label>
                <input placeholder='PaymentId' onChange={(e) => setPaymentId(e.target.value)} />
            </Form.Field>
            <Form.Field>
                <label>Order ID</label>
                <input placeholder='OrderId' onChange={(e) => setOrderId(e.target.value)} />
            </Form.Field>
            <Form.Field>
                <label>Other Details</label>
                <textarea placeholder='optional' onChange={(e) => setOtherDetail(e.target.value)} />
            </Form.Field>
            <Button type='submit' onClick={submit}>Save Transaction</Button>
        </Form>
      </div>
    );
  }
  
  export default App;