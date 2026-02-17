import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchJson, UnifiedFetchError } from "@/helpers/unifiedFetcher";

function mockFetch(
  body: string,
  init: { status: number; headers?: Record<string, string> },
) {
  return vi.fn().mockResolvedValue(
    new Response(body, {
      status: init.status,
      headers: { "content-type": "application/json", ...init.headers },
    }),
  );
}

describe("unifiedFetcher", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("fetchJson", () => {
    it("returns parsed JSON on a successful response", async () => {
      globalThis.fetch = mockFetch(JSON.stringify({ ok: true }), {
        status: 200,
      });

      const result = await fetchJson<{ ok: boolean }>("/test");
      expect(result).toEqual({ ok: true });
    });

    it("sends JSON body and Content-Type header when body is provided", async () => {
      const spy = mockFetch(JSON.stringify({ saved: true }), { status: 200 });
      globalThis.fetch = spy;

      await fetchJson("/test", {
        method: "POST",
        body: { name: "test" },
      });

      const [url, init] = spy.mock.calls[0];
      expect(url).toBe("/test");
      expect(init.headers["Content-Type"]).toBe("application/json");
      expect(init.body).toBe(JSON.stringify({ name: "test" }));
    });

    it("does not set Content-Type or body when body is undefined", async () => {
      const spy = mockFetch(JSON.stringify({}), { status: 200 });
      globalThis.fetch = spy;

      await fetchJson("/test", { method: "GET" });

      const [, init] = spy.mock.calls[0];
      expect(init.headers["Content-Type"]).toBeUndefined();
      expect(init.body).toBeUndefined();
    });

    it("throws UnifiedFetchError with server message on non-ok response", async () => {
      globalThis.fetch = mockFetch(JSON.stringify({ message: "Not found" }), {
        status: 404,
      });

      try {
        await fetchJson("/test");
        expect.fail("Expected fetchJson to throw");
      } catch (error) {
        expect(error).toBeInstanceOf(UnifiedFetchError);
        const err = error as UnifiedFetchError;
        expect(err.message).toBe("Not found");
        expect(err.status).toBe(404);
      }
    });

    it("uses fallback error message when server provides no message", async () => {
      globalThis.fetch = mockFetch(JSON.stringify({ code: 500 }), {
        status: 500,
      });

      try {
        await fetchJson("/test", {}, "Something went wrong.");
      } catch (error) {
        const err = error as UnifiedFetchError;
        expect(err.message).toBe("Something went wrong.");
        expect(err.status).toBe(500);
      }
    });

    it("extracts Message (PascalCase) from error responses", async () => {
      globalThis.fetch = mockFetch(
        JSON.stringify({ Message: "Server error" }),
        { status: 500 },
      );

      try {
        await fetchJson("/test");
      } catch (error) {
        expect((error as UnifiedFetchError).message).toBe("Server error");
      }
    });

    it("returns null for 204 No Content", async () => {
      globalThis.fetch = vi
        .fn()
        .mockResolvedValue(new Response(null, { status: 204 }));

      const result = await fetchJson("/test");
      expect(result).toBeNull();
    });

    it("throws UnifiedFetchError on network failure", async () => {
      globalThis.fetch = vi
        .fn()
        .mockRejectedValue(new TypeError("Failed to fetch"));

      try {
        await fetchJson("/test", {}, "Connection failed.");
      } catch (error) {
        const err = error as UnifiedFetchError;
        expect(err).toBeInstanceOf(UnifiedFetchError);
        expect(err.message).toBe("Connection failed.");
        expect(err.cause).toBeInstanceOf(TypeError);
      }
    });

    it("parses JSON even when content-type is not application/json", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ data: 1 }), {
          status: 200,
          headers: { "content-type": "text/plain" },
        }),
      );

      const result = await fetchJson<{ data: number }>("/test");
      expect(result).toEqual({ data: 1 });
    });

    it("returns raw text when response is not parseable JSON", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response("plain text response", {
          status: 200,
          headers: { "content-type": "text/plain" },
        }),
      );

      const result = await fetchJson<string>("/test");
      expect(result).toBe("plain text response");
    });
  });
});
