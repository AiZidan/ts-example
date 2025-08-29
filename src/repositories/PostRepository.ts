import { Post, PostStatus } from '../models/Post';
import { BaseRepository } from './BaseRepository';

export class PostRepository extends BaseRepository<Post> {
  async findByAuthor(authorId: string): Promise<Post[]> {
    return this.items.filter(post => post.authorId === authorId);
  }

  async findByStatus(status: PostStatus): Promise<Post[]> {
    return this.items.filter(post => post.status === status);
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const post = this.items.find(post => post.slug === slug);
    return post || null;
  }

  async findPublishedPosts(): Promise<Post[]> {
    return this.items.filter(post => 
      post.status === PostStatus.PUBLISHED && 
      post.publishedAt && 
      post.publishedAt <= new Date()
    );
  }

  async findByTags(tags: string[]): Promise<Post[]> {
    return this.items.filter(post => 
      tags.some(tag => post.tags.includes(tag))
    );
  }

  protected applySearch(items: Post[], searchTerm: string): Post[] {
    const term = searchTerm.toLowerCase();
    return items.filter(post => 
      post.title.toLowerCase().includes(term) ||
      post.content.toLowerCase().includes(term) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(term)) ||
      post.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }

  async incrementViewCount(id: string): Promise<Post | null> {
    const post = await this.findById(id);
    if (!post) {
      return null;
    }

    return this.update(id, {
      viewCount: post.viewCount + 1,
    });
  }

  async publishPost(id: string): Promise<Post | null> {
    return this.update(id, {
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
    });
  }
}