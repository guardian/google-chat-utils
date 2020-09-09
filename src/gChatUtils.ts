import {
  Button,
  ButtonParams,
  Card,
  CardParams,
  ImageButtonParams,
  KVWidget,
  KVWidgetParams,
  SendCardsParams,
  SendMessageParams,
  ThreadKeyParams
} from "./interfaces";
import fetch from "node-fetch";

export const button = (params: ButtonParams): Button => ({
  textButton: {
    text: params.title,
    onClick: { openLink: { url: params.url } }
  }
});

export function imageButton(params: ImageButtonParams) {
  return {
    imageButton: {
      iconUrl: params.iconUrl,
      onClick: { openLink: { url: params.url } }
    }
  };
}

export function kvWidget({ bold = true, ...params }: KVWidgetParams): KVWidget {
  const contentIsNotEmpty = !!params.content?.trim();
  return {
    keyValue: {
      content: contentIsNotEmpty
        ? bold
          ? `<b>${params.content}</b>`
          : params.content
        : "Missing field",
      contentMultiline: "true",
      ...(params.header && { topLabel: params.header }),
      ...(params.footer && { bottomLabel: params.footer }),
      ...(params.website && {
        button: {
          textButton: {
            text: params.website.text,
            onClick: { openLink: { url: params.website.url } }
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
}: CardParams): Card {
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
  params: SendMessageParams
): Promise<void> {
  const fetchParams = {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      text: params.message,
      ...(params.fallbackText && { fallbackText: params.fallbackText })
    })
  };
  const response = await fetch(params.webhook, fetchParams);
  await checkForBadResponse(response);
}

export async function sendCardsToChat(params: SendCardsParams): Promise<void> {
  const fetchParams = {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      cards: params.cards,
      text: params.trigger ? "<users/all>" : "",
      ...(params.fallbackText && { fallbackText: params.fallbackText })
    })
  };
  const response = await fetch(params.webhook, fetchParams);
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
export function threadKey(params: ThreadKeyParams): string {
  const identifier = params.groupByDate
    ? yearMonthDay(new Date())
    : params.groupBy ?? "";

  return encodeURIComponent(`${params.identifier}-${identifier}`);
}

export function urlWithThreadKey(threadKey: string, webhook: string): string {
  return `${webhook}&threadKey=${threadKey}`;
}

export function yearMonthDay(date: Date): string {
  return date.toISOString().split("T")[0];
}
