import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

import { MESSAGE_TYPE_PROCESS_NOTIFICATION } from "./constants";
import { buildProcessNotificationContent } from "./notifications/render-content";
import type {
  Attention,
  ProcessNotificationDetails,
} from "./notifications/types";

export interface ProcessNotificationSendOptions {
  triggerTurn: boolean;
  deliverAs: "steer" | "followUp" | "nextTurn";
}

/**
 * Maps a notification attention level to Pi send-message options.
 *
 * `turn` steers a working agent or wakes an idle one. `context` is delivered
 * as a follow-up: a working agent sees it at its next turn boundary, an idle
 * agent is woken. Nothing waits for the user to type. `ignore` stays queued
 * until the next turn started by Pi, whether user- or Pi-initiated.
 */
export function attentionToSendOptions(
  attention: Attention,
): ProcessNotificationSendOptions {
  switch (attention) {
    case "turn":
      return { triggerTurn: true, deliverAs: "steer" };
    case "context":
      return { triggerTurn: true, deliverAs: "followUp" };
    case "ignore":
      return { triggerTurn: false, deliverAs: "nextTurn" };
  }
}

export function sendProcessNotificationMessage(
  pi: ExtensionAPI,
  details: ProcessNotificationDetails,
  options: ProcessNotificationSendOptions,
): void {
  pi.sendMessage<ProcessNotificationDetails>(
    {
      customType: MESSAGE_TYPE_PROCESS_NOTIFICATION,
      content: buildProcessNotificationContent(details),
      display: true,
      details,
    },
    options,
  );
}
