// https://developers.google.com/hangouts/chat/reference/message-formats/cards#keyvalue
export interface KVWidget {
  keyValue: {
    topLabel: string;
    content: string;
    contentMultiline?: "true" | "false";
    bottomLabel?: string;
    onClick?: {
      openLink: {
        url: string;
      };
    };
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
  sections: ({
    widgets: (KVWidget | ButtonWidget)[];
  } | null)[];
}
