import logo from './logo.svg';
import { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('')
  const [answer, setAnswer] = useState('')
  const [responses, setReponses] = useState([])
  const [tokens, setTokens] = useState(1500)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [engine, setEngine] = useState('text-davinci-002')
  const [apiKey, setApiKey] = useState('')

  const urlParams = new URLSearchParams(window.location.search)

  if(!apiKey && urlParams.get('apiKey')) {
    setApiKey(urlParams.get('apiKey'))
  }


  const getOpenAIResponse = () => {
    setIsLoading(true)
    fetch('https://api.openai.com/v1/engines/text-davinci-002/completions', {
      body: JSON.stringify({ prompt: prompt, max_tokens: tokens }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    }).then(res => res.json())
      .then(res => {
        setReponses(res.choices)
        setIsLoading(false)
      }
      ).catch(err => {  
        setError(err.message)
        setIsLoading(false)
      })
  }

  const handleTokens = (tokens) => {
    if (tokens > 4000) {
      setError("You can't have more than 4000 tokens.")
    } else if (tokens < 0) {
      setError("You can't have less than 0 tokens.")
    }
    else {
      setError('')
      setTokens(parseInt(tokens))
    }
  }


  return (<>
    <div className="App">
      <p>
        Api Key: <input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
      </p>
      <p>Max Tokens: <input type="number" onChange={(e)=>handleTokens(e.target.value)} value={tokens}></input>
      <br/>{error}</p>
      <p>Engine: 
        <select onChange={(e)=>setEngine(e.target.value)} value={engine}>
          <option value='text-davinci-002' selected = {engine === 'text-davinci-002'}>text-davinci-002</option>
          <option value='text-curie-001' selected = {engine === 'text-curie-001'}>text-curie-001</option>
          <option value='text-babbage-001' selected = {engine === 'text-babbage-001'}>text-babbage-001</option>
          <option value='text-ada-001' selected = {engine === 'text-ada-001'}>text-ada-001</option>
        </select>
      </p>
      <textarea className="textarea" onChange={(e)=>setPrompt(e.target.value)} placeholder="Enter text here" value={prompt} rows={15} cols={50}></textarea><br/>
      <button onClick={getOpenAIResponse}>Submit</button>
    </div>
    <div style={{ border: '1px solid black;', display: 'block', width: '400px', height: '500px'}}>
      <h4>Responses: </h4>
      {isLoading ? 'Doing cool ai things please hold....' : responses.map((response, index) => <p key={index}>{response?.text}</p>)}
    </div>
    </>);
}

export default App;
