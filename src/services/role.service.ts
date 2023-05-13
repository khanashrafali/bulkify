import { roleModel } from "../models";
import { helper } from "../utils";

const addRole = async (body: any) => {
  try {
    return await roleModel.create(body);
  } catch (error) {
    throw error;
  }
};

const updateRole = async (vid: string, body: any) => {
  try {
    let role = await roleModel.findOne({ _id: vid });
    if (!role) throw helper.buildError("no role found with this id", 404);
    return await role.set(body).save();
  } catch (error) {
    throw error;
  }
};

const getRole = async (vid: string) => {
  try {
    let role = await roleModel.findOne({ _id: vid });
    if (!role) throw helper.buildError("no role found with this id", 404);
    return role;
  } catch (error) {
    throw error;
  }
};

const getRoles = async (queryParams: any) => {
  try {
    let conditions: any = {};
    return await roleModel.find(conditions);
  } catch (error) {
    throw error;
  }
};

const deleteRole = async (vid: string) => {
  try {
    let role = await roleModel.findOne({ _id: vid });
    if (!role) throw helper.buildError("no role found with this id", 404);
    return await role.delete();
  } catch (error) {
    throw error;
  }
};

export default {
  addRole,
  updateRole,
  getRole,
  getRoles,
  deleteRole,
};
