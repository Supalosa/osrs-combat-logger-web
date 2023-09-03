import { Tab } from "semantic-ui-react"
import { useAppSelector } from "../hooks";
import { useMemo } from "react";
import { RawLogViewer } from "./RawLogViewer";

type LogViewerProps = {
}

export const LogViewer = (_props: LogViewerProps) => {
    const currentLog = useAppSelector((state) => state.logs.currentLog);

    const parsedLogEntries = useMemo(() => {
        return currentLog?.split("\n").map((el) => JSON.parse(el))
    }, [currentLog]);

    if (parsedLogEntries == null) {
        return <><p>Invalid log format</p></>
    }

    const panes = [
        {
            menuItem: 'Raw Entries', render: () => <Tab.Pane>
                <RawLogViewer entries={parsedLogEntries} /></Tab.Pane>
        }
    ]

    return <>
        <p>Analyzing a log:</p>
        <Tab panes={panes} />
    </>
}