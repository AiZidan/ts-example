import { Post, CreatePostInput, UpdatePostInput } from '../models/Post';
import { PostRepository } from '../repositories/PostRepository';
import { UserService } from './UserService';
import { BaseService } from './BaseService';
import { PostStatus } from '../types/common';

export class PostService extends BaseService<Post> {
  constructor(
    private postRepository: PostRepository,
    private userService: UserService
  ) {
    super(postRepository);
  }

  async findByAuthor(authorId: string): Promise<Post[]> {
    return this.postRepository.findByAuthor(authorId);
  }

  async findByStatus(status: PostStatus): Promise<Post[]> {
    return this.postRepository.findByStatus(status);
  }

  async findBySlug(slug: string): Promise<Post | null> {
    return this.postRepository.findBySlug(slug);
  }

  async findPublishedPosts(): Promise<Post[]> {
    return this.postRepository.findPublishedPosts();
  }

  async findByTags(tags: string[]): Promise<Post[]> {
    return this.postRepository.findByTags(tags);
  }

  async createPost(postData: CreatePostInput): Promise<Post> {
    const estimatedReadTime = this.calculateReadTime(postData.content);
    
    const post: Omit<Post, keyof import('../types/common').BaseEntity> = {
      ...postData,
      excerpt: postData.excerpt || this.generateExcerpt(postData.content),
      viewCount: 0,
      metadata: {
        ...postData.metadata,
        estimatedReadTime,
      },
    };

    return this.create(post);
  }

  async updatePost(id: string, updates: UpdatePostInput): Promise<Post | null> {
    if (updates.content) {
      const estimatedReadTime = this.calculateReadTime(updates.content);
      updates.metadata = {
        ...updates.metadata,
        estimatedReadTime,
      };
    }

    if (updates.excerpt === undefined && updates.content) {
      updates.excerpt = this.generateExcerpt(updates.content);
    }

    return this.update(id, updates);
  }

  async publishPost(id: string): Promise<Post | null> {
    const post = await this.findById(id);
    if (!post) {
      return null;
    }

    if (post.status === PostStatus.PUBLISHED) {
      throw new Error('Post is already published');
    }

    return this.postRepository.publishPost(id);
  }

  async incrementViewCount(id: string): Promise<Post | null> {
    return this.postRepository.incrementViewCount(id);
  }

  async getPostStats(authorId?: string): Promise<{
    total: number;
    published: number;
    draft: number;
    archived: number;
  }> {
    let posts: Post[];
    
    if (authorId) {
      posts = await this.findByAuthor(authorId);
    } else {
      posts = await this.findAll();
    }

    return {
      total: posts.length,
      published: posts.filter(p => p.status === PostStatus.PUBLISHED).length,
      draft: posts.filter(p => p.status === PostStatus.DRAFT).length,
      archived: posts.filter(p => p.status === PostStatus.ARCHIVED).length,
    };
  }

  private generateExcerpt(content: string, maxLength: number = 200): string {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength).trim() + '...'
      : plainText;
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  protected async validateCreate(data: Omit<Post, keyof import('../types/common').BaseEntity>): Promise<void> {
    const authorExists = await this.userService.exists(data.authorId);
    if (!authorExists) {
      throw new Error(`Author with ID ${data.authorId} does not exist`);
    }

    const existingPost = await this.postRepository.findBySlug(data.slug);
    if (existingPost) {
      throw new Error(`Post with slug '${data.slug}' already exists`);
    }
  }

  protected async validateUpdate(id: string, updates: Partial<Omit<Post, keyof import('../types/common').BaseEntity>>): Promise<void> {
    if (updates.authorId) {
      const authorExists = await this.userService.exists(updates.authorId);
      if (!authorExists) {
        throw new Error(`Author with ID ${updates.authorId} does not exist`);
      }
    }

    if (updates.slug) {
      const existingPost = await this.postRepository.findBySlug(updates.slug);
      if (existingPost && existingPost.id !== id) {
        throw new Error(`Post with slug '${updates.slug}' already exists`);
      }
    }
  }

  protected async validateDelete(_id: string): Promise<void> {
    // No special validation needed for post deletion
  }
}