// pages/api/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { login } from '../../lib/login';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await login(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}