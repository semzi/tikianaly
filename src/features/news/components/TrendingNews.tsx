import React from 'react';

interface Blog {
  _id?: string;
  id?: string;
  title?: string;
  imageUrl?: string;
  createdAt?: string;
}

const formatDate = (value?: string) => {
  if (!value) return '';
  try { return new Date(value).toLocaleDateString('en-US', { timeZone: 'UTC' }); } catch { return ''; }
};

const TrendingNews: React.FC<{ item?: Blog }> = ({ item }) => {
  if (!item) return null;
  return (
    <div className="block-style p-4">
      <p className="font-[500] mb-3">Trending</p>
      <a href={`/blog/${item._id ?? item.id}`} className="block group">
        <div className="w-full h-44 rounded overflow-hidden mb-3 bg-snow-200">
          <img src={item.imageUrl || '/logos/logo.png'} alt={item.title} className="w-full h-full object-cover" />
        </div>
        <h3 className="font-semibold theme-text mb-2">{item.title}</h3>
        <div className="text-xs text-neutral-n4">{formatDate(item.createdAt)}</div>
      </a>
    </div>
  );
};

export default TrendingNews;
