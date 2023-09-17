import { Image } from "@mantine/core";

type RawLogEntryProps = {
    entry: any;
};

const renderExtra = (entry: any) => {
    const { type, payload } = entry;
    if (type === "LogPlayerMoved") {
        const { plane, regionId } = payload.newPosition;
        return (
            <Image
                src={`https://cdn-osrs-combat-logs.netlify.app/${plane}/region-${regionId}.png`}
            />
        );
    }
    return null;
};

export const RawLogEntry = (props: RawLogEntryProps) => {
    const { entry } = props;
    const extra = renderExtra(entry);
    return (
        <tr>
            <td>{entry.tick}</td>
            <td>{entry.type}</td>
            <td>
                {JSON.stringify(entry.payload)}
                {extra}
            </td>
        </tr>
    );
};
