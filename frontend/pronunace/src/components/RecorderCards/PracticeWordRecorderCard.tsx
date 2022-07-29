import { Button, CircularProgress, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Tooltip } from '@mui/material'
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';

import React, { useContext, useState } from 'react'
import RecorderContext from '../../context/RecorderContext';
import AuthContext from '../../context/AuthContext';
import { APPEAL_WORD_TEXT, GET_MISPRONUNCIATION_WORDMASK_PRACTICE } from '../../constants/api_url';

interface PracticeWordRecorderCardProps {
	index: number,
	word: string
}

enum AnswerStatus {
	UNANSWERED = 0,
	CORRECT = 1,
	INCORRECT = 2,
}

const PracticeWordRecorderCard = ({ index, word }: PracticeWordRecorderCardProps) => {

	const { startRecording, stopRecording } = useContext(RecorderContext)
	let { authTokens, logoutUser } = useContext(AuthContext)
	const [isRecording, setIsRecording] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [answerStatus, setAnswerStatus] = useState<AnswerStatus>(AnswerStatus.UNANSWERED)
	const [pronounced, setPronounced] = useState(false)
	const [isAppealed, setIsAppealed] = useState(false)

	const getMask = async (buffer: Buffer, blob: Blob) => {

		let formData = new FormData()
		const soundFile = blob
		console.log(soundFile)

		formData.append('sound_file', soundFile)
		formData.append('word', String(word))
		try {
			setIsLoading(true)
			let response = await fetch(GET_MISPRONUNCIATION_WORDMASK_PRACTICE, {
				method: 'POST',
				headers: { 'Authorization': 'Bearer ' + String(authTokens.access) },
				body: formData
			})
			let data = await response.json()

			if (response.status === 200) {
				setPronounced(true)

				setAnswerStatus(data.mask[0] === true ? AnswerStatus.CORRECT : AnswerStatus.INCORRECT)
			}
			else if (response.statusText === "Unauthorized") { logoutUser() }
		} catch { }
		finally {
			setIsLoading(false)
		}
	}

	const appealWordWithText = async (text: string) => {

        let formData = new FormData()

        formData.append('word', text)

        try {
            setIsLoading(true)
            let response = await fetch(APPEAL_WORD_TEXT, {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + String(authTokens.access) },
                body: formData
            })
            let data = await response.json()

            if (response.status === 200) {

                if (data.status === 'done') {
                    setIsAppealed(true)
                }
            }
            else if (response.statusText === "Unauthorized") { logoutUser() }
        }
        catch { }
        finally {
            setIsLoading(false)
        }
    }

	return (
		<Paper>
			<ListItem
				key={index}
				secondaryAction={
					<Tooltip title="correct pronunciation">
						<IconButton
							edge="end"
							aria-label="comments"
							size="large"
							color="success"
						>
							<PlayCircleFilledIcon />
						</IconButton>
					</Tooltip>}
			>
				<ListItemButton role={undefined} onClick={() => { }} dense>
					<ListItemIcon>

						<>
							{
								(isLoading) ? <CircularProgress /> :
									(!isRecording) ? (
										<Tooltip title="start recording">
											<IconButton
												aria-label="start recording audio"
												onClick={() => { startRecording(); setIsRecording(true) }}
												size="large"
												color="error">
												<MicIcon fontSize="inherit" />
											</IconButton>
										</Tooltip>
									) : (
										<Tooltip title="stop recording">
											<IconButton
												aria-label="stop recording audio"
												onClick={() => { stopRecording(getMask); setIsRecording(false) }}
												size="large"
												color="secondary">
												<MicOffIcon fontSize="inherit" />
											</IconButton>
										</Tooltip>
									)
							}
						</>
					</ListItemIcon>
					<ListItemText
						primaryTypographyProps={
							answerStatus === AnswerStatus.UNANSWERED ?
								{} :
								answerStatus === AnswerStatus.INCORRECT ?
									{ fontWeight: 'bold', color: "error.main" } :
									{ fontWeight: 'bold', color: "primary.main" }
						}
						id={String(index)}
						primary={word}
					/>
				</ListItemButton>
                <Button
                    disabled={!pronounced || isAppealed}
                    variant="text"
                    onClick={() => { appealWordWithText(String(word)) }}
                >
                    Appeal Word
                </Button>
			</ListItem>
		</Paper>
	)
}

export default PracticeWordRecorderCard