import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"

import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast'
import { toastManager, type ToastVariant } from '../../hooks/use-toast'

/** variant ごとのアイコン。HamiriloToast はここでアイコンを描画する（title には文字列のみ渡す） */
const VARIANT_ICON = {
  success: { Icon: CheckCircle, className: "text-emerald-600 dark:text-emerald-400" },
  destructive: { Icon: XCircle, className: "text-red-600 dark:text-red-400" },
  warning: { Icon: AlertTriangle, className: "text-orange-600 dark:text-orange-400" },
  info: { Icon: Info, className: "text-blue-600 dark:text-blue-400" },
  default: { Icon: Info, className: "text-muted-foreground" },
} as const

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()

  return (
    <ToastPortal>
      <ToastViewport>
        {toasts.map((toast) => {
          const variant = (toast.type ?? "default") as ToastVariant
          const { Icon, className } = VARIANT_ICON[variant] ?? VARIANT_ICON.default

          return (
            <Toast key={toast.id} toast={toast} variant={variant}>
              <div className="flex items-start gap-2">
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${className}`} />
                <div className="grid gap-1">
                  {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
                  {toast.description && (
                    <ToastDescription>{toast.description}</ToastDescription>
                  )}
                </div>
              </div>
              {toast.actionProps && <ToastAction {...toast.actionProps} />}
              <ToastClose />
            </Toast>
          )
        })}
      </ToastViewport>
    </ToastPortal>
  )
}

export function Toaster() {
  return (
    <ToastProvider toastManager={toastManager}>
      <ToastList />
    </ToastProvider>
  )
}
