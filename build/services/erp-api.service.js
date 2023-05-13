"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const models_1 = require("../models");
const utils_1 = require("../utils");
const interfaces_1 = require("../utils/interfaces");
const cspLogin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield axios_1.default.post(`https://app4.ziperp.net/api/CommonAPI/ZIPSFA/SFACSPLogin/CSPLogin`, {
            EnterpriseId: "MITTALORGANICS",
            UserId: "abc",
            Password: "123",
            TenantId: "17f05c4d-c07c-43e7-b14d-462ea7f99a4f",
            Location: "",
            DeviceId: "",
            UserToken: "",
        });
        return result.data;
    }
    catch (error) {
        throw error;
    }
});
const cspItemList = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield axios_1.default.post(`https://Pro.ziperp.net/api/CommonAPI/ZIPSFA/SFACSP/CSPItemList`, {
            EnterpriseId: "Zavia",
            TenantId: "f184008f-1e83-43b5-8a50-674141fc3e8e",
            CSPUserId: "acd83454-6b05-4fb4-b172-c74f22848270",
        });
        return result.data;
    }
    catch (error) {
        throw error;
    }
});
const postOnlineOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield axios_1.default.post(`http://app.accusol.com/ziperp/api/CommonAPI/ZIPSFA/SFAOnlineOrder/SendOrder`, {
            EnterpriseId: "ZipERP_0001",
            TenantId: "0782abba-b183-4b3d-baa4-c0bf3190e756",
            UserId: "demo@demo.com",
            UserTableId: "781A96C2-8347-4070-B8D8-8F3D36DA0B83",
            CustomerId: "781A96C2-8347-4070-B8D8-8F3D36DA0B83",
            Json_ItemTransData: '[\n  {\n    "ItemId": "039c19f5-71d7-4c5a-b4dc-441c868164c6",\n    "Qty": 5.0\n  }\n]',
            CurrencyId: "2dca24ef-b369-4907-aed0-3542a9d0b69c",
            RetailCust_MobileNo: "",
            RetailCust_Name: "",
            RetailCust_PhoneNo: "",
            RetailCust_EmailId: "",
            RetailCust_Address: "",
            RetailCust_AreaId: "",
            RetailCust_RegionId: "",
            RetailCust_TerritoryId: "",
            CSPUserId: "781A96C2-8347-4070-B8D8-8F3D36DA0B83",
        });
        return result.data;
    }
    catch (error) {
        throw error;
    }
});
const monitorOnlineOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield axios_1.default.post(`http://app.accusol.com/ziperp/api/CommonAPI/ZIPSFA/SFAOnlineOrder/OnlineOrderMonitoring`, {
            EnterpriseId: "ZipERP_0001",
            TenantId: "0782abba-b183-4b3d-baa4-c0bf3190e756",
            ObjectType: "OnlineOrderMaster",
            jtStartIndex: "0",
            jtPageSize: "10",
            jtSorting: "",
            Filters: "",
            CSPUserId: "781A96C2-8347-4070-B8D8-8F3D36DA0B83",
        });
        return result.data;
    }
    catch (error) {
        throw error;
    }
});
const getCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield axios_1.default.post(`http://app.accusol.com/ziperp/api/CommonAPI/ZIPSFA/SFAOnlineOrder/OnlineOrderMonitoring`, {
        EnterpriseId: "ZipERP_0001",
        TenantId: "0782abba-b183-4b3d-baa4-c0bf3190e756",
        ObjectType: "OnlineOrderMaster",
        jtStartIndex: "0",
        jtPageSize: "10",
        jtSorting: "",
        Filters: "",
        CSPUserId: "781A96C2-8347-4070-B8D8-8F3D36DA0B83",
    });
    return result.data;
});
const setProductData = (erpProduct) => __awaiter(void 0, void 0, void 0, function* () {
    // erpProduct.ItemGroupId;
    var _a;
    let existsProduct = yield models_1.productModel.findOne({
        $or: [
            { erpId: erpProduct.Id },
            { name: { $regex: utils_1.helper.regxEscape(erpProduct.Name), $options: "i" } },
        ],
    });
    if (existsProduct)
        return;
    let product = {
        erpId: erpProduct.Id,
        description: erpProduct.Description,
        images: ((_a = erpProduct.ItemImage) === null || _a === void 0 ? void 0 : _a.length) > 1 ? [erpProduct.ItemImage] : [],
        isApproved: interfaces_1.ApprovalStatus.APPROVED,
        metaDescription: erpProduct.Description,
        name: erpProduct.Name,
        status: true,
        variants: [
            {
                variant: {
                    sellingPrice: erpProduct.SalesPrice,
                    mrp: erpProduct.MRP,
                    badalDaloPrice: 0,
                    quantity: erpProduct.ItemClosingBal,
                    SKU: "storeroom123",
                },
            },
        ],
        tags: [],
        brand: null,
        // erpProduct.ItemGroupId,
        category: null,
        subCategory: null,
        subCategories: [],
        mainCategories: [],
    };
    yield models_1.productModel.create(product);
});
const saveErpDataIntoMarketPlace = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let modifiedProducts: any[] = [];
        // let erpData: any = await cspItemList();
        // let erpProducts: ErpProduct[] = erpData?.dtCSPItemList || [];
        // for await (let item of erpProducts) {
        //   modifiedProducts.push(await setProductData(item));
        // }
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    cspLogin,
    cspItemList,
    postOnlineOrder,
    monitorOnlineOrder,
    saveErpDataIntoMarketPlace,
};
