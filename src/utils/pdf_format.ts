import { TDocumentDefinitions } from "pdfmake/interfaces";
import { helper } from ".";

export const getInvoicePdf = (orderDetails: any): TDocumentDefinitions => {
  let products = [
    orderDetails.product.name,
    { text: orderDetails.quantity, alignment: "center" },
    { text: orderDetails.variant.sellingPrice, alignment: "center" },
    { text: orderDetails.quantity * orderDetails.variant.sellingPrice, alignment: "center" },
  ];

  return {
    content: [
      {
        columns: [
          [
            { text: "ORDER RECEIPT", style: "header" },
            { text: "Webmobril MarketPlace", style: "address" },
            { text: "77, Noida Address", style: "address2" },
            { text: "Cafe, Delhi 454555", style: "address2" },
          ],
          [{ image: helper.buildPath("public", "images", "logo.png"), style: "address2", alignment: "right" }],
        ],
      },
      { text: " ", style: "addres1" },
      {
        style: "tableExample",
        table: {
          widths: ["*"],
          body: [[{ text: "SHIP TO", style: "address" }], [orderDetails.shippingAddress.address]],
        },
      },

      { text: "ORDERED ITEMS", style: "address" },
      {
        style: "tableExample",
        table: {
          widths: ["*", 40, 80, 80],
          body: [
            [
              { text: "PRODUCT", style: "address" },
              { text: "QTY", style: "address", alignment: "center" },
              { text: "UNIT PRICE", style: "address", alignment: "center" },
              { text: "AMOUNT", style: "address", alignment: "center" },
            ],
            products,
          ],
        },
      },
      { text: `Shipping Charges Rs. ${orderDetails.shippingCharge || 0}`, style: "address2", alignment: "right" },
      // { text: "GST 12.0%  12.33", style: "address2", alignment: "right" },
      { text: " ", style: "address2" },
      { text: `TOTAL  Rs. ${orderDetails.total || 0}`, style: "address", alignment: "right" },
      { text: " ", style: "header" },
      {
        columns: [
          [{ text: "THANK YOU", style: "address", alignment: "left" }],
          // [
          //   { text: "TERMS & CONDITIONS", style: "address2", alignment: "right" },
          //   { text: "PAYMENT is Due within 15 Days", alignment: "right" },
          //   { text: "State Bank of India", alignment: "right" },
          // ],
        ],
      },
    ],
    styles: {
      header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      address: { fontSize: 14, bold: true, margin: [0, 2, 0, 2] },
      address2: { fontSize: 12, bold: true, margin: [0, 2, 0, 2] },
      tableExample: { margin: [0, 5, 0, 15] },
    },
  };
};
