import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RedditPost, RedditPostsProps } from '../types';

const RedditPosts: React.FC<RedditPostsProps> = ({ token, game, startDate, endDate, onMentionsDataChange }) => {
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
                setPosts(response.data.data.children); // Сохраняем посты в состоянии
                // Преобразование данных для графика
                const mentionsData = response.data.data.children.map((post: any) => ({
                    date: new Date(post.data.created_utc * 1000).toISOString(),
                    mention: post.data.title,
                    link: `https://www.reddit.com${post.data.permalink}`,
                    author: post.data.author,
                    title: post.data.title
                }));
                // Передаем данные наверх
                onMentionsDataChange(mentionsData);
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
