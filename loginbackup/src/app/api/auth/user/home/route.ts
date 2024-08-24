import { NextResponse } from "next/server";
import { doQuery } from "@/lib/db.mjs";

// Handle GET request to fetch posts
export async function GET(request: Request) {
    try {
        // Assume user_id is sent as a query parameter or derived from session
        const user_id = 2; // Replace with actual user_id extraction logic

        const query = `
            SELECT p.*, 
                   COUNT(DISTINCT l.id) as like_count,
                   json_agg(json_build_object(
                       'id', c.id,
                       'content', c.content,
                       'created_at', c.created_at,
                       'user_id', c.user_id
                   )) as comments,
                   EXISTS (
                       SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = $1
                   ) as liked_by_user
            FROM posts p
            LEFT JOIN likes l ON p.id = l.post_id
            LEFT JOIN comments c ON p.id = c.post_id
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

// Handle POST request to add a comment
export async function POST(request: Request) {
    try {
        const { post_id, user_id, content } = await request.json();

        const insertCommentQuery = `
            INSERT INTO comments (post_id, user_id, content, created_at)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
            RETURNING *
        `;
        const comment = await doQuery(insertCommentQuery, [post_id, user_id, content]);

        return NextResponse.json(comment[0]);
    } catch (error) {
        console.error('Error adding comment:', error);
        return NextResponse.error();
    }
}

// Handle PATCH request to add a like
export async function PATCH(request: Request) {
    try {
        const { post_id, user_id } = await request.json();

        // Check if the user has already liked the post
        const checkLikeQuery = `
            SELECT * FROM likes WHERE post_id = $1 AND user_id = $2
        `;
        const existingLike = await doQuery(checkLikeQuery, [post_id, user_id]);

        if (existingLike.length > 0) {
            return NextResponse.json({ error: "User has already liked this post." }, { status: 400 });
        }

        const insertLikeQuery = `
            INSERT INTO likes (post_id, user_id)
            VALUES ($1, $2)
            RETURNING *
        `;
        await doQuery(insertLikeQuery, [post_id, user_id]);

        // Get updated like count
        const likeCountQuery = `
            SELECT COUNT(*) as like_count FROM likes WHERE post_id = $1
        `;
        const likeCountResult = await doQuery(likeCountQuery, [post_id]);
        const likeCount = likeCountResult[0].like_count;

        return NextResponse.json({ like_count: likeCount });
    } catch (error) {
        console.error('Error adding like:', error);
        return NextResponse.error();
    }
}