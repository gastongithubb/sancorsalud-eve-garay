// pages/api/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { logout } from '../../lib/login';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await logout(res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}