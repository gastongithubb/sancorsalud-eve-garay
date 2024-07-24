'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sticker, StickyNote, X, PinIcon, Save } from 'lucide-react';

type NoteType = {
  id: string;
  text: string;
  x: number;
  y: number;
  isPinned: boolean;
};

type StickerType = {
  id: string;
  emoji: string;
  x: number;
  y: number;
};

const OnlineWhiteboard = () => {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [stickers, setStickers] = useState<StickerType[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
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
    
    if (savedNotes) setNotes(JSON.parse(savedNotes));
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
    };
    setNotes([...notes, newNote]);
  };

  const addSticker = () => {
    const emojis = ['😊', '🚀', '💡', '🎉'];
    const newSticker: StickerType = {
      id: Date.now().toString(),
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * 80,
      y: Math.random() * 80,
    };
    setStickers([...stickers, newSticker]);
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

  return (
    <div ref={whiteboardRef} className="relative w-full h-screen bg-gray-100 overflow-hidden">
      {/* Pizarra */}
      <div className="absolute inset-0 p-4">
        {/* Notas */}
        {notes.map((note) => (
          <div
            key={note.id}
            className={`absolute p-2 bg-yellow-200 rounded shadow group ${note.isPinned ? 'cursor-default' : 'cursor-move'}`}
            style={{ left: `${note.x}%`, top: `${note.y}%` }}
            draggable={!note.isPinned}
            onDragStart={(e) => handleDragStart(e, note.id)}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            <textarea
              className="w-32 h-32 bg-transparent resize-none focus:outline-none"
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
          </div>
        ))}

        {/* Stickers */}
        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            className="absolute text-4xl cursor-move group"
            style={{ left: `${sticker.x}%`, top: `${sticker.y}%` }}
            draggable
            onDragStart={(e) => handleDragStart(e, sticker.id)}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            {sticker.emoji}
            <button
              onClick={() => deleteSticker(sticker.id)}
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Controles */}
      <div className="absolute bottom-4 left-4 space-x-2 flex items-center">
        <button
          onClick={addNote}
          className="bg-blue-500 text-white p-2 rounded flex items-center"
        >
          <StickyNote className="mr-1" /> Añadir Nota
        </button>
        <button
          onClick={addSticker}
          className="bg-green-500 text-white p-2 rounded flex items-center"
        >
          <Sticker className="mr-1" /> Añadir Sticker
        </button>
        <button
          onClick={saveData}
          className="bg-purple-500 text-white p-2 rounded flex items-center"
        >
          <Save className="mr-1" /> Guardar
        </button>
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
    </div>
  );
};

export default OnlineWhiteboard;