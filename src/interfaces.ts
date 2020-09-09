export interface ButtonParams {
  title: string;
  url: string;
}

export interface ImageButtonParams {
  iconUrl: string;
  url: string;
}

export interface CardParams {
  title: string;
  image: string;
  kvWidgets: KVWidget[];
  buttons?: Button[];
  icons?: ImageButton[];
}

export interface SendMessageParams {
  webhook: string;
  message: string;
  fallbackText?: string;
}

export interface KVWidgetParams {
  header?: string;
  footer?: string;
  onClick?: { openLink: { url: string } };
  content: string;
  website?: {
    text: string;
    url: string;
  };
  bold?: boolean;
}

export interface SendCardsParams {
  webhook: string;
  cards: Card[];
  trigger: boolean;
  fallbackText?: string;
}

export interface ThreadKeyParams {
  identifier: string;
  groupBy?: string | number;
  groupByDate?: boolean;
}

// https://developers.google.com/hangouts/chat/reference/message-formats/cards#keyvalue
export interface KVWidget {
  keyValue: {
    topLabel?: string;
    content: string;
    contentMultiline?: "true" | "false";
    bottomLabel?: string;
    onClick?: { openLink: { url: string } };
    icon?: string;
    button?: {
      textButton: {
        text: string;
        onClick: {
          openLink: {
            url: string;
          };
        };
      };
    };
  };
}

// https://developers.google.com/hangouts/chat/reference/message-formats/cards#buttons
export interface Button {
  textButton: {
    text: string;
    onClick: { openLink: { url: string } };
  };
}

// https://developers.google.com/hangouts/chat/reference/message-formats/cards#buttons
export interface ImageButton {
  imageButton: {
    iconUrl: string;
    onClick: {
      openLink: {
        url: string;
      };
    };
  };
}

export interface ButtonWidget {
  buttons: (Button | ImageButton)[];
}

// https://developers.google.com/hangouts/chat/reference/message-formats/cards#components
export interface Card {
  header: {
    title: string;
    imageUrl: string;
  };
  sections: Section[];
}

export interface Section {
  widgets: (KVWidget | ButtonWidget)[];
}
