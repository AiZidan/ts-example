import { Router } from 'express';
import { PostController } from '../controllers/PostController';
import { PostService } from '../services/PostService';
import { PostRepository } from '../repositories/PostRepository';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { validate, validateParams, validateBody } from '../middleware/validation';
import { CreatePostSchema, UpdatePostSchema } from '../models/Post';
import { 
  IdParamSchema, 
  PaginationQuerySchema, 
  SlugParamSchema,
  StatusQuerySchema,
  TagsQuerySchema 
} from '../utils/validation-schemas';

const router = Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const postRepository = new PostRepository();
const postService = new PostService(postRepository, userService);
const postController = new PostController(postService);

router.get(
  '/',
  validate({ query: PaginationQuerySchema }),
  postController.getAll
);

router.get(
  '/published',
  postController.findPublishedPosts
);

router.get(
  '/stats',
  postController.getPostStats
);

router.get(
  '/tags',
  validate({ query: TagsQuerySchema }),
  postController.findByTags
);

router.get(
  '/status/:status',
  validate({ params: StatusQuerySchema }),
  postController.findByStatus
);

router.get(
  '/author/:authorId',
  validateParams(IdParamSchema.pick({ id: true }).extend({ authorId: IdParamSchema.shape.id })),
  postController.findByAuthor
);

router.get(
  '/slug/:slug',
  validateParams(SlugParamSchema),
  postController.findBySlug
);

router.get(
  '/:id',
  validateParams(IdParamSchema),
  postController.getById
);

router.post(
  '/',
  validateBody(CreatePostSchema),
  postController.create
);

router.put(
  '/:id',
  validateParams(IdParamSchema),
  validateBody(UpdatePostSchema),
  postController.update
);

router.patch(
  '/:id/publish',
  validateParams(IdParamSchema),
  postController.publishPost
);

router.patch(
  '/:id/view',
  validateParams(IdParamSchema),
  postController.incrementViewCount
);

router.delete(
  '/:id',
  validateParams(IdParamSchema),
  postController.delete
);

export default router;