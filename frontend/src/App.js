import './App.css';
import NCT from './components/newCryptoTransaction'
import VCT from './components/verifyCryptoTransaction'

function App() {
  return (
    <div className="App">
      <div className='crypto-tx'>
        <NCT />
        <VCT />
      </div>
    </div>
  );
}

export default App;
