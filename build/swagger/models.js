"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = exports.TSOAVariantOptionType = exports.TSOAField = exports.TSOAConditionEnum = void 0;
var TSOAConditionEnum;
(function (TSOAConditionEnum) {
    TSOAConditionEnum["Contains"] = "CONTAINS";
    TSOAConditionEnum["EndsWith"] = "ENDS_WITH";
    TSOAConditionEnum["Equals"] = "EQUALS";
    TSOAConditionEnum["GreaterThan"] = "GREATER_THAN";
    TSOAConditionEnum["LessThan"] = "LESS_THAN";
    TSOAConditionEnum["StartsWith"] = "STARTS_WITH";
})(TSOAConditionEnum = exports.TSOAConditionEnum || (exports.TSOAConditionEnum = {}));
var TSOAField;
(function (TSOAField) {
    TSOAField["Title"] = "TITLE";
    TSOAField["Type"] = "TYPE";
    TSOAField["VariantCompareAtPrice"] = "VARIANT_COMPARE_AT_PRICE";
    TSOAField["VariantPrice"] = "VARIANT_PRICE";
    TSOAField["Vendor"] = "VENDOR";
})(TSOAField = exports.TSOAField || (exports.TSOAField = {}));
var TSOAVariantOptionType;
(function (TSOAVariantOptionType) {
    TSOAVariantOptionType["Color"] = "Color";
    TSOAVariantOptionType["Material"] = "Material";
    TSOAVariantOptionType["Size"] = "Size";
})(TSOAVariantOptionType = exports.TSOAVariantOptionType || (exports.TSOAVariantOptionType = {}));
var Type;
(function (Type) {
    Type["Point"] = "Point";
})(Type = exports.Type || (exports.Type = {}));
