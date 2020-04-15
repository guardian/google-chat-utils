export interface LambdaResponse {
  statusCode: number;
  body: string;
}

// https://developers.google.com/hangouts/chat/reference/message-formats/cards#keyvalue
export interface GChatKVWidget {
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
export interface GChatButton {
  textButton: {
    text: string;
    onClick: { openLink: { url: string } };
  };
}

export interface GChatImageButton {
  imageButton: {
    iconUrl: string;
    onClick: {
      openLink: {
        url: string;
      };
    };
  };
}

export interface GChatButtonWidget {
  buttons: (GChatButton | GChatImageButton)[];
}

// https://developers.google.com/hangouts/chat/reference/message-formats/cards#components
export interface GChatCard {
  header: {
    title: string;
    imageUrl: string;
  };
  sections: ({
    widgets: (GChatKVWidget | GChatButtonWidget)[];
  } | null)[];
}
