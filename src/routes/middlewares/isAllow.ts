import { NextFunction, Request, Response } from "express";
import { helper } from "../../utils";
import { IRequest, UserRole } from "../../utils/interfaces";

const isAllow = (allowedRoles: UserRole[]) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    let iReq: any = req as IRequest;
    if (!allowedRoles.includes(iReq.role)) throw helper.buildError("Unautorize", 401);
    next();
  } catch (err: any) {
    next(err);
  }
};

export { isAllow };
