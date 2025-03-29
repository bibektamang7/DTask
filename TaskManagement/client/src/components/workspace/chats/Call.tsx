import { usePeerConnection } from "@/context/PeerContex";
import { useSocket } from "@/context/SocketContex";
import { cn } from "@/lib/utils";
import { Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";

type CallType = "Video" | "Audio";

interface CallProps {
	chatId: string;
	chatMembers: string[];
	callType: CallType;
	callFrom: string;
	onHangUp: () => void;
}

const Call: React.FC<CallProps> = ({ callType, callFrom, onHangUp }) => {
	const {
		peersRef,
		createAnswer,
		createOffer,
		setRemoteAnswer,
		sendStream,
		remoteStreams,
		setRemoteStreams,
	} = usePeerConnection();
	const socket = useSocket();

	const [isVideo, setIsVideo] = useState(true);
	const [isAudio, setIsAudio] = useState(true);
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);

	const toggleMedia = (type: "video" | "audio") => {
		if (localStream) {
			localStream.getTracks().forEach((track) => {
				if (track.kind === type) track.enabled = !track.enabled;
			});
		}
		type === "video"
			? setIsVideo((prev) => !prev)
			: setIsAudio((prev) => !prev);
	};

	const cleanupMedia = async () => {
		localStream?.getTracks().forEach((track) => {
			console.log(track, "this is tarac to be colose");
			track.stop();
			if (localStream) {
				localStream.removeTrack(track);
			}
		});
		setLocalStream(null);
		onHangUp();

		await navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				stream.getTracks().forEach((track) => track.stop());
			});
		socket?.send(
			JSON.stringify({
				type: "user-left",
				data: {
					userId: callFrom,
				},
			})
		);
	};

	const getUserMedia = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: callType === "Video",
			});
			setLocalStream(stream);
			return stream;
		} catch (error) {
			console.error("Error accessing media devices:", error);
			return null;
		}
	};

	const sendOffer = async (receiver: string) => {
		const offer = await createOffer(receiver, socket!, callFrom);
		socket?.send(
			JSON.stringify({
				type: "receive-offer",
				data: { to: receiver, offer, from: callFrom },
			})
		);
	};

	const sendAnswer = async (
		offer: RTCSessionDescriptionInit,
		receiver: string
	) => {
		const answer = await createAnswer(offer, receiver, socket!, callFrom);
		socket?.send(
			JSON.stringify({
				type: "receive-answer",
				data: { answer, from: callFrom, to: receiver },
			})
		);
	};

	const setAnswer = async (
		answer: RTCSessionDescriptionInit,
		sender: string
	) => {
		setRemoteAnswer(answer, sender);
		const stream = localStream ?? (await getUserMedia());
		if (stream) sendStream(stream, sender);
	};

	const setCandidate = async (
		candidate: RTCIceCandidate,
		remoteUser: string
	) => {
		await peersRef.current[remoteUser]?.addIceCandidate(
			new RTCIceCandidate(candidate)
		);
	};

	const handleNegoOffer = async (
		offer: RTCSessionDescriptionInit,
		receiver: string
	) => {
		const pc = peersRef.current[receiver];
		if (pc) {
			await pc.setRemoteDescription(offer);
			const answer = await pc.createAnswer();
			await pc.setLocalDescription(answer);
			socket?.send(
				JSON.stringify({
					type: "nego-answer",
					data: { answer, from: callFrom, to: receiver },
				})
			);
		}
	};

	const handleSetNegoAnswer = async (
		answer: RTCSessionDescriptionInit,
		sender: string
	) => {
		await peersRef.current[sender]?.setRemoteDescription(answer);
	};

	const addStreamTrack = async () => {
		const stream = localStream ?? (await getUserMedia());
		if (!stream) return;

		remoteStreams.forEach(({ stream: remoteStream, userId }) => {
			const pc = peersRef.current[userId];
			remoteStream.getTracks().forEach((track) => pc?.addTrack(track, stream));
		});
	};

	const handleUserLeft = (userId: string) => {
		console.log("user left what to do");
		setRemoteStreams((prev) =>
			prev.filter((stream) => stream.userId !== userId)
		);
	};

	useEffect(() => {
		getUserMedia();
		return () => {
			cleanupMedia();
		};
	}, []);

	useEffect(() => {
		if (!socket) return;
		const handleMessage = (event: MessageEvent) => {
			const message = JSON.parse(event.data);
			switch (message.type) {
				case "send-offer":
					sendOffer(message.data.callAcceptedBy);
					break;
				case "send-answer":
					sendAnswer(message.data.offer, message.data.to);
					break;
				case "set-answer":
					setAnswer(message.data.answer, message.data.from);
					break;
				case "set-candidate":
					setCandidate(message.data.candidate, message.data.from);
					break;
				case "nego-offer":
					handleNegoOffer(message.data.offer, message.data.to);
					break;
				case "set-NegoAnswer":
					handleSetNegoAnswer(message.data.answer, message.data.from);
					break;
				case "user-leave":
					handleUserLeft(message.data.userId);
					break;
			}
		};
		socket.addEventListener("message", handleMessage);
		return () => socket.removeEventListener("message", handleMessage);
	}, [socket]);

	// Add remote streams
	useEffect(() => {
		if (remoteStreams.length > 0) addStreamTrack();
	}, [remoteStreams]);

	return (
		<div className="fixed top-0 left-0 w-full h-full backdrop-blur-md z-10 overflow-hidden">
			<div className="relative w-full h-full max-w-2xl mx-auto space-y-6 bg-background text-foreground rounded-lg">
				<div
					className={cn(
						"grid relative items-center justify-center gap-4",
						remoteStreams.length === 1
							? "grid-rows-1"
							: "grid-rows-[200px_minmax(900px, 1fr)_100px]"
					)}
				>
					<div
						className={cn(
							"rounded-full",
							remoteStreams.length === 1
								? "w-40 h-fit absolute left-4 top-4"
								: "w-full h-full"
						)}
					>
						{localStream && (
							<ReactPlayer
								height={`100%`}
								width={`100%`}
								style={{ padding: 0 }}
								url={localStream!}
								playing
							/>
						)}
					</div>
					{remoteStreams.map((remoteStream) => (
						<div
							key={remoteStream.userId}
							className={cn("w-full h-full")}
						>
							<ReactPlayer
								height={`100%`}
								width={`100%`}
								playing
								url={remoteStream.stream}
							/>
						</div>
					))}
					<div className="absolute bottom-10 left-0 w-full flex items-center justify-center gap-16">
						{isVideo ? (
							<div
								onClick={() => toggleMedia("video")}
								className="hover:cursor-pointer bg-gray-700 rounded-full p-2"
							>
								<Video />
							</div>
						) : (
							<div
								onClick={() => toggleMedia("video")}
								className="hover:cursor-pointer bg-gray-700 rounded-full p-2"
							>
								<VideoOff />
							</div>
						)}
						<div
							onClick={() => cleanupMedia()}
							className="hover:cursor-pointer bg-red-500  rounded-full p-2"
						>
							<Phone className="rotate-[135deg]" />
						</div>
						{isAudio ? (
							<div
								onClick={() => toggleMedia("audio")}
								className="hover:cursor-pointer bg-gray-700  rounded-full p-2"
							>
								<Mic />
							</div>
						) : (
							<div
								onClick={() => toggleMedia("audio")}
								className="hover:cursor-pointer bg-gray-700 bg-transparent rounded-full p-2"
							>
								<MicOff />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Call;
