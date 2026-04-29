import { Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

export const createPost = async (req: any, res: Response) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title,
          description,
          user_id: userId,
          created_at: new Date(),
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      message: 'Post created successfully',
      post: data,
    });
  } catch (error) {
    console.error('Create post error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ posts: data });
  } catch (error) {
    console.error('Get posts error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePost = async (req: any, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Check ownership
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.user_id !== userId) {
      return res.status(403).json({ error: 'Forbidden: You are not the owner of this post' });
    }

    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return res.status(400).json({ error: deleteError.message });
    }

    return res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
