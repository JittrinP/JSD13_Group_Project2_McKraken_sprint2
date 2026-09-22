import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Eye,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useAdminOrders } from "../../../hooks/useAdminOrders";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "delivery", label: "Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const statusStyles = {
  pending: "bg-[#FFF4D6] text-[#916D18]",
  processing: "bg-[#E9EAFE] text-[#545C9E]",
  delivery: "bg-[#E5F1F0] text-[#3D7770]",
  delivered: "bg-[#E5F4E9] text-[#3B7B4D]",
  cancelled: "bg-[#F8E6E6] text-[#9A4D4D]",
};

function formatDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

function getStatusLabel(status) {
  return statusOptions.find((option) => option.value === status)?.label || status;
}

export default function OrderList() {
  const { orders, updateOrderStatus, deleteOrder } = useAdminOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editingStatus, setEditingStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesSearch =
        !query ||
        [order.order_id, order.customer_id, order.customer_name, order.customer_email]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [orders, searchTerm, statusFilter]);

  function startEditing(order) {
    setEditingOrderId(order.order_id);
    setEditingStatus(order.status);
  }

  async function saveStatus(orderId) {
    await updateOrderStatus(orderId, editingStatus);
    setEditingOrderId(null);
  }

  async function handleDelete() {
    if (!orderToDelete) return;

    await deleteOrder(orderToDelete.order_id);
    if (selectedOrder?.order_id === orderToDelete.order_id) setSelectedOrder(null);
    setOrderToDelete(null);
  }

  function renderStatus(order) {
    if (editingOrderId === order.order_id) {
      return (
        <div className="flex items-center gap-1">
          <select
            value={editingStatus}
            onChange={(event) => setEditingStatus(event.target.value)}
            className="h-8 rounded-md border border-[#D6D9E0] bg-white px-2 text-xs text-[#475486] outline-none focus:border-[#475486]"
            aria-label={`Change status for ${order.order_id}`}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => saveStatus(order.order_id)}
            className="rounded-md p-1.5 text-[#3B7B4D] hover:bg-[#E5F4E9]"
            aria-label={`Save status for ${order.order_id}`}
            title="Save status"
          >
            <Check className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setEditingOrderId(null)}
            className="rounded-md p-1.5 text-[#9A4D4D] hover:bg-[#F8E6E6]"
            aria-label={`Cancel editing ${order.order_id}`}
            title="Cancel"
          >
            <X className="size-4" />
          </button>
        </div>
      );
    }

    return (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status] || "bg-gray-100 text-gray-600"}`}
      >
        {getStatusLabel(order.status)}
      </span>
    );
  }

  return (
    <section className="min-h-[calc(100vh-220px)] bg-white px-4 py-6 text-[#475486] sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-[1120px]">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#475486] sm:text-[34px]">
              Order List
            </h1>
            <p className="mt-2 text-sm text-[#7B8191]">
              Review customer orders and keep delivery status up to date.
            </p>
          </div>
          <div className="rounded-xl bg-[#F4F7F8] px-4 py-3 text-sm text-[#586158]">
            <span className="font-semibold text-[#475486]">{filteredOrders.length}</span> orders shown
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[#E4E6EA] bg-[#FBFCFC] p-3 sm:flex-row">
          <label className="relative flex min-w-0 flex-1 items-center">
            <Search className="pointer-events-none absolute left-3 size-4 text-[#8B91A0]" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search order or customer..."
              className="h-10 w-full rounded-lg border border-[#D9DDE3] bg-white pl-10 pr-3 text-sm text-[#475486] outline-none placeholder:text-[#9AA0AA] focus:border-[#475486]"
              type="search"
            />
          </label>
          <label className="relative sm:w-48">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-[#D9DDE3] bg-white px-3 pr-9 text-sm text-[#475486] outline-none focus:border-[#475486]"
              aria-label="Filter orders by status"
            >
              <option value="all">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 size-4 text-[#8B91A0]" />
          </label>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#E1E3E7] bg-white shadow-[0_2px_8px_rgba(56,64,91,0.12)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead className="bg-[#F4F7F8] text-xs uppercase tracking-wide text-[#667092]">
                <tr className="border-b border-[#E1E3E7]">
                  <th className="px-5 py-4 font-semibold">Order ID</th>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Order Date</th>
                  <th className="px-5 py-4 font-semibold">Total</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-[#475486]">
                {filteredOrders.map((order) => (
                  <tr key={order.order_id} className="border-b border-[#ECEDEF] last:border-0 hover:bg-[#FCFDFD]">
                    <td className="px-5 py-4 font-semibold">{order.order_id}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#475486]">{order.customer_name}</p>
                      <p className="mt-1 text-xs text-[#8A91A0]">{order.customer_id}</p>
                    </td>
                    <td className="px-5 py-4 text-[#667092]">{formatDate(order.created_at)}</td>
                    <td className="px-5 py-4 font-medium">{formatCurrency(order.grandTotal)}</td>
                    <td className="px-5 py-4">{renderStatus(order)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-lg p-2 text-[#475486] hover:bg-[#E9EAFE]"
                          aria-label={`View ${order.order_id}`}
                          title="View order"
                        >
                          <Eye className="size-[18px]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => startEditing(order)}
                          className="rounded-lg p-2 text-[#475486] hover:bg-[#E9EAFE]"
                          aria-label={`Edit ${order.order_id}`}
                          title="Edit status"
                        >
                          <Pencil className="size-[18px]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderToDelete(order)}
                          className="rounded-lg p-2 text-[#9A4D4D] hover:bg-[#F8E6E6]"
                          aria-label={`Delete ${order.order_id}`}
                          title="Delete order"
                        >
                          <Trash2 className="size-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="px-6 py-16 text-center">
              <p className="font-display text-xl text-[#475486]">No orders found</p>
              <p className="mt-2 text-sm text-[#8A91A0]">Try another search or status filter.</p>
            </div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#26304D]/35 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A91AE]">Order details</p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-[#475486]">{selectedOrder.order_id}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-[#7B8191] hover:bg-[#F4F7F8]"
                aria-label="Close order details"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-[#8A91A0]">Customer</p>
                <p className="mt-1 font-medium text-[#475486]">{selectedOrder.customer_name}</p>
                <p className="text-[#7B8191]">{selectedOrder.customer_email}</p>
              </div>
              <div>
                <p className="text-xs text-[#8A91A0]">Order date</p>
                <p className="mt-1 font-medium text-[#475486]">{formatDate(selectedOrder.created_at)}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-[#8A91A0]">Delivery address</p>
                <p className="mt-1 text-[#475486]">{selectedOrder.deliveryAddress}</p>
              </div>
            </div>
            <div className="mt-6 border-t border-[#ECEDEF] pt-4">
              <p className="mb-3 text-sm font-semibold text-[#475486]">Items</p>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div key={`${selectedOrder.order_id}-${item.product_id}`} className="flex justify-between gap-4 text-sm">
                    <span className="text-[#667092]">{item.name} x {item.quantity}</span>
                    <span className="font-medium text-[#475486]">{formatCurrency(item.unit_price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between border-t border-[#ECEDEF] pt-4 font-semibold text-[#475486]">
                <span>Grand total</span>
                <span>{formatCurrency(selectedOrder.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {orderToDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#26304D]/35 p-4"
          onClick={() => setOrderToDelete(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-order-title"
            className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#F8E6E6] text-[#9A4D4D]">
                <Trash2 className="size-5" />
              </div>
              <div className="min-w-0">
                <h2 id="delete-order-title" className="font-display text-xl font-semibold text-[#475486]">
                  Delete this order?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#7B8191]">
                  Order <span className="font-semibold text-[#475486]">{orderToDelete.order_id}</span> will be removed from this list. This action cannot be undone.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="ml-auto rounded-lg p-2 text-[#7B8191] hover:bg-[#F4F7F8]"
                aria-label="Close delete confirmation"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="h-10 rounded-lg border border-[#D9DDE3] px-4 text-sm font-semibold text-[#667092] transition hover:bg-[#F4F7F8]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="h-10 rounded-lg bg-[#9A4D4D] px-4 text-sm font-semibold text-white transition hover:bg-[#843E40]"
              >
                Delete order
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
