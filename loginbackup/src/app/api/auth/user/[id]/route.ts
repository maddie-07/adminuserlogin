import { NextResponse } from "next/server";
import { doQuery } from "@/lib/db.mjs";

export async function GET(request: Request, { params }: { params: { user_id: string } }) {
    const { user_id } = params;

    try {
        const query = `
            SELECT p.*, COUNT(DISTINCT l.id) as like_count,
                   json_agg(json_build_object(
                       'id', c.id,
                       'content', c.content,
                       'created_at', c.created_at,
                       'user_id', c.user_id
                   )) as comments
            FROM posts p
            LEFT JOIN likes l ON p.id = l.post_id
            LEFT JOIN comments c ON p.id = c.post_id
            WHERE p.user_id = $1
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `;
        const posts = await doQuery(query, [user_id]);
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.error();
    }
}