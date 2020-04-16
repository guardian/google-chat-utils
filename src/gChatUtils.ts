import { Button, Card, ImageButton, KVWidget, Section } from "./interfaces";
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
  content: string,
  options?: {
    website?: {
      text: string;
      url: string;
    };
    bottomLabel?: string;
  }
): KVWidget {
  return {
    keyValue: {
      topLabel,
      content: `<b>${content}</b>`,
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
  infoWidgets,
  buttons,
  icons
}: {
  title: string;
  image: string;
  infoWidgets: KVWidget[];
  buttons?: Button[];
  icons?: ImageButton[];
}): Card {
  const sections: Section[] = [{ widgets: infoWidgets }];

  if (buttons) {
    sections.push({ widgets: [{ buttons }] });
  }

  if (icons) {
    sections.push({ widgets: [{ buttons: icons }] });
  }

  return {
    header: { title, imageUrl: image },
    sections
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
