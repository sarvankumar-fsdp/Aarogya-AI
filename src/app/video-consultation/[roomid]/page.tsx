"use client";

import { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { v4 as uuid } from "uuid";
import useUser from "@/hooks/useUser";
import { useParams } from "next/navigation";

export default function Room() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { fullName } = useUser();
    const params = useParams();
    const roomID = typeof params?.roomid === "string" ? params.roomid : "";
    const hasJoined = useRef(false); // ✅ to prevent repeat

    useEffect(() => {
        if (!roomID || hasJoined.current) return;

        hasJoined.current = true; // ✅ flag set to prevent repeat

        const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!;
        const userID = uuid();
        const userName = fullName || "User_" + userID.slice(0, 5);

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomID,
            userID,
            userName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
            container: containerRef.current!,
            scenario: {
                mode: ZegoUIKitPrebuilt.VideoConference,
            },
            sharedLinks: [
                {
                    name: "Copy Link",
                    url: `${window.location.origin}/video-consultation/${roomID}`,
                },
            ],
            showScreenSharingButton: true,
            showPreJoinView: true,
        });
    }, [roomID, fullName]);

    return <div ref={containerRef} className="w-full h-screen bg-black" />;
}
