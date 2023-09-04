import { Table, Image } from "semantic-ui-react";

type RawLogEntryProps = {
    entry: any;
}

const renderExtra = (entry: any) => {
    const { type, payload } = entry;
    if (type === 'LogPlayerMoved') {
        const { plane, regionId } = payload.newPosition;
        return <Image src={`https://cdn-osrs-combat-logs.netlify.app/${plane}/region-${regionId}.png`} />;
    }
    return null;
}

export const RawLogEntry = (props: RawLogEntryProps) => {
    const { entry } = props;
    const extra = renderExtra(entry);
    return <Table.Row>
        <Table.Cell>{entry.tick}</Table.Cell>
        <Table.Cell>{entry.type}</Table.Cell>
        <Table.Cell>{JSON.stringify(entry.payload)}{extra}</Table.Cell>
    </Table.Row>;
}