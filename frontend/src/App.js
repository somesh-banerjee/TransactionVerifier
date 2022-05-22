import './App.css';
import NCT from './components/newCryptoTransaction'
import VCT from './components/verifyCryptoTransaction'
import NOT from './components/newOnlineTransaction'
import VOT from './components/verifyOnlineTransaction'

function App() {
  return (
    <div className="App">
      <div className='crypto-tx'>
        <NCT />
        <VCT />
      </div>
      <div className='online-tx'>
        <NOT />
        <VOT />
      </div>
    </div>
  );
}

export default App;
