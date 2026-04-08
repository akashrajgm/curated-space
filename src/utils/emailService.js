/**
 * Antigravity Communication Layer - Mock Email Service
 * This service simulates production-ready email dispatches for the frontend-to-backend handshake.
 */

export const sendOrderConfirmation = (orderData) => {
  const { name, email, items, total } = orderData;
  const itemNames = items.map(i => i.title || i.name).join(', ');

  const payload = {
    to: email,
    subject: "CuratedSpace - Order Confirmation",
    templateData: {
      customerName: name,
      orderItems: items.map(i => i.title || i.name),
      orderTotal: total,
      cta: "Track Your Order",
      message: "Thank you for choosing CuratedSpace."
    }
  };

  console.log(`
%c 📧 ANTIGRAVITY EMAIL DISPATCH (Simulation Mode) 
%c
${JSON.stringify(payload, null, 2)}
`, 
'background: #10b981; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
'color: #10b981; font-family: monospace; font-size: 1.1em;'
  );
};
