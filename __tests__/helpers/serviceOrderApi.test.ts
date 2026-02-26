import { describe, it, expect, vi, afterEach } from "vitest";
import {
  lookupServiceIntake,
  submitServiceOrderRequest,
  getServiceOrderStatus,
} from "@/helpers/serviceOrderApi";
import type {
  ServiceOrderResponsePayload,
  ServiceOrderIntakeRequest,
} from "@/types/emergencyLeakService";

function mockFetch(body: unknown, status = 200) {
  globalThis.fetch = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    }),
  );
}

const SAMPLE_ORDER: ServiceOrderResponsePayload = {
  Id: 1,
  RequestDate: "2026-02-16T00:00:00Z",
  Clients: [
    {
      DynamoAccountId: 100,
      DynamoCountId: 200,
      AccountName: "Acme Corp",
      AccountContactName: "John",
      Email: "john@acme.com",
      Phone: "555-1234",
    },
  ],
  BillingInfos: [
    {
      DynamoId: 300,
      EntityBillToName: "Acme Billing",
      BillToAddress: "123 Main St",
      BillToAddress2: "",
      BillToCity: "Denver",
      BillToZip: "80202",
      BillToEmail: "billing@acme.com",
    },
  ],
  LeakDetails: [],
  CreatedAt: "2026-02-16T00:00:00Z",
};

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("serviceOrderApi", () => {
  describe("lookupServiceIntake", () => {
    it("normalizes a single order response into a lookup response", async () => {
      mockFetch(SAMPLE_ORDER);

      const result = await lookupServiceIntake({
        JobNo: "J001",
        EmailAddress: "",
        City: "",
        Zip: "",
      });

      expect(result.serviceOrders).toHaveLength(1);
      expect(result.clients).toHaveLength(1);
      expect(result.clients[0].AccountName).toBe("Acme Corp");
      expect(result.billings).toHaveLength(1);
    });

    it("normalizes an array of orders", async () => {
      mockFetch([SAMPLE_ORDER, SAMPLE_ORDER]);

      const result = await lookupServiceIntake({
        JobNo: "",
        EmailAddress: "john@acme.com",
        City: "",
        Zip: "",
      });

      expect(result.serviceOrders).toHaveLength(2);
      expect(result.clients).toHaveLength(2);
    });

    it("normalizes a legacy response with matches array", async () => {
      mockFetch({
        matches: [SAMPLE_ORDER],
        message: "Found 1 match",
      });

      const result = await lookupServiceIntake({
        JobNo: "J001",
        EmailAddress: "",
        City: "",
        Zip: "",
      });

      expect(result.serviceOrders).toHaveLength(1);
      expect(result.message).toBe("Found 1 match");
    });

    it("returns empty results when the input is unrecognized", async () => {
      mockFetch({ someUnknownField: true });

      const result = await lookupServiceIntake({
        JobNo: "J001",
        EmailAddress: "",
        City: "",
        Zip: "",
      });

      expect(result.serviceOrders).toHaveLength(0);
      expect(result.clients).toHaveLength(0);
    });
  });

  describe("submitServiceOrderRequest", () => {
    const SAMPLE_REQUEST: ServiceOrderIntakeRequest = {
      client: {
        dynamoAccountId: null,
        dynamoContactId: null,
        accountName: "Test",
        accountContactName: "Tester",
        email: "test@test.com",
        phone: "555-0000",
      },
      billing: {
        dynamoId: null,
        entityBillToName: "Test Billing",
        billToAddress: "1 Test Ln",
        billToAddress2: "",
        billToCity: "Testville",
        billToZip: "00000",
        billToEmail: "billing@test.com",
      },
      leakDetails: {
        dynamoId: null,
        jobNo: "",
        jobDate: null,
        siteName: "Test Site",
        siteAddress: "1 Test Ln",
        siteAddress2: "",
        siteCity: "Testville",
        siteZip: "00000",
        tenantBusinessName: "",
        tenantContactName: "",
        tenantContactPhone: "",
        tenantContactCell: "",
        tenantContactEmail: "",
        hoursOfOperation: "",
        leakLocation: 2,
        leakNear: 5,
        leakNearOther: "",
        hasAccessCode: false,
        accessCode: "",
        isSaturdayAccessPermitted: false,
        isKeyRequired: false,
        isLadderRequired: false,
        roofPitch: 1,
        comments: "",
      },
      additionalLeaks: [],
      SignatureData: "",
      SignatureName: "",
    };

    it("returns message and requestId from server", async () => {
      mockFetch({
        message: "Queued",
        requestId: "abc-123",
      });

      const result = await submitServiceOrderRequest(SAMPLE_REQUEST);
      expect(result.message).toBe("Queued");
      expect(result.requestId).toBe("abc-123");
    });

    it("falls back to default message when server omits it", async () => {
      mockFetch({ requestId: "abc-123" });

      const result = await submitServiceOrderRequest(SAMPLE_REQUEST);
      expect(result.message).toBe("Request submitted successfully.");
    });

    it("falls back to 'Pending' when requestId is missing", async () => {
      mockFetch({ message: "Done" });

      const result = await submitServiceOrderRequest(SAMPLE_REQUEST);
      expect(result.requestId).toBe("Pending");
    });

    it("falls back to 'Pending' when requestId is empty string", async () => {
      mockFetch({ message: "Done", requestId: "  " });

      const result = await submitServiceOrderRequest(SAMPLE_REQUEST);
      expect(result.requestId).toBe("Pending");
    });
  });

  describe("getServiceOrderStatus", () => {
    it("returns the status response", async () => {
      const statusResponse = {
        Success: true,
        Message: "Service order found",
        Status: "NEW",
        Data: {
          Id: "abc-123",
          RequestDate: "2026-02-16T00:00:00Z",
          Client: { AccountName: "Acme" },
          Billing: { EntityBillToName: "Acme Billing" },
          LeakDetails: { SiteName: "Site A" },
          AdditionalLeaks: [],
          CreatedAt: "2026-02-16T00:00:00Z",
          UpdatedAt: null,
        },
      };
      mockFetch(statusResponse);

      const result = await getServiceOrderStatus("abc-123");

      expect(result.Success).toBe(true);
      expect(result.Status).toBe("NEW");
      expect(result.Data?.Id).toBe("abc-123");
    });

    it("passes referenceId as a query parameter", async () => {
      const spy = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            Success: true,
            Status: "NEW",
            Data: null,
            Message: "",
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        ),
      );
      globalThis.fetch = spy;

      await getServiceOrderStatus("test-guid-456");

      const url = spy.mock.calls[0][0] as string;
      expect(url).toContain("referenceId=test-guid-456");
    });
  });
});
