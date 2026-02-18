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
    id: "story-2",
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
    id: "messi",
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
