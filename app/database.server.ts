import * as z from 'zod';

const fileUrl = (directory: string, filename: string): string => `https://files.stayradiated.com/tapedeck/${directory}/${filename}`;

const playlistUrl = (filename: string): string => fileUrl('playlist', filename);

const albumArtUrl = (filename: string): string => fileUrl('albumart', filename);

const audioUrl = (filename: string): string => fileUrl('audio', filename);

const expandUrls = (playlist: Readonly<Playlist>): Playlist => ({
	...playlist,
	audio: audioUrl(playlist.audio),
	tracks: playlist.tracks.map(track => ({
		...track,
		albumArt: albumArtUrl(track.albumArt),
	})),
});

const trackSchema = z.object({
	title: z.string(),
	artist: z.string(),
	album: z.string(),
	albumArt: z.string(),
	timestamp: z.string(),
});

const playlistSchema = z.object({
	name: z.string(),
	createdAt: z.string(),
	audio: z.string(),
	tracks: z.array(trackSchema),
});

type Track = z.infer<typeof trackSchema>;
type Playlist = z.infer<typeof playlistSchema>;

const getPlaylist = async (playlistId: string): Promise<Playlist | Error> => {
	const url = playlistUrl(playlistId + '.json');
	const res = await fetch(url);
	const body = await res.json();
	const parsedBody = playlistSchema.safeParse(body);
	if (parsedBody.success) {
		const playlist = parsedBody.data;
		return expandUrls(playlist);
	}

	return parsedBody.error;
};

export {getPlaylist};
export type {Playlist, Track};
