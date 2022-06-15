import { List } from '@mui/material';
import { RecorderProvider } from '../context/RecorderContext';
import RecorderWord from './RecorderWord';

interface WordScaffoldProps {
    mask: boolean[],
    words: string[]
}

const WordScaffold = ({ mask, words }: WordScaffoldProps) => {

    return (
        <RecorderProvider>
            <List>
                {
                    words.map(
                        (value: string, index: number) =>
                            mask[index] ? null : <RecorderWord key={index} index={index} word={value} />
                    )
                }
            </List>
        </RecorderProvider>
    )
}

export default WordScaffold