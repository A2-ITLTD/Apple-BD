/**
 * Send the confirmed order to GTM/GA4's shared dataLayer exactly once per
 * browser session. GTM can then use the `purchase` event to populate its tags.
 */
export function trackPurchase(order) {
  if (!order || typeof window === "undefined") return;

  const transactionId = String(order.orderNumber || order._id || order.id || "");
  if (!transactionId) return;

  const storageKey = `tracked-purchase:${transactionId}`;
  try {
    if (window.sessionStorage.getItem(storageKey)) return;
  } catch {
    // Continue tracking if browser storage is unavailable.
  }

  window.dataLayer = window.dataLayer || [];
  // Clear prior ecommerce values so GTM doesn't merge data from another event.
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "purchase",
    ecommerce: {
      transaction_id: transactionId,
      value: Number(order.total ?? order.totalAmount ?? 0),
      currency: "BDT",
      items: (Array.isArray(order.items) ? order.items : []).map((item) => ({
        item_id: String(item.productId || item._id || ""),
        item_name: item.title || item.productName || "",
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
      })),
    },
  });

  try {
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    // The event has already been queued; no further action is required.
  }
}
