import { useRef } from 'react'
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { database, Tape } from "../../database.server.ts";

type LoaderData = {
  id: string,
  tape: Tape,
}

export const loader = ({ params }) => {
  const { id } = params;
  const tape = database[id];

  return json<LoaderData>({
    id,
    tape,
  });
};

export default () => {
  const { id, tape } = useLoaderData<LoaderData>();

  const audioRef = useRef<HTMLAudioElement>(null)

  const handleChangeTrack = (track) => () => {
    if (audioRef.current) {
      const [minutes, seconds] = track.timestamp.split(':')
      const time = (Number.parseInt(minutes, 10) * 60) + Number.parseInt(seconds, 10)
      audioRef.current.currentTime = time
    }
  }

  if (!tape) {
    return <h1>404</h1>;
  }

  return (
    <main>
      <h1>{tape.name}</h1>
      <h4>{tape.createdAt}</h4>
      <audio src={tape.audio} controls ref={audioRef} />
      <ol>
        {tape.tracks.map((track) => (
          <li>
            <button onClick={handleChangeTrack(track)}>{track.timestamp}</button>: {track.artist} - {track.title}
            <img height={100} width={100} src={track.albumArt} />
          </li>
        ))}
      </ol>
    </main>
  );
};
