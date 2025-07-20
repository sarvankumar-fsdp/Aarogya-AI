"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { Loader2, Undo2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function VideoConsultationLobby() {
  const router = useRouter();
  const [roomID, setRoomID] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleJoin = () => {
    if (!roomID) return;
    setLoading(true);
    router.push(`/video-consultation/${roomID}`);
  };

  const handleCreate = () => {
    setLoading(true);
    router.push(`/video-consultation/${uuid()}`);
  };

  return (
    <div className="sm:max-w-[95vw] md:max-w-2xl mx-auto dark text-white mt-10 space-y-6 px-4">
      <Card>
        <CardContent className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center gap-2">
            <a
              href="/dashboard"
              className="hover:underline font-extrabold text-xl hover:text-cyan-400 flex items-center"
            >
              <Undo2 className="size-4 mr-1" />

            </a>
            <span className="text-xl font-bold">Video Consultation</span>
          </div>

          {/* Room ID Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Enter Room ID</Label>
            <Input
              ref={inputRef}
              type="text"
              placeholder="e.g. abc123xyz"
              value={roomID}
              onChange={(e) => setRoomID(e.target.value)}
              className="bg-gray-800 text-white border-gray-600"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-row gap-2 pt-2">
            <Button
              className="w-1/2 text-white bg-green-600 hover:bg-green-700 transition"
              onClick={handleJoin}
              disabled={!roomID || loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  Joining...
                </div>
              ) : (
                "Join Room"
              )}
            </Button>

            <Button
              className="w-1/2 bg-white text-black hover:bg-gray-300 transition"
              onClick={handleCreate}
              disabled={loading}
            >
              Create New Room
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="text-xs text-center mt-6 px-4 text-muted-foreground">
        <div className="border border-yellow-500 bg-yellow-100/10 rounded-lg py-3 px-4 text-yellow-400">
          ⚠️ <strong>Note:</strong> Aarogya’s video call feature is for remote consultations only. Ensure stable internet and allow camera/mic permissions.
        </div>
      </div>

      <div className="mb-10" />
    </div>
  );
}
