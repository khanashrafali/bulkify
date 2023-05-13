export const returnOrderBankMailTemplate = (orderInfo: any) => {
  return `
  <p>Hi HDFC Bank,</p>

  <p>Please find below the order details for which refund to be executed.</p>

  <p>Date: ${orderInfo.date}</p>
  <p>Order ID: ${orderInfo.orderId}</p>
  <p>Order Amount: ${orderInfo.variant.sellingPrice}</p>

  <p>Please process the same at your earliest.</p>

  <p>Regards</p>
  <p>Team Bubblix Manihar</p>

  <p>This will be done manually , Bubblix team will share the order details of the customer to the email id : ecomsupport.delhi@hdfcbank.com to process refund to the customer.</p>
  `;
};

export const returnOrderUserMailTemplate = (orderInfo: any) => {
  return `
  <p>Hi ${orderInfo?.user?.name || "User"},</p>

  <p>Your Order is Returned Successfully.</p>

  <p>Date: ${orderInfo.date}</p>
  <p>Order ID: ${orderInfo.orderId}</p>
  <p>Order Amount: ${orderInfo.variant.sellingPrice}</p>

  <p>Regards</p>
  <p>Team Bubblix Manihar</p>
  `;
};
