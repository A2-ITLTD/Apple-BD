export const BUY_NOW_STORAGE_KEY = "AppleBD_buy_now_item";

export const startBuyNowCheckout = (product, quantity, options, router) => {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(
        BUY_NOW_STORAGE_KEY,
        JSON.stringify({
          product,
          quantity,
          selectedColor: options?.selectedColor || null,
          selectedSize: options?.selectedSize || null,
          selectedAttributes: options?.selectedAttributes || null,
          selectedVariant: options?.selectedVariant || null,
        }),
      );
    } catch {}
  }
  router.push("/checkout?buyNow=1");
};
