import axios from 'axios';
import cheerio from 'cheerio';

export const fetchSteamFollowersData = async (appId: string) => {
    const url = `https://steamdb.info/app/${appId}/charts/#followers`;
    
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let followersData: { date: string, followers: number }[] = [];

        // Парсинг данных из таблицы подписчиков
        $('#followers_table tbody tr').each((index, element) => {
            const date = $(element).find('td').first().text().trim();
            const followers = parseInt($(element).find('td').eq(1).text().replace(/,/g, ''), 10);

            if (date && !isNaN(followers)) {
                followersData.push({ date, followers });
            }
        });

        console.log(followersData);
        return followersData;
    } catch (error) {
        console.error('Error fetching SteamDB data:', error);
        return [];
    }
};
