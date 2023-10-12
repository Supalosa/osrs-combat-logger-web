import { LogViewer } from "./components/LogViewer";
import { LogInput } from "./components/LogInput";
import { useAppDispatch, useAppSelector } from "./hooks";
import { setLog } from "./redux/localLogs";
import { AppShell, Container, Divider, Header } from "@mantine/core";

import "./App.css";

function App() {
    const dispatch = useAppDispatch();
    const currentLog = useAppSelector((state) => state.logs.currentLog);

    return (
        <AppShell
            header={
                <Header height={45} p="xs">
                    <strong>OSRS Combat Logs</strong>
                </Header>
            }
        >
            <Container className="main-content">
                <LogInput
                    onLogUploaded={(logs) => {
                        dispatch(setLog(logs));
                    }}
                />

                {currentLog != null && (
                    <>
                        <Divider />
                        <LogViewer />
                    </>
                )}
            </Container>
        </AppShell>
    );
}

export default App;
