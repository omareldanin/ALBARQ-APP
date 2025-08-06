enum OrderStatus {
  REGISTERED = "تم الطلب",
  READY_TO_SEND = "جاهز للأرسال",
  WITH_DELIVERY_AGENT = "بالطريق مع المندوب",
  DELIVERED = "تم التوصيل",
  REPLACED = "تم الاستبدال",
  PARTIALLY_RETURNED = "مرتجع جزئي",
  RETURNED = "راجع كلي",
  POSTPONED = "مؤجل",
  CHANGE_ADDRESS = "تغيير عنوان",
  RESEND = "إعادة إرسال",
  WITH_RECEIVING_AGENT = "مع مندوب الاستلام",
  IN_MAIN_REPOSITORY = "مخزن الفرز الرئيسي",
  IN_GOV_REPOSITORY = "مخزن فرز المحافظه",
  PROCESSING = "قيد المعالجه",
}

export const orderStatusArabicNames = {
  REGISTERED: "تم الطلب",
  READY_TO_SEND: "جاهز للأرسال",
  WITH_DELIVERY_AGENT: "بالطريق مع المندوب",
  DELIVERED: "تم التوصيل",
  REPLACED: "تم الاستبدال",
  PARTIALLY_RETURNED: "مرتجع جزئي",
  RETURNED: "راجع كلي",
  POSTPONED: "مؤجل",
  CHANGE_ADDRESS: "تغيير عنوان",
  RESEND: "إعادة إرسال",
  WITH_RECEIVING_AGENT: "مع مندوب الاستلام",
  PROCESSING: "قيد المعالجه",
  IN_MAIN_REPOSITORY: "مخزن الفرز الرئيسي",
  IN_GOV_REPOSITORY: "مخزن فرز المحافظه",
};

export const orderStatusColors = {
  REGISTERED: "#7d75ff", // Blue – New order
  READY_TO_SEND: "#7d75ff", // Darker Blue – Ready
  WITH_DELIVERY_AGENT: "#f6a62e", // Yellow – In transit
  DELIVERED: "green", // Green – Delivered
  REPLACED: "#2fd37a", // Purple – Replaced
  PARTIALLY_RETURNED: "#2fd37a", // Orange – Partial return
  RETURNED: "red", // Red – Returned
  POSTPONED: "#262626", // Gray – Postponed
  CHANGE_ADDRESS: "#16a085", // Teal – Address changed
  RESEND: "#b2404a", // Dark Orange – Resend
  WITH_RECEIVING_AGENT: "#f39c12", // Amber – With pickup agent
  PROCESSING: "#0ec5e3", // Violet – Processing
  IN_MAIN_REPOSITORY: "#34495e", // Dark Blue-Gray – Main warehouse
  IN_GOV_REPOSITORY: "#7f8c8d", // Gray – Governorate warehouse
};

export const orderStatusArray: { label: string; value: string }[] =
  Object.entries(OrderStatus).map(([value, label]) => ({
    label,
    value,
  }));
