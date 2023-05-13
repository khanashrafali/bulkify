import { NextFunction, Request, Response } from "express";
import { roleService } from "../services";
import { helper } from "../utils";

const addRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await roleService.addRole(req.body);
    return helper.buildResponse(res, "Role Added", result);
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await roleService.updateRole(req.params.roleId, req.body);
    return helper.buildResponse(res, "Role Updated", result);
  } catch (error) {
    next(error);
  }
};

const getRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await roleService.getRole(req.params.roleId);
    return helper.buildResponse(res, "Fetched Role", result);
  } catch (error) {
    next(error);
  }
};

const getRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await roleService.getRoles(req.query);
    return helper.buildResponse(res, "Fetched Roles", result);
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await roleService.deleteRole(req.params.roleId);
    return helper.buildResponse(res, "Role Deleted", result);
  } catch (error) {
    next(error);
  }
};

export default {
  addRole,
  updateRole,
  getRole,
  deleteRole,
  getRoles,
};
