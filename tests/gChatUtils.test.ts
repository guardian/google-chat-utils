import * as src from "../src/gChatUtils";
import fetch from "node-fetch";
import { GChatCard } from "../src/interfaces";

const FETCH_ERROR = "some error";

class JestMock {
  status: number;
  constructor(status: number) {
    this.status = status;
  }
  json() {
    return FETCH_ERROR;
  }
}
jest.mock("node-fetch", () => jest.fn());

describe("gChatUtils", function() {
  describe("gChatKVWidget", function() {
    test("Creates a key value widget without a website button", () => {
      const result = src.gChatKVWidget("someLabel", "someContent");
      expect(result).toEqual({
        keyValue: {
          content: "<b>someContent</b>",
          contentMultiline: "true",
          topLabel: "someLabel"
        }
      });
    });
    test("Can optionally add a website link", () => {
      const result = src.gChatKVWidget("someLabel", "someContent", {
        website: {
          text: "someWebsite",
          url: "someURL"
        }
      });
      expect(result.keyValue.button).toEqual({
        textButton: {
          text: "someWebsite",
          onClick: { openLink: { url: "someURL" } }
        }
      });
    });

    test("Can optionally add a bottom label", () => {
      const result = src.gChatKVWidget("someLabel", "someContent", {
        bottomLabel: "some bottom label"
      });
      expect(result).toEqual({
        keyValue: expect.objectContaining({
          bottomLabel: "some bottom label"
        })
      });
    });
  });

  describe("sendMessageToChat", () => {
    test("makes a POST request to a webhook with a body", async () => {
      // @ts-ignore
      fetch.mockImplementationOnce(() => Promise.resolve(new JestMock(200)));
      await src.sendMessageToChat("someURL", "someMessage");
      expect(fetch).toHaveBeenCalledWith("someURL", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: "someMessage" })
      });
    });

    test("throws error if bad fetch", async () => {
      // @ts-ignore
      fetch.mockImplementationOnce(() => Promise.resolve(new JestMock(400)));
      try {
        await src.sendMessageToChat("someURL", "someMessage");
      } catch (e) {
        expect(e).toEqual(Error(JSON.stringify(FETCH_ERROR)));
      }
    });
  });

  describe("sendCardToChat", () => {
    const dummyCard: GChatCard = {
      header: { imageUrl: "someURL", title: "someTitle" },
      sections: []
    };
    test("makes a POST request to a webhook with a body", async () => {
      // @ts-ignore
      fetch.mockImplementationOnce(() => Promise.resolve(new JestMock(200)));
      await src.sendCardToChat("someURL", dummyCard);
      expect(fetch).toHaveBeenCalledWith("someURL", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ cards: [dummyCard], text: "<users/all>" })
      });
    });

    test("Errors out if not bad response from fetch", async () => {
      // @ts-ignore
      fetch.mockImplementationOnce(() => Promise.resolve(new JestMock(404)));
      try {
        await src.sendCardToChat("someURL", dummyCard);
      } catch (err) {
        expect(err).toEqual(Error(JSON.stringify(FETCH_ERROR)));
      }
    });
  });
});
