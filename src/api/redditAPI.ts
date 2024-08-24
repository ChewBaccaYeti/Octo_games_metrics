import axios, { AxiosResponse } from 'axios';

export const getRedditToken = async () => {
    const response = await axios.post('http://localhost:5000/api/reddit-token');
    return response.data.token;
};

export const fetchRedditMentions = async (
    game: string,
    startDate: string,
    endDate: string
): Promise<{ date: string; title: string; url: string; author: string; }[]> => {
    const token = await getRedditToken();

    const response: AxiosResponse<any> = await axios.get('http://localhost:5000/api/reddit-search', {
        params: {
            token,
            game,
            startDate,
            endDate
        },
    });
    console.log('Reddit API Response:', response.data);

    const mentions = response.data.data.children.map((post: any) => {
        const postDate = new Date(post.data.created_utc * 1000);
        if (isNaN(postDate.getTime())) {
            console.error('Invalid date:', post.data.created_utc);
            return null;
        }

        // Фильтрация по диапазону дат
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        if (postDate.getTime() < start || postDate.getTime() > end) {
            return null;
        }

        return {
            date: postDate.toISOString(),
            author: post.data.author,
            title: post.data.title,
            url: `https://www.reddit.com${post.data.permalink}`,
        };
    }).filter((item: any) => item !== null); // Фильтруем null значения

    console.log('Mentions strictly limited to 25 items:', mentions);
    return mentions;
};
