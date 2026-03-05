export type CommunityCategory = {
  id: string;
  label: string;
  active?: boolean;
};

export type CommunityAction = {
  id: string;
  label: string;
  tone: "orange" | "purple" | "green" | "red";
};

export type CommunityStory = {
  id: string;
  posterLabel: string;
  posterIcon: string;
  title: string;
  time: string;
  author: string;
  authorAvatar?: string;
  image: string;
  viewed?: boolean;
};

export type SuggestedCommunity = {
  id: string;
  name: string;
  image: string;
};

export type CommunityFeedItem = {
  id: string;
  community: string;
  author: string;
  verified?: boolean;
  time: string;
  content: string;
  avatar: string;
  image?: string;
  likes: number;
  comments: number;
  bookmarks: number;
  shares: number;
};

export type CommunityReply = {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  replies?: CommunityReply[];
};

export type CommunityUserOrb = {
  id: string;
  name: string;
  avatar?: string;
  viewed?: boolean;
};

export const communityCategories: CommunityCategory[] = [
  { id: "live", label: "Live", active: true },
  { id: "hot", label: "Hot" },
  { id: "spotlight", label: "Spotlight" },
  { id: "clubs", label: "Clubs" },
];

export const communityActions: CommunityAction[] = [
  { id: "feed", label: "Feed", tone: "red" },
  { id: "groups", label: "Groups", tone: "orange" },
  { id: "showcase", label: "Showcase", tone: "purple" },
  { id: "browse", label: "Browse", tone: "green" },
];

export const communityStories: CommunityStory[] = [
  {
    id: "story-1",
    viewed: true,
    posterLabel: "Languens",
    posterIcon: "/assets/community/hat.png",
    title: "Game ended in 6:3, my boy on the right scored 6 goals. So proud",
    time: "Feb 10 2pm",
    author: "David Rose",
    authorAvatar: "/assets/community/story-messi.jpg",
    image: "/assets/community/story-messi.jpg",
  },
  {
    id: "story-2",
    posterLabel: "Highlights",
    posterIcon: "/assets/community/hat.png",
    title: "What a finish! Last minute goal to win the game!",
    time: "Feb 10 1pm",
    author: "Chris Coleman",
    authorAvatar: "/assets/community/story-messi.jpg",
    image: "/assets/community/story-messi.jpg",
  },

  {
    id: "story-3",
    posterLabel: "Highlights",
    posterIcon: "/assets/community/hat.png",
    title: "What a finish! Last minute goal to win the game!",
    time: "Feb 10 1pm",
    author: "Chris Coleman",
    authorAvatar: "/assets/community/story-messi.jpg",
    image: "/assets/community/story-messi.jpg",
  },

  {
    id: "story-4",
    posterLabel: "Highlights",
    posterIcon: "/assets/community/hat.png",
    title: "What a finish! Last minute goal to win the game!",
    time: "Feb 10 1pm",
    author: "Chris Coleman",
    authorAvatar: "/assets/community/story-messi.jpg",
    image: "/assets/community/story-messi.jpg",
  },

  {
    id: "story-5",
    posterLabel: "Highlights",
    posterIcon: "/assets/community/hat.png",
    title: "What a finish! Last minute goal to win the game!",
    time: "Feb 10 1pm",
    author: "Chris Coleman",
    authorAvatar: "/assets/community/story-messi.jpg",
    image: "/assets/community/story-messi.jpg",
  },
];

export const suggestedCommunities: SuggestedCommunity[] = [
  {
    id: "messi",
    name: "Leo Messi GANG",
    image: "/assets/community/story-messi.jpg",
  },
  {
    id: "clasico",
    name: "El-Classico",
    image: "/assets/community/story-messi.jpg",
  },
  {
    id: "prem",
    name: "Premier League",
    image: "/assets/community/story-messi.jpg",
  },
  {
    id: "messi-2",
    name: "Leo Messi GANG",
    image: "/assets/community/story-messi.jpg",
  },
  {
    id: "clasico-2",
    name: "El-Classico",
    image: "/assets/community/story-messi.jpg",
  },
  {
    id: "prem-2",
    name: "Premier League",
    image: "/assets/community/story-messi.jpg",
  },
  {
    id: "messi-3",
    name: "Leo Messi GANG",
    image: "/assets/community/story-messi.jpg",
  },
];

