'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/AuthContext';
import Image from 'next/image';

const ProfilePictureUpload: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const { user, updateUser, getToken } = useAuth();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const token = getToken();
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('/api/update-profile-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload profile picture');
      }

      const data = await response.json();
      if (user && data.profilePictureUrl) {
        const updatedUser = { ...user, profilePicture: data.profilePictureUrl };
        updateUser(updatedUser);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error updating profile picture:', err);
      setError(err instanceof Error ? err.message : 'Error al subir la imagen. Por favor, intenta de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <label htmlFor="profile-picture" className="block text-sm font-medium text-gray-700">
        Foto de perfil
      </label>
      <div className="mt-1 flex items-center">
        {user?.profilePicture && (
          <Image
            src={user.profilePicture}
            alt="Foto de perfil"
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
        )}
        <input
          id="profile-picture"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      {isUploading && <p className="mt-2 text-sm text-gray-500">Subiendo imagen...</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ProfilePictureUpload;