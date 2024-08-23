import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface RedditPost {
    data: {
        author: string;
        title: string;
        selftext: string;
        permalink: string;
    };
}

interface RedditPostsProps {
    token: string | null;
    game: string;
    startDate: string;
    endDate: string;
}

const RedditPosts: React.FC<RedditPostsProps> = ({ token, game, startDate, endDate }) => {
    const [posts, setPosts] = useState<RedditPost[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/reddit-search', {
                    params: {
                        token,
                        game,
                        startDate,
                        endDate,
                    },
                });
                console.log('Reddit API Response Data:', response.data);
                setPosts(response.data.data.children); // Сохраняем посты в состоянии
            } catch (error) {
                console.error('Error fetching posts from Reddit:', error);
            }
        };

        fetchPosts();
    }, [token, game, startDate, endDate]);

    return (
        <div>
            <h2>Reddit Posts about {game}</h2>
            <ul>
                {posts.map((post, index) => (
                    <li key={index}>
                        <strong>Author:</strong> {post.data.author} <br />
                        <strong>Title:</strong> {post.data.title} <br />
                        <strong>Selftext:</strong> {post.data.selftext ? post.data.selftext : 'No content'} <br />
                        <a href={`https://www.reddit.com${post.data.permalink}`} target="_blank" rel="noopener noreferrer">View on Reddit</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RedditPosts;
