const albumArtUrl = (filename: string): string => {
  return `https://files.stayradiated.com/tapedeck/albumart/${filename}`;
};

const audioUrl = (filename: string): string => {
  return `https://files.stayradiated.com/tapedeck/audio/${filename}`;
};

type Track = {
  artist: string,
  title: string,
  albumArt: string,
  timestamp: string,
}

type Tape = {
  name: string,
  createdAt: string,
  audio: string,
  tracks: Track[]
}

const database: Record<string, Tape> = {
  "nine-songs-for-nienke": {
    name: "Nine Songs for Nienke",
    createdAt: "2022.09.10",
    audio: audioUrl("nine-songs-for-nienke.opus"),
    tracks: [
      {
        artist: "Dave Dobbyn",
        title: "Loyal",
        albumArt: albumArtUrl("dave-dobbyn-loyal.jpg"),
        timestamp: "00:00",
      },
      {
        artist: "Hippo Campus",
        title: "Way It Goes",
        albumArt: albumArtUrl("hippo-campus-landmark.jpg"),
        timestamp: "04:38",
      },
      {
        artist: "Parov Stelar",
        title: "Dust in the Summer Rain",
        albumArt: albumArtUrl("parov-stelar-the-princess.jpg"),
        timestamp: "08:45",
      },
      {
        artist: "Madlib",
        title: "Hopprock",
        albumArt: albumArtUrl("madlib-hopprock.jpg"),
        timestamp: "12:24",
      },
      {
        artist: "Watsky",
        title: "Midnight Heart",
        albumArt: albumArtUrl("watsky-x-infinity.jpg"),
        timestamp: "15:51",
      },
      {
        artist: "Big Scary",
        title: "Falling Away",
        albumArt: albumArtUrl("big-scary-vacation.jpg"),
        timestamp: "20:27",
      },
      {
        artist: "Lady Lamb",
        title: "Bird Balloons",
        albumArt: albumArtUrl("lady-lamb-ripely-pine.jpg"),
        timestamp: "20:27",
      },
      {
        artist: "Tame Impala",
        title: "Yes I'm Changing",
        albumArt: albumArtUrl("tame-impala-currents.jpg"),
        timestamp: "24:33",
      },
      {
        artist: "Jeremy Messersmith",
        title: "Tourniquet",
        albumArt: albumArtUrl("jeremy-messersmith-tourniquet.jpg"),
        timestamp: "29:03",
      },
    ],
  },
};

export { database };
export type { Tape, Track }
