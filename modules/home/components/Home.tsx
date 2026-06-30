import { FormEvent, useEffect, useState } from "react";

import { useRouter } from "next/router";

import { socket } from "@/common/lib/socket";
import { useModal } from "@/common/recoil/modal";// this is comment.
import { useSetRoomId } from "@/common/recoil/room";

import NotFoundModal from "../modals/NotFound";

const Home = () => {
  const { openModal } = useModal();
  const setAtomRoomId = useSetRoomId();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const router = useRouter();

  useEffect(() => {
    document.body.style.backgroundColor = "#000000";
  }, []);

  useEffect(() => {
    socket.on("created", (roomIdFromServer) => {
      setAtomRoomId(roomIdFromServer);
      router.push(roomIdFromServer);
    });

    const handleJoinedRoom = (roomIdFromServer: string, failed?: boolean) => {
      if (!failed) {
        setAtomRoomId(roomIdFromServer);
        router.push(roomIdFromServer);
      } else {
        openModal(<NotFoundModal id={roomId} />);
      }
    };

    socket.on("joined", handleJoinedRoom);

    return () => {
      socket.off("created");
      socket.off("joined", handleJoinedRoom);
    };
  }, [openModal, roomId, router, setAtomRoomId]);

  useEffect(() => {
    socket.emit("leave_room");
    setAtomRoomId("");
  }, [setAtomRoomId]);

  const handleCreateRoom = () => {
    socket.emit("create_room", username);
  };

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (roomId) socket.emit("join_room", roomId, username);
  };

  return (
    <div className="home-bg flex min-h-screen flex-col items-center justify-center px-4">
      {/* Grid overlay */}
      <div className="home-grid pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        {/* Badge */}
        <div className="mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Real-time collaborative whiteboard
        </div>

        {/* Heading */}
        <h1 className="mb-3 text-center text-6xl font-extrabold tracking-tight text-white sm:text-extra">
          chalk
          <span className="text-gradient">d</span>
        </h1>
        <p className="mb-12 text-center text-sm text-zinc-500">
          Create or join a room to start drawing together
        </p>

        {/* Card */}
        <div className="home-card w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-md">
          {/* Username */}
          <div className="mb-6 flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Your name
            </label>
            <input
              className="home-input w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-600 transition-all focus:border-white/25 focus:bg-white/[0.07] focus:outline-none"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value.slice(0, 15))}
            />
          </div>

          {/* Divider */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-xs text-zinc-600">get started</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          {/* Join room */}
          <form onSubmit={handleJoinRoom} className="mb-4 flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Join existing room
            </label>
            <div className="flex gap-2">
              <input
                className="home-input flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-600 transition-all focus:border-white/25 focus:bg-white/[0.07] focus:outline-none"
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10 active:scale-95"
              >
                Join
              </button>
            </div>
          </form>

          {/* Or divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-xs text-zinc-600">or</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          {/* Create room */}
          <button
            onClick={handleCreateRoom}
            className="home-btn-primary w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-black transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Create new room
          </button>
        </div>

        {/* Footer hint */}
        <p className="mt-6 text-center text-xs text-zinc-700">
          No account needed · Share the room ID to collaborate
        </p>
      </div>
    </div>
  );
};

export default Home;
