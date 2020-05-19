import { Button, Card, ImageButton, KVWidget } from "./interfaces";
import fetch from "node-fetch";

export const button = (title: string, url: string): Button => ({
  textButton: {
    text: title,
    onClick: { openLink: { url } }
  }
});

export function imageButton(iconUrl: string, url: string) {
  return { imageButton: { iconUrl, onClick: { openLink: { url } } } };
}

export function kvWidget(
  topLabel: string,
  content: string | undefined,
  options?: {
    website?: {
      text: string;
      url: string;
    };
    bottomLabel?: string;
    bold?: boolean;
  }
): KVWidget {
  const contentIsText = typeof content === "string" && !!content.trim();
  const isBold = !options || options?.bold || options?.bold === undefined;
  return {
    keyValue: {
      topLabel,
      content:
        !!content && contentIsText
          ? isBold
            ? `<b>${content}</b>`
            : content
          : "Missing field",
      contentMultiline: "true" as const,
      ...(options?.bottomLabel && { bottomLabel: options.bottomLabel }),
      ...(options?.website && {
        button: {
          textButton: {
            text: options.website.text,
            onClick: { openLink: { url: options.website.url } }
          }
        }
      })
    }
  };
}

export function card({
  title,
  image,
  kvWidgets,
  buttons,
  icons
}: {
  title: string;
  image: string;
  kvWidgets: KVWidget[];
  buttons?: Button[];
  icons?: ImageButton[];
}): Card {
  return {
    header: { title, imageUrl: image },
    sections: [
      { widgets: kvWidgets },
      ...(buttons ? [{ widgets: [{ buttons }] }] : []),
      ...(icons ? [{ widgets: [{ buttons: icons }] }] : [])
    ]
  };
}

export async function sendMessageToChat(
  webhook: string,
  message: string
): Promise<void> {
  const params = {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ text: message })
  };
  const response = await fetch(webhook, params);
  await checkForBadResponse(response);
}

export async function sendCardToChat(
  webhook: string,
  card: Card,
  trigger: boolean = true
): Promise<void> {
  const params = {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ cards: [card], text: trigger ? "<users/all>" : "" })
  };
  const response = await fetch(webhook, params);
  await checkForBadResponse(response);
}

export async function checkForBadResponse(response: {
  status: number;
  json: Function;
}) {
  if (response.status != 200) {
    const json = await response.json();
    throw new Error(await JSON.stringify(json));
  }
}

// https://developers.google.com/hangouts/chat/reference/rest/v1/spaces.messages/create#query-parameters
export function threadKey(
  identifier: string,
  currentDateTime: Date = new Date()
): string {
  return encodeURIComponent(
    `${identifier}-${currentDateTime.toISOString().split("T")[0]}`
  );
}

export function urlWithThreadKey(threadKey: string, webhook: string): string {
  return `${webhook}&threadKey=${threadKey}`;
}
