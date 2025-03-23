import {
	createContext,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

interface PeerContextProps {
	peers: Record<string, RTCPeerConnection>;
	peersRef: React.MutableRefObject<Record<string, RTCPeerConnection>>;
	remoteStreamsRef: React.MutableRefObject<MediaStream[]>;
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
}

const PeerContext = createContext<PeerContextProps>({
	peers: {},
	peersRef: {
		current: {},
	},
	remoteStreamsRef: {
		current: [],
	},
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

	const [peers, setPeers] = useState<Record<string, RTCPeerConnection>>({});

	// const peer = useMemo(() => new RTCPeerConnection(), []);
	const remoteStreamsRef = useRef<MediaStream[]>([]);

	const createOffer = useCallback(
		async (remoteUser: string, socket: WebSocket, currentUser: string) => {
			const pc = new RTCPeerConnection({
				iceServers: [
					{
						urls: "stun:stun.l.google.com:19302",
					},
				],
				iceTransportPolicy: "all",
				bundlePolicy: "balanced",
				rtcpMuxPolicy: "require",
				iceCandidatePoolSize: 0,
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

			pc.addEventListener("negotiationneeded", () => {
				const offer = pc.localDescription;
				socket.send(
					JSON.stringify({
						type: "receive-offer",
						data: {
							offer,
							to: remoteUser,
							from: currentUser,
						},
					})
				);
			});

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
			const pc = new RTCPeerConnection({
				iceServers: [
					{
						urls: "stun:stun.l.google.com:19302",
					},
				],
				iceTransportPolicy: "all",
				bundlePolicy: "balanced",
				rtcpMuxPolicy: "require",
				iceCandidatePoolSize: 0,
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
			pc.addEventListener("negotiationneeded", () => {
				const offer = pc.localDescription;
				socket.send(
					JSON.stringify({
						type: "receive-offer",
						data: {
							offer,
							to: remoteUser,
							from: currentUser,
						},
					})
				);
			});

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
		[peersRef.current]
	);

	const sendStream = useCallback(
		(stream: MediaStream, memberId: string) => {
			const pc = peersRef.current[memberId];

			const _tracks = stream.getTracks();
			for (const track of _tracks) {
				const existSender = pc.getSenders();
				const trackAlreadyAdded = existSender.some(
					(sender) => sender.track === track
				);
				if (!trackAlreadyAdded) {
					pc.addTrack(track, stream);
				}
			}
			// const tracks = stream.getTracks();
			// for (const track of tracks) {
			// 	peer.addTrack(track, stream);
			// }
		},
		[peersRef.current]
	);

	const handleTrackEvent = useCallback(
		(event: RTCTrackEvent) => {
			const streams = event.streams;

			remoteStreamsRef.current = [...remoteStreamsRef.current, streams[0]];
		},
		[remoteStreamsRef.current]
	);

	useEffect(() => {
		Object.values(peersRef.current).forEach((peer) => {
			console.log(remoteStreamsRef.current);
			peer.addEventListener("track", handleTrackEvent);
		});
		return () => {
			Object.values(peersRef.current).forEach((peer) => {
				peer.removeEventListener("track", handleTrackEvent);
			});
		};
	}, [peersRef.current]);

	return (
		<PeerContext.Provider
			value={{
				peers,
				peersRef,
				createOffer,
				createAnswer,
				setRemoteAnswer,
				sendStream,
				remoteStreamsRef,
			}}
		>
			{children}
		</PeerContext.Provider>
	);
};

export default PeerProvider;
