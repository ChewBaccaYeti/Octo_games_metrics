import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RedditPost, RedditPostsProps } from '../types';

const RedditPosts: React.FC<RedditPostsProps> = ({ token, game, startDate, endDate, onMentionsDataChange }) => {
    const [posts, setPosts] = useState<RedditPost[]>([]);

    const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://octo-games-metrics.vercel.app' : 'http://localhost:5000';

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/reddit-search`, {
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
            <h2 style={{ textAlign: 'center', color: 'rgba(255,99,132,1)', fontSize: '24px', marginBottom: '20px' }}>
                Reddit Posts about {game}</h2>
            <ul
                style={{ listStyleType: 'none', }}
            >
                {posts.map((post, index) => (
                    <li 
                        key={index}
                        style={{ 
                            border: '3px solid #ddd', 
                            borderRadius: '8px', 
                            padding: '15px', 
                            marginBottom: '15px', 
                            backgroundColor: '#f0f0f0', 
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)'
                        }}
                    >
                        <strong>Author:</strong> {post.data.author} <br />
                        <strong>Title:</strong> {post.data.title} <br />
                        <strong>Selftext:</strong> {post.data.selftext ? post.data.selftext : 'No content'} <br />
                        <a 
                            href={`https://www.reddit.com${post.data.permalink}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#1e7dd7', textDecoration: 'none', fontWeight: 'bold' }}
                        >View on Reddit</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RedditPosts;
