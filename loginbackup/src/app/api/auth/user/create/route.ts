// app/api/posts/create/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { doQuery } from '@/lib/db.mjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { issue_id, content, user_id, image } = req.body;

    try {
      const result = await doQuery(
        `
        INSERT INTO posts (issue_id, content, user_id, image)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [issue_id, content, user_id, image]
      );
      res.status(201).json(result[0]);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}