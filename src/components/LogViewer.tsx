import { Accordion, Message, Tab } from "semantic-ui-react"
import { useAppSelector } from "../hooks";
import { useMemo, useState } from "react";
import { RawLogViewer } from "./RawLogViewer";

const tryParseLogFile = (log: string | null, onError: (error: string, detail?: string) => void) => {
    if (!log) {
        onError("Empty log file provided.");
        return null;
    }
    try {
        return log?.split("\n").map((el) => JSON.parse(el));
    } catch (err: unknown) {
        if (typeof err === "string") {
            onError(err);
        } else if (err instanceof Error) {
            onError("Unprocessable log file provided. Please report this to the developer.", err.message);
        }
        return null;
    }
};

type LogViewerProps = {
}

export const LogViewer = (_props: LogViewerProps) => {
    const currentLog = useAppSelector((state) => state.logs.currentLog);
    const [error, setError] = useState<{ error: string | null, detail: string | undefined } | null>(null);
    const [showDetail, setShowDetail] = useState(false);

    const parsedLogEntries = useMemo(() => {
        const result = tryParseLogFile(currentLog, (error, detail) => setError({ error, detail }));
        if (!!result) {
            setError(null);
        }
        return result;
    }, [currentLog]);

    const panes = [
        {
            menuItem: 'Raw Entries', render: () => <Tab.Pane>
                {parsedLogEntries && <RawLogViewer entries={parsedLogEntries} />}
            </Tab.Pane>
        }
    ]

    if (error) {
        return <Message error>
            <Message.Header>There was a problem with the log file:</Message.Header>
            <p>{error.error}</p>
            {error.detail && <Accordion>
                <Accordion.Title onClick={() => setShowDetail(!showDetail)}>More details</Accordion.Title>
                <Accordion.Content active={showDetail}>{error.detail}</Accordion.Content>
            </Accordion>}
        </Message>
    }

    return <>
        <p>Analyzing a log:</p>
        <Tab panes={panes} />
    </>
}