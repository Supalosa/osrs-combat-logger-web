import { useState } from "react";
import { Button, Container, Header, Input, Progress } from "semantic-ui-react";

type LogInputProps = {
    onLogUploaded: (logContents: string) => void;
}

type Progress = {
    loaded: number;
    total: number;
}

export const LogInput = ({onLogUploaded}: LogInputProps) => {
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
            reader.addEventListener('progress', ({loaded, total}) => {
                setProgress({loaded, total});
            });
            reader.addEventListener('loadend', () => {
                setProgress(null);
            });
            reader.addEventListener('load', () => {
                if (reader.result) {
                    setUploaded(true);
                    onLogUploaded(reader.result.toString().trim());
                }
            })
        }
    }


    return <Container>
        <Header as='h2'>Upload a log</Header>
        <Input type="file" inverted onChange={readFile} />
        <Button content="Analyze" color="blue" compact onClick={onAnalyze} disabled={progress != null} />
        {!!progress && <Progress color="green" label="Reading log..." active value={progress.loaded} total={progress.total} />}
        {uploaded && <Progress color="green" label="Ready" value={1} total={1} />}
    </Container>
};