export const communityFeed: CommunityFeedItem[] = [
  {
    id: "feed-1",
    community: "Barcelona",
    author: "David Rose",
    verified: true,
    time: "Feb 10 2pm",
    content:
      "Hansi Flick Barcelona are trying to score 200 goals this season. It will break the internet",
    avatar: "/assets/community/story-messi.jpg",
    image: "",
    likes: 0,
    comments: 0,
    bookmarks: 0,
    shares: 0,
  },
  {
    id: "feed-2",
    community: "Leo Messi",
    author: "David Rose",
    verified: false,
    time: "Feb 10 1pm",
    content:
      "Hansi Flick Barcelona are trying to score 200 goals this season. It will break the internet",
    avatar: "/assets/community/story-messi.jpg",
    image: "/assets/community/story-messi.jpg",
    likes: 0,
    comments: 0,
    bookmarks: 0,
    shares: 0,
  },

  {
    id: "feed-3",
    community: "Leo Messi",
    author: "David Rose",
    verified: false,
    time: "Feb 10 1pm",
    content:
      "Hansi Flick Barcelona are trying to score 200 goals this season. It will break the internet",
    avatar: "/assets/community/story-messi.jpg",
    image: "/assets/community/story-messi.jpg",
    likes: 0,
    comments: 0,
    bookmarks: 0,
    shares: 0,
  },

  {
    id: "feed-4",
    community: "Leo Messi",
    author: "David Rose",
    verified: false,
    time: "Feb 10 1pm",
    content:
      "Hansi Flick Barcelona are trying to score 200 goals this season. It will break the internet",
    avatar: "/assets/community/story-messi.jpg",
    image: "/assets/community/story-messi.jpg",
    likes: 0,
    comments: 0,
    bookmarks: 0,
    shares: 0,
  },

  {
    id: "feed-5",
    community: "Barcelona",
    author: "David Rose",
    verified: true,
    time: "Feb 10 2pm",
    content:
      "Hansi Flick Barcelona are trying to score 200 goals this season. It will break the internet",
    avatar: "/assets/community/story-messi.jpg",
    image: "",
    likes: 0,
    comments: 0,
    bookmarks: 0,
    shares: 0,
  },

  {
    id: "feed-6",
    community: "Barcelona",
    author: "David Rose",
    verified: true,
    time: "Feb 10 2pm",
    content:
      "Hansi Flick Barcelona are trying to score 200 goals this season. It will break the internet",
    avatar: "/assets/community/story-messi.jpg",
    image: "",
    likes: 0,
    comments: 0,
    bookmarks: 0,
    shares: 0,
  },

  {
    id: "feed-7",
    community: "Barcelona",
    author: "David Rose",
    verified: true,
    time: "Feb 10 2pm",
    content:
      "Hansi Flick Barcelona are trying to score 200 goals this season. It will break the internet Hansi Flick Barcelona are trying to score 200 goals this season. It will break the internet  Hansi Flick Barcelona are trying to score 200 goals this season. It will break the internet",
    avatar: "/assets/community/story-messi.jpg",
    image: "",
    likes: 0,
    comments: 0,
    bookmarks: 0,
    shares: 0,
  },
];

export const communityUserOrbs: CommunityUserOrb[] = [
  {
    id: "user-1",
    name: "Messi",
    avatar: "/assets/community/story-messi.jpg",
  },
  {
    id: "user-2",
    name: "Saka",
    avatar: "/assets/community/story-messi.jpg",
  },
  { id: "user-3", name: "James", avatar: "/assets/community/story-messi.jpg" },
  {
    id: "user-4",
    name: "Ronaldo",
    avatar: "/assets/community/story-messi.jpg",
  },
  {
    id: "user-5",
    name: "Benzema",
    avatar: "/assets/community/story-messi.jpg",
  },
  { id: "user-6", name: "Neymar", avatar: "/assets/community/story-messi.jpg" },
  {
    id: "user-7",
    name: "Kante",
    avatar: "/assets/community/story-messi.jpg",
    viewed: true,
  },
  {
    id: "user-8",
    name: "Modric",
    avatar: "/assets/community/story-messi.jpg",
    viewed: true,
  },
];

export const communityThreads: Record<string, CommunityReply[]> = {
  "feed-1": [
    {
      id: "reply-1",
      author: "Semzi",
      handle: "@semzi",
      avatar: "/assets/community/story-messi.jpg",
      time: "23m",
      content:
        "If Flick keeps this tempo, Barca really can flirt with that number. The midfield structure is doing a lot of work.",
      likes: 126,
      replies: [
        {
          id: "reply-1-1",
          author: "Kian",
          handle: "@kianball",
          avatar: "/assets/community/story-messi.jpg",
          time: "14m",
          content:
            "True. The front line gets the headlines, but the spacing is what makes the overloads feel easy.",
          likes: 34,
        },
      ],
    },
    {
      id: "reply-2",
      author: "Abdulrafiu",
      handle: "@abdulcodes",
      avatar: "/assets/community/story-messi.jpg",
      time: "12m",
      content:
        "I want to see how they sustain it against more compact teams before I fully buy into the 200 goals talk.",
      likes: 88,
    },
  ],
  "feed-2": [
    {
      id: "reply-3",
      author: "Modric",
      handle: "@modric",
      avatar: "/assets/community/story-messi.jpg",
      time: "31m",
      content: "That image is cold. Clean post, but the caption needs one more line.",
      likes: 19,
    },
  ],
  "feed-7": [
    {
      id: "reply-4",
      author: "Saka",
      handle: "@bukayo",
      avatar: "/assets/community/story-messi.jpg",
      time: "44m",
      content:
        "This is the kind of conversation I like in community. Strong take, strong reactions, good football talk.",
      likes: 241,
      replies: [
        {
          id: "reply-4-1",
          author: "James",
          handle: "@james",
          avatar: "/assets/community/story-messi.jpg",
          time: "28m",
          content: "Exactly. Feels like matchday Twitter without the chaos.",
          likes: 17,
        },
        {
          id: "reply-4-2",
          author: "Neymar",
          handle: "@neyjr",
          avatar: "/assets/community/story-messi.jpg",
          time: "19m",
          content: "Now imagine this with live clips and polls.",
          likes: 53,
        },
      ],
    },
  ],
};
