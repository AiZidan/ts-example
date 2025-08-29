import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { validate, validateParams, validateBody } from '../middleware/validation';
import { CreateUserSchema, UpdateUserSchema } from '../models/User';
import { 
  IdParamSchema, 
  PaginationQuerySchema, 
  RoleQuerySchema 
} from '../utils/validation-schemas';

const router = Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get(
  '/',
  validate({ query: PaginationQuerySchema }),
  userController.getAll
);

router.get(
  '/search',
  userController.findByEmail
);

router.get(
  '/active',
  userController.findActiveUsers
);

router.get(
  '/role/:role',
  validate({ params: RoleQuerySchema }),
  userController.findByRole
);

router.get(
  '/:id',
  validateParams(IdParamSchema),
  userController.getById
);

router.post(
  '/',
  validateBody(CreateUserSchema),
  userController.create
);

router.put(
  '/:id',
  validateParams(IdParamSchema),
  validateBody(UpdateUserSchema),
  userController.update
);

router.patch(
  '/:id/deactivate',
  validateParams(IdParamSchema),
  userController.deactivateUser
);

router.patch(
  '/:id/activate',
  validateParams(IdParamSchema),
  userController.activateUser
);

router.patch(
  '/:id/role',
  validateParams(IdParamSchema),
  userController.changeRole
);

router.patch(
  '/:id/login',
  validateParams(IdParamSchema),
  userController.updateLastLogin
);

router.delete(
  '/:id',
  validateParams(IdParamSchema),
  userController.delete
);

export default router;