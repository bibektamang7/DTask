import { usePeerConnection } from "@/context/PeerContex";
import { useSocket } from "@/context/SocketContex";
import React, { useCallback, useEffect, useState } from "react";
import { data } from "react-router";

type CallType = "Video" | "Audio";

interface CallProps {
	chatId: string;
	chatMembers: string[];
	callType: CallType;
	callFrom: string;
}

const Call: React.FC<CallProps> = ({
	chatId,
	chatMembers,
	callType,
	callFrom,
}) => {
	const { peer, createAnswer, createOffer } = usePeerConnection();
	console.log(chatId, chatMembers, callType);
	const socket = useSocket();

	const [currentUserStream, setCurrentUserStream] =
		useState<MediaStream | null>(null);

	const handleNewMemberJoined = useCallback(async () => {
		const offer = await createOffer();
		socket?.send(
			JSON.stringify({
				type: "call-members",
				data: {
					from: callFrom,
					chatMembers,
					chatId,
					offer,
				},
			})
		);
	}, []);

	useEffect(() => {}, []);
	useEffect(() => {
		if (!socket) return;
	}, [socket]);
	return <div>Call</div>;
};

export default Call;
