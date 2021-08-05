import React from "react";
import { useOthers, useMyPresence, RoomProvider } from "@liveblocks/react";

export default function Room() {
  return (
    <RoomProvider
      id={"example-live-cursors"}
      /**
       * Initialize the cursor position to null when joining the room
       */
      defaultPresence={() => ({
        cursor: null,
      })}
    >
      <PresenceDemo />
    </RoomProvider>
  );
}

function PresenceDemo() {
  const [myPresence, updateMyPresence] = useMyPresence();

  const { cursor, name } = myPresence;

  const others = useOthers();

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onPointerMove={(event) =>
        // Update the user cursor position on every pointer move
        updateMyPresence({
          cursor: {
            x: Math.round(event.clientX),
            y: Math.round(event.clientY),
          },
          name,
        })
      }
      onPointerLeave={() =>
        // When the pointer goes out, set cursor to null
        updateMyPresence({
          cursor: null,
        })
      }
    >
      <div className="max-w-sm text-center">
        <input
          className="focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md p-2"
          type="text"
          value={name}
          onChange={(e) => {
            updateMyPresence({ name: e.target.value });
          }}
        />
      </div>

      {others.map(({ connectionId, presence }) => {
        if (presence == null || presence.cursor == null) {
          return null;
        }

        return (
          <Cursor
            key={`cursor-${connectionId}`}
            color={COLORS[connectionId % COLORS.length]}
            x={presence.cursor.x}
            y={presence.cursor.y}
            name={presence.name}
          />
        );
      })}
    </div>
  );
}

function Cursor({ color, x, y, name }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transition: "transform 0.5s cubic-bezier(.17,.93,.38,1)",
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
    >
      <svg
        width="24"
        height="36"
        viewBox="0 0 24 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={color}
        />
      </svg>
      <div
        className="absolute top-5 left-2 px-4 py-2 bg-blue-500 text-white leading-relaxed text-sm"
        style={{
          borderRadius: 20,
        }}
      >
        {name}
      </div>
    </div>
  );
}

const COLORS = [
  "#E57373",
  "#9575CD",
  "#4FC3F7",
  "#81C784",
  "#FFF176",
  "#FF8A65",
  "#F06292",
  "#7986CB",
];
