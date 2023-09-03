import { LogViewer } from './components/LogViewer';
import { LogInput } from './components/LogInput';
import { Container, Divider, Menu } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from './hooks';
import { setLog } from './redux/localLogs';

import 'semantic-ui-css/semantic.min.css';
import './App.css'


function App() {
  const dispatch = useAppDispatch();
  const currentLog = useAppSelector((state) => state.logs.currentLog);

  return (
    <>
      <Menu fixed='top' inverted>
        <Container>
          <Menu.Item as='a' header>
            <span>OSRS Combat Logs</span>
          </Menu.Item>
        </Container>
      </Menu>
      <Container className="main-content">
        <LogInput onLogUploaded={(logs) => {
          dispatch(setLog(logs));
        }} />

        {currentLog != null && <>
          <Divider />
          <LogViewer />
        </>}
      </Container>
    </>
  )
}

export default App
