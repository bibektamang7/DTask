import { usePeerConnection } from "@/context/PeerContex";
import { useSocket } from "@/context/SocketContex";
import { Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
		peers,
		peersRef,
		createAnswer,
		createOffer,
		setRemoteAnswer,
		sendStream,
		remoteStreamsRef,
	} = usePeerConnection();
	const socket = useSocket();

	const [isVideo, setIsVideo] = useState(true);
	const [isAudio, setIsAudio] = useState(true);

	const [_, forceUpdate] = useState(0);

	const currentUserRef = useRef<MediaStream | null>(null);

	const handleCallHangUp = useCallback(() => {
		currentUserRef.current?.getTracks().forEach((track) => {
			track.stop();
			if (currentUserRef.current) {
				currentUserRef.current.removeTrack(track);
			}
		});
		onHangUp();
	}, []);

	const getCurrentUserMedia = useCallback(async () => {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: callType === "Video",
		});
		currentUserRef.current = stream;
		forceUpdate(1);
	}, []);


	const handleSendOffer = useCallback(
		async (callAcceptedUser: string) => {
			const offer = await createOffer(callAcceptedUser, socket!, callFrom);

			socket?.send(
				JSON.stringify({
					type: "receive-offer",
					data: {
						to: callAcceptedUser,
						offer,
						from: callFrom,
					},
				})
			);
		},
		[socket]
	);

	const handleSendAnswer = useCallback(
		async (offer: RTCSessionDescriptionInit, receiver: string) => {
			const ans = await createAnswer(offer, receiver, socket!, callFrom);

			socket?.send(
				JSON.stringify({
					type: "receive-answer",
					data: {
						answer: ans,
						from: callFrom,
						to: receiver,
					},
				})
			);
		},
		[socket]
	);

	const handleSetAnswer = useCallback(
		(answer: RTCSessionDescriptionInit, sender: string) => {
			setRemoteAnswer(answer, sender);
			console.log("this stream in hande Set ansee", currentUserRef.current);
			sendStream(currentUserRef.current!, sender);
		},
		[currentUserRef]
	);

	const handleSetCandidate = useCallback(
		(candidate: RTCIceCandidate, remoteUser: string) => {
			const pc = peersRef.current[remoteUser];
			pc.addIceCandidate(new RTCIceCandidate(candidate));
		},
		[peersRef.current]
	);

	useEffect(() => {
		getCurrentUserMedia();
		return () => {
			currentUserRef.current?.getTracks().forEach((track) => {
				track.stop();
				currentUserRef.current?.removeTrack(track);
			});
		};
	}, []);

	useEffect(() => {
		if (!socket) return;
		socket.onmessage = (event) => {
			const message = JSON.parse(event.data);
			if (message.type === "send-offer") {
				handleSendOffer(message.data.callAcceptedBy);
			} else if (message.type === "send-answer") {
				handleSendAnswer(message.data.offer, message.data.to);
			} else if (message.type === "set-answer") {
				handleSetAnswer(message.data.answer, message.data.from);
			} else if (message.type === "set-candidate") {
				handleSetCandidate(message.data.candidate, message.data.from);
			}
		};
	}, [socket]);

	return (
		<div className="fixed top-0 left-0 w-full h-full backdrop-blur-md z-10 overflow-y-auto py-16">
			<div className="relative w-full h-full max-w-2xl mx-auto space-y-6 bg-background text-foreground rounded-lg">
				<div className="w-24 h-24 rounded-md">
					<ReactPlayer
						height={`100%`}
						width={`100%`}
						url={currentUserRef.current!}
						playing
					/>
				</div>
				{remoteStreamsRef.current.map((stream) => (
					<div className="w-24 h-24 rounded-md">
						<ReactPlayer
							height={`100%`}
							width={`100%`}
							url={stream}
							playing
						/>
					</div>
				))}
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
