import template from "./notification.hbs"
import styles from "./notification.scss"
import fonts from "../../assets/css/fonts.css"
import { fromHtml } from "../../helpers/from-html"
import { ASSETS_PATHS } from "../../helpers/assets-paths"

type NotificationOptions = {
  text: string
  primaryButtonLabel?: string
  primaryButtonDestination?: string
  secondaryButtonLabel?: string
  secondaryButtoDestination?: string
  autoclose?: boolean
  onClose?: () => void
  onAutoclose?: () => void
}

export const notification = (options: NotificationOptions) => {
  let styleElement = document.createElement("style")
  styleElement.innerHTML = `${styles.toString()}${fonts.toString()}`

  const notificationElement = fromHtml(template({ ...options, ASSETS_PATHS })) as HTMLDivElement
  const closeButton = notificationElement.querySelector(".altruisto-notification__close")
  closeButton &&
    closeButton.addEventListener("click", () => {
      notificationElement.classList.remove("altruisto-notification--in")
      options.onClose && options.onClose()
    })

  document.documentElement.prepend(styleElement)
  document.documentElement.prepend(notificationElement)
  setTimeout(() => notificationElement.classList.add("altruisto-notification--in"), 0)
  if (options.autoclose) {
    setTimeout(() => {
      notificationElement.classList.remove("altruisto-notification--in")
      options.onAutoclose && options.onAutoclose()
    }, 3500)
  }

  return notificationElement
}
