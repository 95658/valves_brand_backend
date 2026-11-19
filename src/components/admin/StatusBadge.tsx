import React from "react";
import { OrderStatus, CodSettlementStatus, PaymentMethod } from "@prisma/client";

interface StatusBadgeProps {
  status: string;
  type?: "order" | "cod" | "payment" | "stock";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = "order" }) => {
  let bgClass = "bg-[var(--bg-secondary)] text-[var(--ink-secondary)] border-[var(--border-hairline)]";

  if (type === "order") {
    switch (status) {
      case OrderStatus.DELIVERED:
        bgClass = "bg-[var(--status-success)]/10 text-[var(--status-success)] border-[var(--status-success)]/30";
        break;
      case OrderStatus.SHIPPED:
      case OrderStatus.PACKED:
        bgClass = "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/30";
        break;
      case OrderStatus.CONFIRMED:
        bgClass = "bg-[var(--ink-primary)]/10 text-[var(--ink-primary)] border-[var(--ink-primary)]/30";
        break;
      case OrderStatus.PENDING:
        bgClass = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
        break;
      case OrderStatus.RETURNED:
      case OrderStatus.CANCELLED:
        bgClass = "bg-[var(--status-danger)]/10 text-[var(--status-danger)] border-[var(--status-danger)]/30";
        break;
    }
  } else if (type === "cod") {
    switch (status) {
      case CodSettlementStatus.SETTLED:
        bgClass = "bg-[var(--status-success)]/10 text-[var(--status-success)] border-[var(--status-success)]/30";
        break;
      case CodSettlementStatus.WITH_COURIER:
        bgClass = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
        break;
      case CodSettlementStatus.UNCOLLECTED:
        bgClass = "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/30";
        break;
    }
  } else if (type === "stock") {
    if (status === "IN_STOCK") {
      bgClass = "bg-[var(--status-success)]/10 text-[var(--status-success)] border-[var(--status-success)]/30";
    } else if (status === "LOW_STOCK") {
      bgClass = "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40 font-bold";
    } else if (status === "OUT_OF_STOCK") {
      bgClass = "bg-[var(--status-danger)]/10 text-[var(--status-danger)] border-[var(--status-danger)]/30 font-bold";
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-wider uppercase font-mono border ${bgClass}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
};
