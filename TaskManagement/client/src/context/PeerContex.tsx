import { createContext, useCallback, useContext, useMemo } from "react";

interface PeerContextProps {
	peer: RTCPeerConnection | null;
	createAnswer: (
		offer: RTCSessionDescriptionInit
	) => Promise<RTCSessionDescriptionInit>;
	createOffer: () => Promise<RTCSessionDescriptionInit>;
}

const PeerContext = createContext<PeerContextProps>({
	peer: null,
	createAnswer: async () => {
		throw new Error("Function not implemented.");
	},
	createOffer: async () => {
		throw new Error("Function not implemented.");
	},
});

export const usePeerConnection = () => useContext(PeerContext);

const PeerProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const peer = useMemo(() => new RTCPeerConnection(), []);

	const createOffer = useCallback(async () => {
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

	return (
		<PeerContext.Provider value={{ peer, createOffer, createAnswer }}>
			{children}
		</PeerContext.Provider>
	);
};

export default PeerProvider;
