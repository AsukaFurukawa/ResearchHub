import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';

export default function NewsFeedPage() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await fetch('http://localhost:5000/news', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (!res.ok) throw new Error('Failed to fetch news');
            const data = await res.json();
            setNews(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Layout>
            <h2 className="text-xl font-bold mb-4">News Feed</h2>
            {news.map((item) => (
                <div key={item.id} className="border p-4 mb-4 rounded shadow-sm">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p>{item.content}</p>
                </div>
            ))}
        </Layout>
    );
}
