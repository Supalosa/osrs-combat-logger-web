import { Table } from "@mantine/core";
import { RawLogEntry } from "./RawLogEntry";

type RawLogViewerProps = {
    entries: any[];
};

export const RawLogViewer = (props: RawLogViewerProps) => {
    return (
        <Table>
            <thead>
                <tr>
                    <th>Tick</th>
                    <th>Type</th>
                    <th>Payload</th>
                </tr>
            </thead>
            <tbody>
                {props.entries?.map((entry) => (
                    <RawLogEntry entry={entry} />
                ))}
            </tbody>
        </Table>
    );
};
