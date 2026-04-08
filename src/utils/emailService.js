/**
 * Antigravity Communication Layer - Mock Email Service
 * This service simulates production-ready email dispatches for the frontend-to-backend handshake.
 */

export const sendOrderConfirmation = (orderData) => {
  const { name, email, items, total } = orderData;
  const itemNames = items.map(i => i.title || i.name).join(', ');

  console.log(`
%c 📧 ANTIGRAVITY EMAIL DISPATCH: ${email} 
%c
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  CuratedSpace - Order Confirmation                      ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                         ┃
┃  Hello ${name},                                         ┃
┃                                                         ┃
┃  Your order for:                                        ┃
┃  [ ${itemNames} ]                                        ┃
┃                                                         ┃
┃  Totaling ${total} is being prepared.                   ┃
┃                                                         ┃
┃  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                          ┃
┃  [ TRACK YOUR ORDER ]                                   ┃
┃  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                          ┃
┃                                                         ┃
┃  Thank you for choosing CuratedSpace.                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`, 
'background: #6366f1; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
'color: #6366f1; font-family: monospace;'
  );
};
