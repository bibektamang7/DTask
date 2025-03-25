import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

interface PeerContextProps {
	peersRef: React.MutableRefObject<Record<string, RTCPeerConnection>>;
	setRemoteStreams: React.Dispatch<
		React.SetStateAction<Array<{ stream: MediaStream; userId: string }>>
	>;
	createAnswer: (
		offer: RTCSessionDescriptionInit,
		remoteUser: string,
		socket: WebSocket,
		currentUser: string
	) => Promise<RTCSessionDescriptionInit>;
	createOffer: (
		remoteUser: string,
		socket: WebSocket,
		currentUser: string
	) => Promise<RTCSessionDescriptionInit>;
	setRemoteAnswer: (
		answer: RTCSessionDescriptionInit,
		memberId: string
	) => Promise<void>;
	sendStream: (stream: MediaStream, memberId: string) => void;
	remoteStreams: Array<{ stream: MediaStream; userId: string }>;
}

const PeerContext = createContext<PeerContextProps>({
	peersRef: {
		current: {},
	},
	setRemoteStreams: () => [],
	remoteStreams: [],
	createAnswer: async () => {
		throw new Error("Function not implemented.");
	},
	createOffer: async () => {
		throw new Error("Function not implemented.");
	},
	setRemoteAnswer: async () => {
		throw new Error("Function not implemented.");
	},
	sendStream: () => {
		throw new Error("Function not implemented.");
	},
});

export const usePeerConnection = () => useContext(PeerContext);

const PeerProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const peersRef = useRef<Record<string, RTCPeerConnection>>({});

	const [remoteStreams, setRemoteStreams] = useState<
		Array<{ stream: MediaStream; userId: string }>
	>([]);

	const createOffer = useCallback(
		async (remoteUser: string, socket: WebSocket, currentUser: string) => {
			const pc = new RTCPeerConnection({
				iceServers: [
					{
						urls: "stun:stun.l.google.com:19302",
					},
				],
			});
			pc.onicecandidate = (event) => {
				if (event.candidate) {
					socket.send(
						JSON.stringify({
							type: "candidate",
							data: {
								candidate: event.candidate,
								to: remoteUser,
								from: currentUser,
							},
						})
					);
				}
			};

			pc.ontrack = (event) => {
				const stream = event.streams[0];
				if (stream) {
					setRemoteStreams((prevStreams) => {
						const existingStream = prevStreams.find(
							(s) => s.userId === remoteUser
						);
						if (existingStream) {
							return prevStreams;
						}
						return [...prevStreams, { stream, userId: remoteUser }];
					});
				}
			};
			pc.onnegotiationneeded = async () => {
				const offer = await pc.createOffer();
				await pc.setLocalDescription(offer);
				socket.send(
					JSON.stringify({
						type: "nego-needed",
						data: {
							offer,
							to: remoteUser,
							from: currentUser,
						},
					})
				);
			};

			// pc.addEventListener("negotiationneeded", () => {
			// 	const offer = pc.localDescription;
			// 	socket.send(
			// 		JSON.stringify({
			// 			type: "nego-needed",
			// 			data: {
			// 				offer,
			// 				to: remoteUser,
			// 				from: currentUser,
			// 			},
			// 		})
			// 	);
			// });

			const _offer = await pc.createOffer();
			await pc.setLocalDescription(_offer);
			peersRef.current[remoteUser] = pc;
			// setPeers((prev) => ({ ...prev, [remoteUser]: pc }));
			return _offer;

			// const offer = await peer.createOffer();
			// await peer.setLocalDescription(offer);
			// return offer;
		},
		[peersRef.current]
	);

	const createAnswer = useCallback(
		async (
			offer: RTCSessionDescriptionInit,
			remoteUser: string,
			socket: WebSocket,
			currentUser: string
		) => {
			// {
			// 	iceServers: [
			// 		{
			// 			urls: "stun:stun.l.google.com:19302",
			// 		},
			// 	],
			// 	iceTransportPolicy: "all",
			// 	bundlePolicy: "balanced",
			// 	rtcpMuxPolicy: "require",
			// 	iceCandidatePoolSize: 0,
			// }
			const pc = new RTCPeerConnection({
				iceServers: [
					{
						urls: "stun:stun.l.google.com:19302",
					},
				],
				iceTransportPolicy: "all",
				bundlePolicy: "balanced",
				rtcpMuxPolicy: "require",
			});

			pc.onicecandidate = (event) => {
				if (event.candidate) {
					socket.send(
						JSON.stringify({
							type: "candidate",
							data: {
								candidate: event.candidate,
								to: remoteUser,
								from: currentUser,
							},
						})
					);
				}
			};

			pc.ontrack = (event) => {
				const stream = event.streams[0];
				if (stream) {
					setRemoteStreams((prevStreams) => {
						const existingStream = prevStreams.find(
							(s) => s.userId === remoteUser
						);
						if (existingStream) {
							return prevStreams;
						}
						return [...prevStreams, { stream, userId: remoteUser }];
					});
				}
			};
			pc.onnegotiationneeded = async () => {
				console.log("negotiation need in answer");
				const offer = await pc.createOffer();
				await pc.setLocalDescription(offer);
				socket.send(
					JSON.stringify({
						type: "nego-needed",
						data: {
							offer,
							to: remoteUser,
							from: currentUser,
						},
					})
				);
			};

			// 	socket.send(
			// 		JSON.stringify({
			// 			type: "nego-needed",
			// 			data: {
			// 				offer,
			// 				to: remoteUser,
			// 				from: currentUser,
			// 			},
			// 		})
			// 	);
			// });

			await pc.setRemoteDescription(new RTCSessionDescription(offer));
			const _answer = await pc.createAnswer();
			await pc.setLocalDescription(_answer);
			peersRef.current[remoteUser] = pc;
			// setPeers((prev) => ({ ...prev, [remoteUser]: pc }));
			return _answer;

			// await peer.setRemoteDescription(offer);
			// const answer = await peer.createAnswer();
			// await peer.setLocalDescription(answer);
			// return answer;
		},
		[peersRef.current]
	);
	const setRemoteAnswer = useCallback(
		async (answer: RTCSessionDescriptionInit, memberId: string) => {
			const pc = peersRef.current[memberId];
			if (
				pc.signalingState === "have-local-offer" ||
				pc.signalingState === "have-remote-offer"
			) {
				await pc.setRemoteDescription(answer);
			}
		},
		[peersRef.current, createAnswer, createOffer]
	);

	const sendStream = useCallback(
		(stream: MediaStream, memberId: string) => {
			const pc = peersRef.current[memberId];

			const _tracks = stream.getTracks();
			for (const track of _tracks) {
				pc.addTrack(track, stream);
			}
		},
		[peersRef.current]
	);

	useEffect(() => {
		console.log(remoteStreams, "this is remote sterams");
	}, [remoteStreams]);
	return (
		<PeerContext.Provider
			value={{
				peersRef,
				createOffer,
				createAnswer,
				setRemoteAnswer,
				sendStream,
				remoteStreams,
				setRemoteStreams,
			}}
		>
			{children}
		</PeerContext.Provider>
	);
};

export default PeerProvider;
