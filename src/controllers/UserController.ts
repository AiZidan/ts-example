import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { BaseController } from './BaseController';
import { User } from '../models/User';
import { ResponseHelper } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { NotFoundError, ValidationError } from '../utils/errors';
import { UserRole } from '../types/common';

export class UserController extends BaseController<User> {
  constructor(private userService: UserService) {
    super(userService);
  }

  protected getResourceName(): string {
    return 'User';
  }

  findByEmail = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { email } = req.query;
    
    if (!email || typeof email !== 'string') {
      throw new ValidationError('Email query parameter is required');
    }

    const user = await this.userService.findByEmail(email);
    
    if (!user) {
      throw new NotFoundError('User', `with email ${email}`);
    }

    return ResponseHelper.success(res, user);
  });

  findByRole = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { role } = req.params;
    
    if (!Object.values(UserRole).includes(role as UserRole)) {
      throw new ValidationError(`Invalid role: ${role}`);
    }

    const users = await this.userService.findByRole(role as UserRole);
    return ResponseHelper.success(res, users);
  });

  findActiveUsers = asyncHandler(async (_req: Request, res: Response): Promise<Response> => {
    const users = await this.userService.findActiveUsers();
    return ResponseHelper.success(res, users);
  });

  deactivateUser = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const user = await this.userService.deactivateUser(id);

    if (!user) {
      throw new NotFoundError(this.getResourceName(), id);
    }

    return ResponseHelper.success(res, user);
  });

  activateUser = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const user = await this.userService.activateUser(id);

    if (!user) {
      throw new NotFoundError(this.getResourceName(), id);
    }

    return ResponseHelper.success(res, user);
  });

  changeRole = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { role } = req.body;

    if (!Object.values(UserRole).includes(role)) {
      throw new ValidationError(`Invalid role: ${role}`);
    }

    const user = await this.userService.changeRole(id, role);

    if (!user) {
      throw new NotFoundError(this.getResourceName(), id);
    }

    return ResponseHelper.success(res, user);
  });

  updateLastLogin = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const user = await this.userService.updateLastLogin(id);

    if (!user) {
      throw new NotFoundError(this.getResourceName(), id);
    }

    return ResponseHelper.success(res, user);
  });
}