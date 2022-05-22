import React, { useState } from "react";
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { Button, Form, Message } from "semantic-ui-react";

import {
  contractAddress
} from './../config'


import ABI from "./../web3/abi.json"

function App() {
  const [paymentId,setPaymentId] = useState(null)
  const [res,setRes] = useState()
  const [showres,setShowRes] = useState(false)

  const submit = async(e) => {
      e.preventDefault()
      if(paymentId === null)
        return

      setShowRes(false)        
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      const Contract = new ethers.Contract(contractAddress, ABI, signer)
      try {
          let transaction = await Contract.verifyoTransaction(paymentId)
          console.log(transaction)
          setRes(transaction)
          setShowRes(true)
      } catch (er) {
          console.log(er)
      }
  }

    return (
      <div className="verify-o-tx">
        <h1>Verify Online Transaction</h1>
        <Form>
            <Form.Field>
                <label>Payment ID</label>
                <input placeholder='PaymentId' onChange={(e) => setPaymentId(e.target.value)} />
            </Form.Field>
            <Button type='submit' onClick={submit}>Verify Transaction</Button>
        </Form>
        {
          showres && (res ? <Message success> The Transaction is valid</Message> : <Message error> The Transaction is not valid</Message>)
        }
      </div>
    );
  }
  
  export default App;