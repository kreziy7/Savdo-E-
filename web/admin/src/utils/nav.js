const labels = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/orders": "Orders",
  "/customers": "Customers",
  "/settings": "Settings",
  "/login": "Login"
};

export function getPageLabel(pathname) {
  return labels[pathname] || "Admin";
}
