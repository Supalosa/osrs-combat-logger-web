import { Container } from "semantic-ui-react"

type LogProps = {
    log: string;
}

export const Log = (props: LogProps) => {
    return <Container>
        <p>hello world {props.log}</p>
    </Container>
}