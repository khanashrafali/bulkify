import { queriesModel } from "../models";
import { emailHandler, helper } from "../utils";

helper.loadEnvFile();

const saveQueiry = async (data: any) => {
  try {
    await queriesModel.create(data);
    await emailHandler.sentMail(
      "mmanihar.in@gmail.com",
      `${data.name}`,
      `
       <p> ${data.message} </p>

        Thanks & Regards
        ${data.name}
        ${data.email}
    `
    );
  } catch (error) {
    throw error;
  }
};

const getQueries = async (queryParams: any) => {
  try {
    const pageInfo = helper.checkPagination(queryParams);
    const mongoQuery = queriesModel.find();
    let docs: any[] = [];
    const count = await queriesModel.countDocuments();

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

const getQuery = async (id: string) => {
  try {
    const data = await queriesModel.findOne({ _id: id });
    if (!data) throw helper.buildError("no data found with this id", 404);
    return data;
  } catch (error) {
    throw error;
  }
};

export default {
  saveQueiry,
  getQueries,
  getQuery,
};
