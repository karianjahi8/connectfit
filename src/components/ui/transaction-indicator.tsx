import * as React from "react";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type TxStatus = "idle" | "pending" | "confirming" | "confirmed" | "failed";

interface TransactionIndicatorProps {
  status: TxStatus;
  txHash?: string;
  message?: string;
}

const statusConfig = {
  idle: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted/30", text: "Ready" },
  pending: { icon: Loader2, color: "text-warning", bg: "bg-warning/10", text: "Confirming...", spin: true },
  confirming: { icon: Loader2, color: "text-accent", bg: "bg-accent/10", text: "Processing...", spin: true },
  confirmed: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", text: "Confirmed!" },
  failed: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", text: "Failed" },
};

export function TransactionIndicator({ status, txHash, message }: TransactionIndicatorProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border border-border/50", config.bg)}>
      <Icon
        className={cn("w-5 h-5 shrink-0", config.color, "spin" in config && config.spin && "animate-spin")}
      />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", config.color)}>
          {message || config.text}
        </p>
        {txHash && (
          <a
            href={`https://snowtrace.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-accent hover:underline truncate block"
          >
            View on Snowtrace ↗
          </a>
        )}
      </div>
    </div>
  );
}
