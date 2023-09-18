import { useAppSelector } from "../hooks";
import { useMemo, useState } from "react";
import { RawLogViewer } from "./RawLogViewer";
import { Accordion, Alert, Tabs } from "@mantine/core";
import { MapViewer } from "./MapViewer";
import { LogLine } from "../logs/Log";

const tryParseLogFile = (
    log: string | null,
    onError: (error: string, detail?: string) => void
) => {
    if (!log) {
        onError("Empty log file provided.");
        return null;
    }
    try {
        return log?.split("\n").map((el) => JSON.parse(el)) as LogLine[];
    } catch (err: unknown) {
        if (typeof err === "string") {
            onError(err);
        } else if (err instanceof Error) {
            onError(
                "Unprocessable log file provided. Please report this to the developer.",
                err.message
            );
        }
        return null;
    }
};

type LogViewerProps = {};

export const LogViewer = (_props: LogViewerProps) => {
    const currentLog = useAppSelector((state) => state.logs.currentLog);
    const [error, setError] = useState<{
        error: string | null;
        detail: string | undefined;
    } | null>(null);

    const parsedLogEntries = useMemo(() => {
        const result = tryParseLogFile(currentLog, (error, detail) =>
            setError({ error, detail })
        );
        if (!!result) {
            setError(null);
        }
        return result;
    }, [currentLog]);

    if (error) {
        return (
            <Alert color="red" title="Invalid log file">
                <p>{error.error}</p>
                {error.detail && (
                    <Accordion>
                        <Accordion.Item value="moreDetails">
                            <Accordion.Control>More details</Accordion.Control>
                            <Accordion.Panel>{error.detail}</Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                )}
            </Alert>
        );
    }

    if (!parsedLogEntries) {
        return null;
    }

    return (
        <>
            <p>Analyzing a log!</p>
            <Tabs defaultValue="rawEntries">
                <Tabs.List>
                    <Tabs.Tab value="map">Map</Tabs.Tab>
                    <Tabs.Tab value="rawEntries">Raw Entries</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="map" pt="xs">
                    <MapViewer entries={parsedLogEntries} />
                </Tabs.Panel>
                <Tabs.Panel value="rawEntries" pt="xs">
                    <RawLogViewer entries={parsedLogEntries} />
                </Tabs.Panel>
            </Tabs>
        </>
    );
};
