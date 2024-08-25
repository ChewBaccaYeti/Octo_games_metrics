import axios, { AxiosResponse } from 'axios';

export const getRedditToken = async () => {
    const response = await axios.post('http://localhost:5000/api/reddit-token');
    return response.data.token;
};

export const fetchRedditMentions = async (
    game: string,
    startDate: string,
    endDate: string,
    maxResults: number = 100 // Параметр для максимального количества результатов
): Promise<{ date: string; title: string; url: string; author: string; }[]> => {
    const token = await getRedditToken();
    let allMentions: { date: string; title: string; url: string; author: string; }[] = [];
    let after: string | null = null;

    try {
        do {
            const response: AxiosResponse<any> = await axios.get('http://localhost:5000/api/reddit-search', {
                params: {
                    token,
                    game,
                    startDate,
                    endDate,
                    limit: 100, // Устанавливаем лимит в 100 объектов за запрос
                    after
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

            allMentions = allMentions.concat(mentions);
            after = response.data.data.after; // Получаем значение "after" для следующей пагинации
        } while (after && allMentions.length < maxResults);

        console.log(`Mentions fetched, total: ${allMentions.length}`);
        return allMentions.slice(0, maxResults); // Ограничиваем количество результатов до maxResults
    } catch (error) {
        console.error('Error fetching data from Reddit:', error);
        return [];
    }
};
