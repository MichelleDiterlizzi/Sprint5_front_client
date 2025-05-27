import React, { useEffect, useState } from 'react';
import { eventService, categoryService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'popular', label: 'Populares' },
  { key: 'free', label: 'Gratuitos' },
];

const Home = () => {
  const [all, setAll] = useState([]);
  const [popular, setPopular] = useState([]);
  const [free, setFree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('all');
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [allRes, pop, fr] = await Promise.all([
          eventService.getAll(),
          eventService.getPopular(),
          eventService.getFree(),
        ]);
        setAll(Array.isArray(allRes.data) ? allRes.data : []);
        setPopular(Array.isArray(pop.data) ? pop.data : []);
        setFree(Array.isArray(fr.data) ? fr.data : []);
      } catch (e) {
        // Puedes mostrar un toast de error si quieres
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleShowCategories = async () => {
    if (!showCategories && categories.length === 0) {
      setLoadingCategories(true);
      try {
        const res = await categoryService.getAll();
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    }
    setShowCategories((prev) => !prev);
  };

  let eventsToShow = all;
  if (active === 'popular') eventsToShow = popular;
  if (active === 'free') eventsToShow = free;

  const getCategoryImage = (cat) => {
    if (cat.image) {
      return cat.image;
    }
    return 'https://picsum.photos/800/400';
  };

  const getEventImage = (event) => {
    if (event.image) {
      return event.image;
    }
    if (event.category && event.category.image) {
      return event.category.image;
    }
    return 'https://picsum.photos/800/400';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-semibold mb-8 text-gray-800 text-center tracking-tight">Explora los mejores eventos en tu ciudad</h1>
      <nav className="flex gap-2 mb-6 flex-wrap items-center">
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`px-4 py-2 rounded-lg font-semibold border transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${active === f.key ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-gray-300 hover:bg-indigo-50'}`}
            onClick={() => setActive(f.key)}
          >
            {f.label}
          </button>
        ))}
        <button
          className="px-4 py-2 rounded-lg font-semibold border transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-indigo-600 border-gray-300 hover:bg-indigo-50 flex items-center gap-2"
          onClick={handleShowCategories}
        >
          {showCategories ? 'Hide categories' : 'More categories'}
          <span className="ml-1 text-lg">{showCategories ? '▲' : '▼'}</span>
        </button>
      </nav>
      {showCategories && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
          {loadingCategories ? (
            <div className="text-center text-gray-500">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="text-center text-gray-500">No categories found</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.map(cat => (
                <div key={cat.id} className="flex flex-col items-center p-2 bg-white rounded shadow">
                  <img
                    src={getCategoryImage(cat)}
                    alt={cat.name}
                    className="w-20 h-20 object-cover rounded mb-2 border"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://picsum.photos/800/400'; }}
                  />
                  <span className="text-sm font-medium text-gray-700 text-center">{cat.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {loading ? (
        <div className="text-center py-8">Cargando eventos...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {eventsToShow.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8 w-full">No hay eventos para mostrar</div>
          ) : (
            eventsToShow.map(event => {
              return (
                <div
                  key={event.id}
                  className="border rounded-xl shadow-lg bg-white flex flex-col overflow-hidden h-full min-h-[350px] max-w-xs mx-auto transform transition-transform duration-200 hover:scale-105 cursor-pointer"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={getEventImage(event)}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.onerror = null; e.target.src = 'https://picsum.photos/800/400'; }}
                    />
                  </div>
                  <div className="flex-1 flex flex-col p-4">
                    <h2 className="text-lg font-bold mb-1 text-center">{event.title}</h2>
                    <div className="text-gray-600 text-sm mb-1 text-center">{event.category?.name || 'Sin categoría'}</div>
                    <div className="text-gray-600 text-sm mb-1 text-center">📍 {event.address}</div>
                    <div className="text-gray-600 text-sm mb-1 text-center">📅 {event.event_date ? new Date(event.event_date).toLocaleString() : 'Fecha no disponible'}</div>
                    <div className="text-gray-600 text-sm mb-1 text-center">👤 {event.creator?.name || 'Anónimo'}</div>
                    <div className="flex justify-center mt-2">
                      {event.is_free ? (
                        <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Gratuito</span>
                      ) : (
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full border border-yellow-300">{event.price}€</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Home; 