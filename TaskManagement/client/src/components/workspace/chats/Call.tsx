import { usePeerConnection } from "@/context/PeerContex";
import { useSocket } from "@/context/SocketContex";
import { Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";

type CallType = "Video" | "Audio";

interface CallProps {
	chatId: string;
	chatMembers: string[];
	callType: CallType;
	callFrom: string;
	onHangUp: () => void;
}

const Call: React.FC<CallProps> = ({
	chatId,
	chatMembers,
	callType,
	callFrom,
	onHangUp,
}) => {
	const {
		peer,
		createAnswer,
		createOffer,
		setRemoteAnswer,
		setCallOpen,
		sendStream,
		remoteStreams,
	} = usePeerConnection();
	const socket = useSocket();
	const currentUser = localStorage.getItem("currentUser");

	const [isVideo, setIsVideo] = useState(true);
	const [isAudio, setIsAudio] = useState(true);

	const [currentUserStream, setCurrentUserStream] =
		useState<MediaStream | null>(null);

	const handleNewMemberJoined = useCallback(async () => {
		const offer = await createOffer();
		socket?.send(
			JSON.stringify({
				type: "call-members",
				data: {
					callType,
					from: callFrom,
					chatMembers,
					chatId,
					offer,
				},
			})
		);
	}, []);

	const handleCallAccepted = useCallback(
		async (answer: RTCSessionDescriptionInit) => {
			await setRemoteAnswer(answer);
			sendStream(currentUserStream!);
		},
		[]
	);

	const handleCallHangUp = useCallback(() => {
		currentUserStream?.getTracks().forEach((track) => {
			track.stop();
			currentUserStream.removeTrack(track);
		});
		onHangUp();
	}, []);

	const getCurrentUserMedia = useCallback(async () => {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: callType === "Video",
		});
		setCurrentUserStream(stream);
	}, []);

	const handleNegotiationNeededEvent = useCallback(() => {
		const offer = peer?.localDescription;
		socket?.send(
			JSON.stringify({
				type: "call-members",
				data: {
					callType,
					from: callFrom,
					chatMembers,
					chatId,
					offer,
				},
			})
		);
	}, []);

	useEffect(() => {
		peer?.addEventListener("negotiationneeded", handleNegotiationNeededEvent);
		return () => {
			peer?.removeEventListener(
				"negotiationneeded",
				handleNegotiationNeededEvent
			);
		};
	}, []);

	useEffect(() => {
		handleNewMemberJoined();
		getCurrentUserMedia();
		return () => {
			currentUserStream?.getTracks().forEach((track) => {
				track.stop();
				currentUserStream.removeTrack(track);
			});
		};
	}, []);

	useEffect(() => {
		if (!socket) return;
		socket.onmessage = (event) => {
			const message = JSON.parse(event.data);
			if (message.type === "call-accepted") {
				const answer = message.data.answer;
				console.log("getting answer form ");
				handleCallAccepted(answer);
			}
		};
	}, [socket]);
	return (
		<div className="fixed top-0 left-0 w-full h-full backdrop-blur-md z-10 overflow-y-auto py-16">
			<div className="relative w-full h-full max-w-2xl mx-auto space-y-6 bg-background text-foreground rounded-lg">
				<div>
					<ReactPlayer
						url={currentUserStream!}
						playing
					/>
				</div>
				<div className="w-full h-full">
					{remoteStreams.map((stream) => (
						<ReactPlayer
							key={stream.id}
							url={stream}
						/>
					))}
				</div>
				<div className="absolute bottom-10 left-0 w-full flex items-center justify-center gap-16">
					{isVideo ? (
						<div
							onClick={() => setIsVideo(false)}
							className="hover:cursor-pointer bg-gray-700 rounded-full p-2"
						>
							<Video />
						</div>
					) : (
						<div
							onClick={() => setIsVideo(true)}
							className="hover:cursor-pointer bg-gray-700 rounded-full p-2"
						>
							<VideoOff />
						</div>
					)}
					<div
						onClick={() => handleCallHangUp()}
						className="hover:cursor-pointer bg-red-500  rounded-full p-2"
					>
						<Phone className="rotate-[135deg]" />
					</div>
					{isAudio ? (
						<div
							onClick={() => setIsAudio(false)}
							className="hover:cursor-pointer bg-gray-700  rounded-full p-2"
						>
							<Mic />
						</div>
					) : (
						<div
							onClick={() => setIsAudio(true)}
							className="hover:cursor-pointer bg-gray-700 bg-transparent rounded-full p-2"
						>
							<MicOff />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Call;
