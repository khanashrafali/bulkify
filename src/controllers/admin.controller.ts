import { NextFunction, Request, Response } from "express";
import { adminService } from "../services";
import { helper } from "../utils";

/**
 * get app admin users api
 */
const getAdminUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await adminService.getAdmins(req.query);
    helper.buildResponse(res, "Admin Users fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

const postAddAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await adminService.addAdmin(req.body.name, req.body.email, req.body.adminRole, res);
  } catch (error) {
    next(error);
  }
};

const patchUpdateAdminActiveStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await adminService.updateAdminActiveStatus(req.params.adminId, req.body.status);
    return helper.buildResponse(res, "Admin status updated", result);
  } catch (error) {
    next(error);
  }
};

const saveConfigInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await adminService.saveConfigInfo(req.body);
    return helper.buildResponse(res, "Config Info Updated.", result);
  } catch (error) {
    next(error);
  }
};

const getConfigInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await adminService.getConfigInfo();
    return helper.buildResponse(res, "Fetched Config Info.", result);
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await adminService.deleteAdmin(req.params.adminId);
    return helper.buildResponse(res, "Admin deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

export default {
  getAdminUsers,
  postAddAdmin,
  patchUpdateAdminActiveStatus,
  saveConfigInfo,
  getConfigInfo,
  deleteAdmin,
};
