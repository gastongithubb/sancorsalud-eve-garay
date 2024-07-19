'use client';

import React, { useState, useEffect } from 'react';
import { getNews, addNews, deleteNews, updateNewsStatus, updateNews, NovedadesRow } from '@/utils/db';

const NewsManager: React.FC = () => {
  const [news, setNews] = useState<NovedadesRow[]>([]);
  const [filteredNews, setFilteredNews] = useState<NovedadesRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Omit<NovedadesRow, 'id'>>({ url: '', title: '', publishDate: '', estado: 'activa' });
  const [editingItem, setEditingItem] = useState<NovedadesRow | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = news.filter(item => 
      item.title.toLowerCase().includes(lowercasedFilter) ||
      item.url.toLowerCase().includes(lowercasedFilter) ||
      item.publishDate.includes(lowercasedFilter)
    );
    setFilteredNews(filtered);
  }, [searchTerm, news]);

  const fetchNews = async (loadMore = false) => {
    try {
      const newsData = await getNews(page, 10);
      if (loadMore) {
        setNews(prev => [...prev, ...newsData]);
      } else {
        setNews(newsData);
      }
      setHasMore(newsData.length === 10);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Error al obtener las noticias');
    }
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addNews(newItem);
      setNewItem({ url: '', title: '', publishDate: '', estado: 'activa' });
      await fetchNews();
      showMessage('Noticia añadida con éxito', 'success');
    } catch (error) {
      console.error('Error adding news:', error);
      showMessage('Error al añadir la noticia', 'error');
    }
  };

  const handleDeleteNews = async (id: number) => {
    try {
      await deleteNews(id);
      setNews(news.filter(item => item.id !== id));
      showMessage('Noticia eliminada con éxito', 'success');
    } catch (error) {
      console.error('Error deleting news:', error);
      showMessage('Error al eliminar la noticia', 'error');
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: NovedadesRow['estado']) => {
    try {
      await updateNewsStatus(id, newStatus);
      setNews(news.map(item => item.id === id ? { ...item, estado: newStatus } : item));
      showMessage('Estado de la noticia actualizado con éxito', 'success');
    } catch (error) {
      console.error('Error updating news status:', error);
      showMessage('Error al cambiar el estado de la noticia', 'error');
    }
  };

  const handleEditNews = (item: NovedadesRow) => {
    setEditingItem(item);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    try {
      await updateNews(editingItem);
      setNews(news.map(item => item.id === editingItem.id ? editingItem : item));
      setEditingItem(null);
      showMessage('Noticia actualizada con éxito', 'success');
    } catch (error) {
      console.error('Error updating news:', error);
      showMessage('Error al actualizar la noticia', 'error');
    }
  };

  const showMessage = (message: string, type: 'error' | 'success') => {
    // Implementa esto según tus necesidades, por ejemplo, usando un estado para mostrar mensajes
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const getStatusColor = (status: NovedadesRow['estado']) => {
    switch (status) {
      case 'activa': return 'bg-green-500';
      case 'actualizada': return 'bg-yellow-500';
      case 'fuera_de_uso': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: NovedadesRow['estado']) => {
    switch (status) {
      case 'activa': return 'Activa';
      case 'actualizada': return 'Actualizada';
      case 'fuera_de_uso': return 'Fuera de uso';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-zinc-100 rounded-lg shadow-card font-SpaceGrotesk">
      <h2 className="text-3xl font-bold mb-6 text-black">Gestor de Noticias</h2>
      
      {error && (
        <div className="bg-red-500 border-l-4 border-red-700 text-white p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleAddNews} className="mb-8 bg-white p-6 rounded-lg shadow-card">
        <div className="mb-4">
          <label htmlFor="url" className="block text-sm font-medium text-black mb-2">URL</label>
          <input
            type="text"
            id="url"
            value={newItem.url}
            onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
            placeholder="https://ejemplo.com/noticia"
            required
            className="w-full px-3 py-2 placeholder-zinc-500 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-black mb-2">Título</label>
          <input
            type="text"
            id="title"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            placeholder="Título de la noticia"
            required
            className="w-full px-3 py-2 placeholder-zinc-500 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="publishDate" className="block text-sm font-medium text-black mb-2">Fecha de publicación</label>
          <input
            type="date"
            id="publishDate"
            value={newItem.publishDate}
            onChange={(e) => setNewItem({ ...newItem, publishDate: e.target.value })}
            required
            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="estado" className="block text-sm font-medium text-black mb-2">Estado</label>
          <select
            id="estado"
            value={newItem.estado}
            onChange={(e) => setNewItem({ ...newItem, estado: e.target.value as NovedadesRow['estado'] })}
            required
            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="activa">Activa</option>
            <option value="actualizada">Actualizada</option>
            <option value="fuera_de_uso">Fuera de uso</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300">
          Añadir Noticia
        </button>
      </form>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar noticias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 placeholder-zinc-500 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map((item) => (
          <li key={item.id} className="bg-white p-4 rounded-lg shadow-card flex flex-col justify-between h-full">
            {editingItem?.id === item.id ? (
              <div>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full mb-2 px-2 py-1 border rounded"
                />
                <input
                  type="text"
                  value={editingItem.url}
                  onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                  className="w-full mb-2 px-2 py-1 border rounded"
                />
                <input
                  type="date"
                  value={editingItem.publishDate}
                  onChange={(e) => setEditingItem({ ...editingItem, publishDate: e.target.value })}
                  className="w-full mb-2 px-2 py-1 border rounded"
                />
                <button onClick={handleSaveEdit} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Guardar</button>
                <button onClick={() => setEditingItem(null)} className="bg-gray-500 text-white px-2 py-1 rounded">Cancelar</button>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center mb-2">
                    <span className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(item.estado)}`}></span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.estado)} text-white`}>
                      {getStatusText(item.estado)}
                    </span>
                  </div>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:text-blue-800 font-medium block mb-2 truncate">
                    {item.title}
                  </a>
                  <p className="text-sm text-zinc-500 mb-2">{item.publishDate}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <select
                    value={item.estado}
                    onChange={(e) => handleUpdateStatus(item.id, e.target.value as NovedadesRow['estado'])}
                    className="px-2 py-1 text-sm bg-zinc-300 text-black rounded hover:bg-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-opacity-50 transition duration-300"
                  >
                    <option value="activa">Activa</option>
                    <option value="actualizada">Actualizada</option>
                    <option value="fuera_de_uso">Fuera de uso</option>
                  </select>
                  <button 
                    onClick={() => handleEditNews(item)}
                    className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 transition duration-300 mr-2"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDeleteNews(item.id)} 
                    className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50 transition duration-300"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      
      {hasMore && (
        <div className="mt-4 text-center">
          <button 
            onClick={() => fetchNews(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 transition duration-300"
          >
            Cargar más
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsManager;