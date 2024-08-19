'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sticker, StickyNote, X, PinIcon, Save, Image, Search, CornerRightDown, Palette } from 'lucide-react';

type NoteColor = {
  name: string;
  bgColor: string;
  textColor: string;
};

type NoteType = {
  id: string;
  text: string;
  x: number;
  y: number;
  isPinned: boolean;
  width: number;
  height: number;
  color: NoteColor;
};

type StickerType = {
  id: string;
  content: string;
  x: number;
  y: number;
  isGif: boolean;
  gifUrl?: string;
};

const NOTE_COLORS: NoteColor[] = [
  { name: 'Amarillo', bgColor: 'bg-yellow-200', textColor: 'text-black' },
  { name: 'Rosa Pastel', bgColor: 'bg-pink-200', textColor: 'text-black' },
  { name: 'Celeste', bgColor: 'bg-blue-200', textColor: 'text-black' },
  { name: 'Verde Pastel', bgColor: 'bg-green-200', textColor: 'text-black' },
  { name: 'Lavanda', bgColor: 'bg-purple-200', textColor: 'text-black' },
  { name: 'Naranja Claro', bgColor: 'bg-orange-200', textColor: 'text-black' },
  { name: 'Gris Claro', bgColor: 'bg-gray-200', textColor: 'text-black' },
  { name: 'Azul Oscuro', bgColor: 'bg-blue-700', textColor: 'text-white' },
  { name: 'Verde Oscuro', bgColor: 'bg-green-700', textColor: 'text-white' },
  { name: 'Púrpura', bgColor: 'bg-purple-700', textColor: 'text-white' },
];

const DEFAULT_NOTE_COLOR: NoteColor = NOTE_COLORS[0];

const STICKER_OPTIONS = [
  '😀', '🚀', '💡', '🎉', '🐱', '🌈', '🍕', '🎸',
  '🌺', '🦄', '🍦', '🎨', '📚', '🏆', '🎭', '🌙',
  '🌴', '🏄', '🍔', '🚲', '🎧', '🏀', '🌍', '🍓',
  '👌🏻', '🦷', '👅', '👁️', '👣', '🧠', '🫀', '🫁',
  '👨🏻‍💻', '🧑🏻‍💼', '👩🏻‍💼', '👩🏻‍💻', 
  '👩🏻‍🦯‍➡️', '🧑🏻‍🦯‍➡️', '🐭', '🐥',
  '🌚', '❄️', '🍼', '💊', '💉', '🩺', '🩹', '❌',
  '✅', '🕧'
];

const GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;

