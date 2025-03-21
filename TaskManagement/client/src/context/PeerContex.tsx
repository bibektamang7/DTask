import {
	createContext,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

interface PeerContextProps {
	peer: RTCPeerConnection | null;
	createAnswer: (
		offer: RTCSessionDescriptionInit
	) => Promise<RTCSessionDescriptionInit>;
	createOffer: () => Promise<RTCSessionDescriptionInit>;
	setRemoteAnswer: (answer: RTCSessionDescriptionInit) => Promise<void>;
	sendStream: (stream: MediaStream) => void;
	callOpen: CallOpen;
	setCallOpen: React.Dispatch<React.SetStateAction<CallOpen>>;
	remoteStreams: MediaStream[];
}

const PeerContext = createContext<PeerContextProps>({
	peer: null,
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
	callOpen: "None",
	setCallOpen: function (value: SetStateAction<CallOpen>): void {
		throw new Error("Function not implemented.");
	},
	remoteStreams: [],
});

type CallOpen = "Video" | "Audio" | "None";

export const usePeerConnection = () => useContext(PeerContext);

const PeerProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [peers, setPeers] = useState<Record<string, RTCPeerConnection>>({});

	const [callOpen, setCallOpen] = useState<CallOpen>("None");
	const peer = useMemo(() => new RTCPeerConnection(), []);
	const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

	const createOffer = useCallback(async () => {
		const currentUser = "hello";
		const pc = new RTCPeerConnection();
		
		const offer = await peer.createOffer();
		await peer.setLocalDescription(offer);
		return offer;
	}, [peer]);

	const createAnswer = useCallback(
		async (offer: RTCSessionDescriptionInit) => {
			await peer.setRemoteDescription(offer);
			const answer = await peer.createAnswer();
			await peer.setLocalDescription(answer);
			return answer;
		},
		[peer]
	);
	const setRemoteAnswer = useCallback(
		async (answer: RTCSessionDescriptionInit) => {
			await peer.setRemoteDescription(answer);
		},
		[peer]
	);

	const sendStream = useCallback((stream: MediaStream) => {
		const tracks = stream.getTracks();
		for (const track of tracks) {
			peer.addTrack(track, stream);
		}
	}, []);

	const handleTrackEvent = useCallback((event: RTCTrackEvent) => {
		const streams = event.streams;

		setRemoteStreams((prev) => [...prev, streams[0]]);
	}, []);

	useEffect(() => {
		peer.addEventListener("track", handleTrackEvent);
		return () => {
			peer.removeEventListener("track", handleTrackEvent);
		};
	}, []);
	return (
		<PeerContext.Provider
			value={{
				peer,
				createOffer,
				createAnswer,
				setRemoteAnswer,
				sendStream,
				callOpen,
				setCallOpen,
				remoteStreams,
			}}
		>
			{children}
		</PeerContext.Provider>
	);
};

export default PeerProvider;
