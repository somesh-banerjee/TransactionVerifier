import React, { useState } from "react";
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { Button, Form, Message } from "semantic-ui-react";

import {
  contractAddress
} from './../config'


import ABI from "./../web3/abi.json"

function App() {
  const [receiver,setReceiver] = useState(null)
  const [sender,setSender] = useState(null)
  const [amount,setAmount] = useState(null)
  const [time,setTime] = useState(null)
  const [res,setRes] = useState()
  const [showres,setShowRes] = useState(false)

  const submit = async(e) => {
      e.preventDefault()
      if(receiver === null || amount === null || sender === null || time==null)
        return

      setShowRes(false)        
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      const Contract = new ethers.Contract(contractAddress, ABI, signer)
      try {
          let transaction = await Contract.verifycTransaction(sender,receiver,ethers.utils.parseEther(amount),time)
          console.log(transaction)
          setRes(transaction)
          setShowRes(true)
      } catch (er) {
          console.log(er)
      }
  }

    return (
      <div className="verify-c-tx">
        <h1>Verify Crypto Transaction</h1>
        <Form>
            <Form.Field>
                <label>Sender</label>
                <input placeholder='Sender' onChange={(e) => setSender(e.target.value)} />
            </Form.Field>
            <Form.Field>
                <label>Receiver</label>
                <input placeholder='Receiver' onChange={(e) => setReceiver(e.target.value)} />
            </Form.Field>
            <Form.Field>
                <label>Amount</label>
                <input placeholder='Amount' onChange={(e) => setAmount(e.target.value)} />
            </Form.Field>
            <Form.Field>
                <label>Time</label>
                <input placeholder='Time' onChange={(e) => setTime(e.target.value)} />
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