export function cn(...args) {
  return args.filter(Boolean).join(" ");
}

export async function loadScript(src) {
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.onload = () => resolve(true);
    el.onerror = () => reject(new Error("Failed to load script " + src));
    document.body.appendChild(el);
  });
}

export async function openRazorpayCheckout({
  orderId,
  keyId,
  amount,
  currency,
  name = "Payment",
  description,
  prefill,
}) {
  if (!window.Razorpay) {
    await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: keyId,
      amount,
      currency,
      name,
      description,
      order_id: orderId,
      prefill,
      handler: function (response) {
        resolve(response);
      },
      modal: { escape: true },
      theme: { color: "#003366" },
    });
    rzp.on("payment.failed", function (resp) {
      reject(resp.error);
    });
    rzp.open();
  });
}
