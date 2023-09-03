import { useState } from "react";
import { Button, Header, Input, Progress, Segment } from "semantic-ui-react";

type LogInputProps = {
    onLogUploaded: (logContents: string) => void;
}

type Progress = {
    loaded: number;
    total: number;
}

export const LogInput = ({ onLogUploaded }: LogInputProps) => {

    const [files, setFiles] = useState<FileList | null>(null);
    const [progress, setProgress] = useState<Progress | null>(null);
    const [uploaded, setUploaded] = useState(false);

    const readFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(event?.target?.files);
    }

    const onAnalyze = () => {
        const file: File | undefined = files?.[0];
        setUploaded(false);
        if (file) {
            const reader: FileReader = new FileReader();
            reader.readAsText(file);
            reader.addEventListener('progress', ({ loaded, total }) => {
                setProgress({ loaded, total });
            });
            reader.addEventListener('loadend', () => {
                setProgress(null);
            });
            reader.addEventListener('load', () => {
                if (reader.result != null) {
                    setUploaded(true);
                    onLogUploaded(reader.result.toString().trim());
                }
            })
        }
    }



    return <Segment>
        <Header as='h2'>Analyze an OSRS Combat Log</Header>
        <p>These files are generated by the Combat Logger plugin in Runelite. Find it in the Plugin Hub!</p>
        <Input type="file" inverted onChange={readFile} />
        <Button content="Analyze" color="blue" compact onClick={onAnalyze} disabled={progress != null} />
        {!!progress && <Progress size="small" color="green" label="Reading log..." active value={progress.loaded} total={progress.total} />}
        {uploaded && <Progress size="small" color="green" label="Done" value={1} total={1} />}
    </Segment>
};