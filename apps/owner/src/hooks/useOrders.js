import { useState, useEffect, useCallback } from "react";
import {
  getOrder,
  getOrders,
  confirmOrder,
  rejectOrder,
  assignDelivery,
  getDeliveryStaff,
} from "../api/Orderservices";

/* ─── useOrders ───────────────────────────────────────────────── */
export function useOrders({ filter, search }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getOrders({ status: filter, search });
      // Laravel resource collections: { data: [...] }
      setOrders(res.data ?? res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    load();
  }, [load]);

  return { orders, loading, error, refetch: load };
}

/* ─── useOrder ────────────────────────────────────────────────── */
export function useOrder(id) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getOrder(id);
      setOrder(res.data ?? res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const runAction = async (fn) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fn();
      setOrder(res.data ?? res);
    } catch (e) {
      setActionError(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const confirm = () => runAction(() => confirmOrder(id));
  const reject = (reason) => runAction(() => rejectOrder(id, reason));
  const assign = (userId) => runAction(() => assignDelivery(id, userId));

  return {
    order,
    loading,
    error,
    actionLoading,
    actionError,
    confirm,
    reject,
    assign,
    refetch: load,
  };
}

/* ─── useDeliveryStaff ────────────────────────────────────────── */
export function useDeliveryStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDeliveryStaff();
      setStaff(res.data ?? res);
    } catch {
      /* silently ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  return { staff, loading, load };
}