const OnlineWhiteboard = () => {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [stickers, setStickers] = useState<StickerType[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [resizingNote, setResizingNote] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [gifSearchTerm, setGifSearchTerm] = useState('');
  const [gifResults, setGifResults] = useState<any[]>([]);
  const whiteboardRef = useRef<HTMLDivElement>(null);

  const saveData = useCallback(() => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('whiteboardNotes', JSON.stringify(notes));
      localStorage.setItem('whiteboardStickers', JSON.stringify(stickers));
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error saving data:', error);
      setSaveStatus('error');
    }
  }, [notes, stickers]);

  useEffect(() => {
    const savedNotes = localStorage.getItem('whiteboardNotes');
    const savedStickers = localStorage.getItem('whiteboardStickers');
    
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      const validatedNotes = parsedNotes.map((note: NoteType) => ({
        ...note,
        color: note.color || DEFAULT_NOTE_COLOR
      }));
      setNotes(validatedNotes);
    }
    if (savedStickers) setStickers(JSON.parse(savedStickers));
  }, []);

  useEffect(() => {
    const saveTimeout = setTimeout(saveData, 1000);
    return () => clearTimeout(saveTimeout);
  }, [notes, stickers, saveData]);

  const addNote = () => {
    const newNote: NoteType = {
      id: Date.now().toString(),
      text: 'Nueva nota',
      x: Math.random() * 80,
      y: Math.random() * 80,
      isPinned: false,
      width: 200,
      height: 200,
      color: DEFAULT_NOTE_COLOR,
    };
    setNotes([...notes, newNote]);
  };

  const addSticker = (content: string, isGif: boolean = false, gifUrl?: string) => {
    const newSticker: StickerType = {
      id: Date.now().toString(),
      content,
      x: Math.random() * 80,
      y: Math.random() * 80,
      isGif,
      gifUrl,
    };
    setStickers([...stickers, newSticker]);
    setShowStickerPicker(false);
  };

  const searchGif = async () => {
    if (!GIPHY_API_KEY) {
      console.error('GIPHY API key is not set');
      return;
    }
    try {
      const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${gifSearchTerm}&limit=9`);
      const data = await response.json();
      setGifResults(data.data);
    } catch (error) {
      console.error('Error fetching GIFs:', error);
    }
  };

  const updateNote = (id: string, newText: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, text: newText } : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const deleteSticker = (id: string) => {
    setStickers(stickers.filter(sticker => sticker.id !== id));
  };

  const togglePinNote = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const changeNoteColor = (id: string, color: NoteColor) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, color: color } : note
    ));
    setShowColorPicker(null);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (!draggedItem || !whiteboardRef.current) return;

    const whiteboardRect = whiteboardRef.current.getBoundingClientRect();
    const x = ((e.clientX - whiteboardRect.left) / whiteboardRect.width) * 100;
    const y = ((e.clientY - whiteboardRect.top) / whiteboardRect.height) * 100;

    setNotes(notes.map(note => 
      note.id === draggedItem ? { ...note, x, y } : note
    ));

    setStickers(stickers.map(sticker => 
      sticker.id === draggedItem ? { ...sticker, x, y } : sticker
    ));

    setDraggedItem(null);
  };

  const handleResizeStart = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingNote(id);
  };

  const handleResize = useCallback((e: MouseEvent) => {
    if (!resizingNote || !whiteboardRef.current) return;

    const whiteboardRect = whiteboardRef.current.getBoundingClientRect();
    setNotes(prevNotes => prevNotes.map(note => {
      if (note.id === resizingNote) {
        const newWidth = Math.max(200, e.clientX - whiteboardRect.left - (note.x / 100 * whiteboardRect.width));
        const newHeight = Math.max(200, e.clientY - whiteboardRect.top - (note.y / 100 * whiteboardRect.height));
        return { ...note, width: newWidth, height: newHeight };
      }
      return note;
    }));
  }, [resizingNote]);

  const handleResizeEnd = useCallback(() => {
    setResizingNote(null);
  }, []);

  useEffect(() => {
    if (resizingNote) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', handleResizeEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [resizingNote, handleResize, handleResizeEnd]);

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden flex flex-col">
      {/* Barra de control superior */}
      <div className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={addNote}
            className="bg-blue-500 text-white p-2 rounded flex items-center"
          >
            <StickyNote className="mr-1" /> Añadir Nota
          </button>
          <button
            onClick={() => setShowStickerPicker(!showStickerPicker)}
            className="bg-green-500 text-white p-2 rounded flex items-center"
          >
            <Sticker className="mr-1" /> Añadir Sticker/GIF
          </button>
          <button
            onClick={saveData}
            className="bg-purple-500 text-white p-2 rounded flex items-center"
          >
            <Save className="mr-1" /> Guardar
          </button>
        </div>
        <span className={`ml-2 ${
          saveStatus === 'saved' ? 'text-green-500' :
          saveStatus === 'saving' ? 'text-yellow-500' :
          'text-red-500'
        }`}>
          {saveStatus === 'saved' ? 'Guardado' :
           saveStatus === 'saving' ? 'Guardando...' :
           'Error al guardar'}
        </span>
      </div>

      {/* Pizarra */}
      <div ref={whiteboardRef} className="flex-grow relative overflow-hidden">
        <div className="absolute inset-0 p-4">
          {/* Notas */}
          {notes.map((note) => (
            <div
              key={note.id}
              className={`absolute p-2 ${note.color?.bgColor || DEFAULT_NOTE_COLOR.bgColor} ${note.color?.textColor || DEFAULT_NOTE_COLOR.textColor} rounded shadow group ${note.isPinned ? 'cursor-default' : 'cursor-move'}`}
              style={{ left: `${note.x}%`, top: `${note.y}%`, width: `${note.width}px`, height: `${note.height}px` }}
              draggable={!note.isPinned}
              onDragStart={(e) => handleDragStart(e, note.id)}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
            >
              <textarea
                className={`w-full h-full bg-transparent resize-none focus:outline-none ${note.color?.textColor || DEFAULT_NOTE_COLOR.textColor}`}
                value={note.text}
                onChange={(e) => updateNote(note.id, e.target.value)}
              />
              <button
                onClick={() => deleteNote(note.id)}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
              <button
                onClick={() => togglePinNote(note.id)}
                className={`absolute bottom-0 right-0 ${note.isPinned ? 'bg-blue-500' : 'bg-gray-500'} text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}
              >
                <PinIcon size={16} />
              </button>
              <button
                onClick={() => setShowColorPicker(note.id)}
                className="absolute top-0 left-0 bg-gray-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Palette size={16} />
              </button>
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
                onMouseDown={(e) => handleResizeStart(e, note.id)}
              >
                <CornerRightDown size={16} />
              </div>
              {showColorPicker === note.id && (
                <div className="absolute top-6 left-0 bg-white p-2 rounded shadow-lg z-10">
                  {NOTE_COLORS.map((color) => (
                    <button
                    key={color.name}
                    className={`w-6 h-6 m-1 rounded-full ${color.bgColor}`}
                    onClick={() => changeNoteColor(note.id, color)}
                    title={color.name}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Stickers y GIFs */}
        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            className="absolute cursor-move group"
            style={{ left: `${sticker.x}%`, top: `${sticker.y}%` }}
            draggable
            onDragStart={(e) => handleDragStart(e, sticker.id)}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            {sticker.isGif ? (
              <img src={sticker.gifUrl} alt={sticker.content} className="w-24 h-24 object-cover" />
            ) : (
              <span className="text-4xl" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>{sticker.content}</span>
            )}
            <button
              onClick={() => deleteSticker(sticker.id)}
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>

    {/* Selector de Stickers y GIFs */}
    {showStickerPicker && (
      <div className="absolute top-16 left-4 bg-white p-4 rounded shadow-lg max-w-md z-10">
        <div className="grid grid-cols-6 gap-2 mb-4">
          {STICKER_OPTIONS.map((sticker, index) => (
            <button
              key={index}
              onClick={() => addSticker(sticker)}
              className="text-2xl hover:bg-gray-200 rounded p-1"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
            >
              {sticker}
            </button>
          ))}
        </div>
        <div className="flex items-center mb-2">
          <input
            type="text"
            value={gifSearchTerm}
            onChange={(e) => setGifSearchTerm(e.target.value)}
            placeholder="Buscar GIF..."
            className="border rounded p-1 mr-2 flex-grow"
          />
          <button
            onClick={searchGif}
            className="bg-blue-500 text-white p-2 rounded flex items-center"
          >
            <Search className="mr-1" /> Buscar
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {gifResults.map((gif) => (
            <img
              key={gif.id}
              src={gif.images.fixed_height_small.url}
              alt={gif.title}
              className="w-full h-24 object-cover cursor-pointer"
              onClick={() => addSticker(gif.title, true, gif.images.fixed_height.url)}
            />
          ))}
        </div>
      </div>
    )}
  </div>
);
};

export default OnlineWhiteboard;