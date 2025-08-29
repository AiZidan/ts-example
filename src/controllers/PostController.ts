import { Request, Response } from 'express';
import { PostService } from '../services/PostService';
import { BaseController } from './BaseController';
import { Post } from '../models/Post';
import { ResponseHelper } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { NotFoundError, ValidationError } from '../utils/errors';
import { PostStatus } from '../types/common';

export class PostController extends BaseController<Post> {
  constructor(private postService: PostService) {
    super(postService);
  }

  protected getResourceName(): string {
    return 'Post';
  }

  findByAuthor = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { authorId } = req.params;
    const posts = await this.postService.findByAuthor(authorId);
    return ResponseHelper.success(res, posts);
  });

  findByStatus = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { status } = req.params;
    
    if (!Object.values(PostStatus).includes(status as PostStatus)) {
      throw new ValidationError(`Invalid status: ${status}`);
    }

    const posts = await this.postService.findByStatus(status as PostStatus);
    return ResponseHelper.success(res, posts);
  });

  findBySlug = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;
    const post = await this.postService.findBySlug(slug);

    if (!post) {
      throw new NotFoundError('Post', `with slug ${slug}`);
    }

    await this.postService.incrementViewCount(post.id);
    
    return ResponseHelper.success(res, post);
  });

  findPublishedPosts = asyncHandler(async (_req: Request, res: Response): Promise<Response> => {
    const posts = await this.postService.findPublishedPosts();
    return ResponseHelper.success(res, posts);
  });

  findByTags = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { tags } = req.query;
    
    if (!tags || typeof tags !== 'string') {
      throw new ValidationError('Tags query parameter is required');
    }

    const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    if (tagArray.length === 0) {
      throw new ValidationError('At least one tag must be provided');
    }

    const posts = await this.postService.findByTags(tagArray);
    return ResponseHelper.success(res, posts);
  });

  publishPost = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const post = await this.postService.publishPost(id);

    if (!post) {
      throw new NotFoundError(this.getResourceName(), id);
    }

    return ResponseHelper.success(res, post);
  });

  getPostStats = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { authorId } = req.query;
    
    const stats = await this.postService.getPostStats(
      typeof authorId === 'string' ? authorId : undefined
    );
    
    return ResponseHelper.success(res, stats);
  });

  incrementViewCount = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const post = await this.postService.incrementViewCount(id);

    if (!post) {
      throw new NotFoundError(this.getResourceName(), id);
    }

    return ResponseHelper.success(res, post);
  });
}