import { List, ListItem } from '@mui/material';

interface IncorrectWordsProps {
    mask: boolean[],
    words: string[]
}

const IncorrectWords = ({ mask, words }: IncorrectWordsProps) => {

    return (
        <List>
            {
                words.map(
                    (value: string, index: number) =>
                        mask[index] ? null : <ListItem key={index}>{value}</ListItem>
                )
            }
        </List>
    )
}

export default IncorrectWords