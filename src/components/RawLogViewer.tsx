import { Table } from "semantic-ui-react";
import { RawLogEntry } from "./RawLogEntry";

type RawLogViewerProps = {
    entries: any[];
}

export const RawLogViewer = (props: RawLogViewerProps) => {

    return <Table celled>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Tick</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Payload</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {props.entries?.map((entry) => <RawLogEntry entry={entry} />)}
        </Table.Body>
    </Table>
}