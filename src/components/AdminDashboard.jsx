import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    blogDrafts: [],
    hero: { headline: '', subtext: '' },
    about: '',
  });
  const [editingBlog, setEditingBlog] = useState(null);
  const [editingContent, setEditingContent] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const handleBlogEdit = (draft) => setEditingBlog({ ...draft });

  const handleBlogSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (editingBlog._id) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/blog/${editingBlog._id}`, editingBlog, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/blog`, editingBlog, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setEditingBlog(null);
      fetchDashboardData();
      alert('Blog post saved!');
    } catch (error) {
      alert('Failed to save blog post.');
    }
  };

  const handleContentEdit = (section) => setEditingContent({ section, value: dashboardData[section] });

  const handleContentSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/content`, editingContent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(prev => ({ ...prev, [editingContent.section]: editingContent.value }));
      setEditingContent(null);
      alert('Content saved!');
    } catch (error) {
      alert('Failed to save content.');
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-800 mb-10 text-center">Admin Dashboard</h2>
        <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Blog Drafts</h3>
            {editingBlog ? (
              <div>
                <input
                  type="text"
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-2"
                  placeholder="Blog Title"
                />
                <ReactQuill value={editingBlog.content} onChange={(content) => setEditingBlog({ ...editingBlog, content })} className="mb-4" />
                <div className="flex space-x-4">
                  <button onClick={handleBlogSave} className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition duration-200">Save</button>
                  <button onClick={() => setEditingBlog(null)} className="text-gray-700 hover:text-blue-800">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.blogDrafts.map((draft, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-900">{draft.title}</h4>
                    <div dangerouslySetInnerHTML={{ __html: draft.content.substring(0, 100) + '...' }} />
                    <button onClick={() => handleBlogEdit(draft)} className="text-blue-800 hover:underline mt-2">Edit</button>
                  </div>
                ))}
                <button onClick={() => setEditingBlog({ title: '', content: '' })} className="text-blue-800 hover:underline mt-4">Add New Draft</button>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Site Content</h3>
            {editingContent ? (
              <div>
                <h4 className="font-semibold mb-2">{editingContent.section === 'hero' ? 'Hero Section' : 'About Section'}</h4>
                {editingContent.section === 'hero' ? (
                  <>
                    <input
                      type="text"
                      value={editingContent.value.headline}
                      onChange={(e) => setEditingContent({ ...editingContent, value: { ...editingContent.value, headline: e.target.value } })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-2"
                    />
                    <textarea
                      value={editingContent.value.subtext}
                      onChange={(e) => setEditingContent({ ...editingContent, value: { ...editingContent.value, subtext: e.target.value } })}
                      rows={3}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-2"
                    />
                  </>
                ) : (
                  <textarea
                    value={editingContent.value}
                    onChange={(e) => setEditingContent({ ...editingContent, value: e.target.value })}
                    rows={3}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-2"
                  />
                )}
                <div className="flex space-x-4">
                  <button onClick={handleContentSave} className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition duration-200">Save</button>
                  <button onClick={() => setEditingContent(null)} className="text-gray-700 hover:text-blue-800">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Hero Section</h4>
                  <p className="text-gray-700">{dashboardData.hero.headline}</p>
                  <p className="text-gray-700">{dashboardData.hero.subtext}</p>
                  <button onClick={() => handleContentEdit('hero')} className="text-blue-800 hover:underline mt-2">Edit</button>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">About Section</h4>
                  <p className="text-gray-700">{dashboardData.about}</p>
                  <button onClick={() => handleContentEdit('about')} className="text-blue-800 hover:underline mt-2">Edit</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
