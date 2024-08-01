'use client'

import React, { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  username: string;
  password: string;
  name: string;
  isAdmin: boolean;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({ username: '', password: '', name: '', isAdmin: false });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const res = await fetch('/api/check-admin');
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Not authorized');
        }
        await fetchUsers();
      } catch (error) {
        console.error('Error checking admin status:', error);
        if (error instanceof Error) {
          toast.error(error.message === 'Not authenticated' 
            ? 'Please log in to access this page' 
            : 'You are not authorized to view this page');
        }
        router.push('/Login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await res.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users. Please try again.');
    }
  };

  const handleAddUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        throw new Error('Failed to add user');
      }

      await fetchUsers();
      setNewUser({ username: '', password: '', name: '', isAdmin: false });
      toast.success('User added successfully');
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Users:</h2>
        {users.length > 0 ? (
          <ul className="bg-white shadow-md rounded-lg divide-y">
            {users.map((user) => (
              <li key={user.username} className="p-4 hover:bg-gray-50">
                <span className="font-medium">{user.name}</span> ({user.username}) - 
                <span className={user.isAdmin ? "text-green-600" : "text-blue-600"}>
                  {user.isAdmin ? ' Admin' : ' User'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Add New User:</h2>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <input
              type="text"
              value={newUser.username}
              onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              placeholder="Username"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              placeholder="Password"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              placeholder="Full Name"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newUser.isAdmin}
                onChange={(e) => setNewUser({...newUser, isAdmin: e.target.checked})}
                className="mr-2"
              />
              Is Admin
            </label>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add User
          </button>
        </form>
      </div>
    </div>
  );
}