export const placeOrderUserMailTemplate = (orderInfo: any) => {
  return `
  <p>Hi ${orderInfo?.user?.name || "User"},</p>

  <p>Your Order Placed Successfully.</p>

  <p>Date: ${orderInfo.date}</p>
  <p>Order ID: ${orderInfo.orderId}</p>
  <p>Order Amount: ${orderInfo.variant.sellingPrice}</p>

  <p>Regards</p>
  <p>Team Bubblix Manihar</p>
  `;
};
