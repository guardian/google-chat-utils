import * as src from "../src/gChatUtils";
import fetch from "node-fetch";
import { Card } from "../src/interfaces";

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
    it("Creates a key value widget without a website button", () => {
      const result = src.kvWidget("someLabel", "someContent");
      expect(result).toEqual({
        keyValue: {
          content: "<b>someContent</b>",
          contentMultiline: "true",
          topLabel: "someLabel"
        }
      });
    });
    it("Can optionally add a website link", () => {
      const result = src.kvWidget("someLabel", "someContent", {
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

    it("Can optionally add a bottom label", () => {
      const result = src.kvWidget("someLabel", "someContent", {
        bottomLabel: "some bottom label"
      });
      expect(result).toEqual({
        keyValue: expect.objectContaining({
          bottomLabel: "some bottom label"
        })
      });
    });

    it("Makes the content bold by default", () => {
      const result = src.kvWidget("someLabel", "someContent");
      expect(result.keyValue.content).toEqual("<b>someContent</b>");
    });

    it("Keeps the content bold if set explicitly", () => {
      const result = src.kvWidget("someLabel", "someContent", { bold: true });
      expect(result.keyValue.content).toEqual("<b>someContent</b>");
    });

    it("Sends the content normally if bold is set to false", () => {
      const result = src.kvWidget("someLabel", "someContent", { bold: false });
      expect(result.keyValue.content).toEqual("someContent");
    });
  });

  describe("sendMessageToChat", () => {
    it("makes a POST request to a webhook with a body", async () => {
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

    it("throws error if bad fetch", async () => {
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
    const dummyCard: Card = {
      header: { imageUrl: "someURL", title: "someTitle" },
      sections: []
    };
    it("makes a POST request to a webhook with a body", async () => {
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

    it("Errors out if not bad response from fetch", async () => {
      // @ts-ignore
      fetch.mockImplementationOnce(() => Promise.resolve(new JestMock(404)));
      try {
        await src.sendCardToChat("someURL", dummyCard);
      } catch (err) {
        expect(err).toEqual(Error(JSON.stringify(FETCH_ERROR)));
      }
    });
  });

  describe("card", () => {
    const kvWidget = src.kvWidget("someLabel", "someContent");
    it("should produce an object with a header, image and infoWidgets", function() {
      const params = {
        title: "someTitle",
        image: "someImage",
        kvWidgets: [kvWidget]
      };

      const result = src.card(params);

      expect(result.header).toEqual({
        title: "someTitle",
        imageUrl: "someImage"
      });
      expect(result.sections).toEqual([
        {
          widgets: [kvWidget]
        }
      ]);
    });

    it("should have the key value section first", function() {
      const params = {
        title: "someTitle",
        image: "someImage",
        kvWidgets: [kvWidget]
      };

      expect(src.card(params).sections[0]).toEqual({
        widgets: [kvWidget]
      });
    });

    it("should add a button if passed in", function() {
      const button = src.button("someButton", "someURL");
      const params = {
        title: "someTitle",
        image: "someImage",
        kvWidgets: [kvWidget],
        buttons: [button]
      };

      expect(src.card(params).sections[1]).toEqual({
        widgets: [{ buttons: [button] }]
      });
    });

    it("should add an icon if passed in", function() {
      const icon = src.imageButton("someIconURL", "someURL");
      const params = {
        title: "someTitle",
        image: "someImage",
        kvWidgets: [kvWidget],
        icons: [icon]
      };

      expect(src.card(params).sections[1]).toEqual({
        widgets: [{ buttons: [icon] }]
      });
    });

    it("should have buttons then icons if both are passed in", function() {
      const button = src.button("someButton", "someURL");
      const icon = src.imageButton("someIconURL", "someURL");
      const params = {
        title: "someTitle",
        image: "someImage",
        kvWidgets: [kvWidget],
        buttons: [button],
        icons: [icon]
      };

      expect(src.card(params).sections[1]).toEqual({
        widgets: [{ buttons: [button] }]
      });

      expect(src.card(params).sections[2]).toEqual({
        widgets: [{ buttons: [icon] }]
      });
    });
  });
});
