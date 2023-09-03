import { Log } from './components/Log';

import 'semantic-ui-css/semantic.min.css';
import './App.css'
import { useState } from 'react';
import { LogInput } from './components/LogInput';
import { increment, decrement } from './counterSlice';
import { Button } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from './hooks';


function App() {
  const [log, setLog] = useState("");
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <>
      <LogInput onLogUploaded={() => {
        setLog("true");
      }} />
      <Log log={log} />
      <p>Count is {count}</p>
      <Button content="increment" onClick={() => dispatch(increment())} />
      <Button content="decrement" onClick={() => dispatch(decrement())} />
    </>
  )
}

export default App
