import {useRef} from 'react';
import type {LoaderFunction} from '@remix-run/node';
import {json} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';

import type {Playlist, Track} from '../database.server';
import {getPlaylist} from '../database.server';

type LoaderData = {
	playlistId: string;
	playlist: Playlist;
};

export const loader: LoaderFunction = async ({params}) => {
	const {id: playlistId} = params;
	if (!playlistId) {
		throw new Error('Must have playlist ID');
	}

	const playlist = await getPlaylist(playlistId);
	if (playlist instanceof Error) {
		throw playlist;
	}

	return json<LoaderData>({
		playlistId,
		playlist,
	});
};

export default () => {
	const {playlist} = useLoaderData<LoaderData>();

	const audioRef = useRef<HTMLAudioElement>(null);

	const handleChangeTrack = (track: Track) => () => {
		if (audioRef.current) {
			const [minutes, seconds] = track.timestamp.split(':');
			const time = (Number.parseInt(minutes, 10) * 60) + Number.parseInt(seconds, 10);
			audioRef.current.currentTime = time;
		}
	};

	if (!playlist) {
		return <h1>404</h1>;
	}

	return (
		<main>
			<h1>{playlist.name}</h1>
			<h4>{playlist.createdAt}</h4>
			<audio src={playlist.audio} controls ref={audioRef} />
			<ol>
				{playlist.tracks.map(track => (
					<li>
						<button onClick={handleChangeTrack(track)}>{track.timestamp}</button>: {track.artist} - {track.title}
						<img height={100} width={100} src={track.albumArt} />
					</li>
				))}
			</ol>
		</main>
	);
};
