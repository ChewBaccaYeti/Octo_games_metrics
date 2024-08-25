export interface MentionData {
    date: number;
    mention: string;
    link: string;
    author: string;
    title: string;
}

export interface GameChartProps {
    data: FollowerData[];
    mentionsData: MentionData[];
}

export interface RedditPostsProps {
    token: string | null;
    game: string;
    startDate: string;
    endDate: string;
    onMentionsDataChange: (mentionsData: MentionData[]) => void;
}

export interface FollowerData {
    date: number;
    followers: number;
    players: number;
}

export interface DatePickerProps {
    onDateChange: (startDate: string, endDate: string) => void;
}

export interface SearchBarProps {
    onRedditSearch: (term: string) => void; // Callback для поиска через Reddit
    onSteamSearch?: (data: any) => void; // Опциональный Callback для поиска через Steam
}

export interface RedditPost {
    data: {
        author: string;
        title: string;
        selftext: string;
        permalink: string;
        created_utc: number;
    };
}

export interface SteamData {
    gameId: string;
    gameName: string;
    currentPlayers: string;
    followers: string;
}

export interface SteamRenderProps {
    game: string;
    startDate: string;
    endDate: string;
}