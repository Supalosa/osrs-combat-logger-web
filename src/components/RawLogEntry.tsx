import { Table } from "semantic-ui-react";

type RawLogEntryProps = {
    entry: any;
}

export const RawLogEntry = (props: RawLogEntryProps) => {
    const { entry } = props;
    return <Table.Row>
        <Table.Cell>{entry.tick}</Table.Cell>
        <Table.Cell>{entry.type}</Table.Cell>
        <Table.Cell>{JSON.stringify(entry.payload)}</Table.Cell>
    </Table.Row>;
}