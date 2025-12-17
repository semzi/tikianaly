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

const NewsList: React.FC<{ items: Blog[] }> = ({ items }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-3">
      {items.map((blog: Blog) => (
        <a
          href={`/blog/${blog._id ?? blog.id}`}
          key={`${blog._id ?? blog.id}-${blog.title ?? ''}`}
          className="flex items-center cursor-pointer bg-snow-100 hover:bg-snow-200 transition-colors rounded py-3 px-4"
        >
          <div className="relative w-32 h-20 mr-4">
            <img
              src={blog?.imageUrl || '/logos/logo.png'}
              alt={blog.title ?? 'Blog post'}
              className="object-cover rounded-md w-full h-full"
            />
          </div>
          <div className="flex flex-col justify-between h-full flex-1">
            <h3 className="text-sm ">{blog.title && blog.title.length > 60 ? `${blog.title.slice(0, 50)}…` : blog.title}</h3>
            <div className="flex items-center text-xs text-gray-500 space-x-3">
              <span suppressHydrationWarning>{formatDate(blog.createdAt)}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default NewsList;
