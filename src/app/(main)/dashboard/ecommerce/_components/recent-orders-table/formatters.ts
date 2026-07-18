import type { OrderFilter } from "./schema";

export function formatOrderCount(filter: OrderFilter, count: number) {
  const orderLabel = count === 1 ? "order" : "orders";

  if (filter === "All") {
    return `${count.toLocaleString()} ${orderLabel}`;
  }

  if (filter === "Needs action") {
    return `${count.toLocaleString()} ${orderLabel} need action`;
  }

  if (filter === "Returns") {
    return `${count.toLocaleString()} ${count === 1 ? "return" : "returns"}`;
  }

  return `${count.toLocaleString()} ${filter.toLowerCase()} ${orderLabel}`;
}

export function formatSelectedOrderCount(count: number) {
  const orderLabel = count === 1 ? "order" : "orders";

  return `${count.toLocaleString()} ${orderLabel} selected`;
}

export function preventPaginationNavigation(event: { preventDefault(): void }) {
  event.preventDefault();
}
