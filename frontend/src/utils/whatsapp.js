// WhatsApp Integration Utility
export const WHATSAPP_PHONE = '+919560686060'; // Replace with your WhatsApp number

export const openWhatsApp = (product) => {
  if (!product) return;
  
  const productName = encodeURIComponent(product.name);
  const productPrice = formatPrice(product.price);
  const message = encodeURIComponent(
    `Hello! I'm interested in ordering:\n\n${product.name}\nPrice: ${productPrice}\n\nPlease provide more details and ordering information.`
  );
  
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE.replace(/\D/g, '')}?text=${message}`;
  window.open(whatsappUrl, '_blank');
};

export const openWhatsAppChat = (text = '') => {
  const message = encodeURIComponent(text || 'Hello! I have a question about your pharmaceutical products.');
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE.replace(/\D/g, '')}?text=${message}`;
  window.open(whatsappUrl, '_blank');
};

export const formatPrice = (value = 0) => `₹${Number(value).toFixed(2)}`;
