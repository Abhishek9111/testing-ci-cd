import { describe, expect, test, it, vi } from "vitest";
import request from "supertest";
import { app } from "../index";
import { prismaClient } from "../__mocks__/db";

// vi.mock("../db", () => ({
//   prismaClient: { sum: { create: vi.fn() } },
// }));

vi.mock("../db");
describe("POST /sum", () => {
  it("should return the sum of two numbers", async () => {
    prismaClient.sum.create.mockResolvedValue({
      id: 1,
      a: 1,
      b: 1,
      result: 3,
    });
    vi.spyOn(prismaClient.sum, "create");

    const res = await request(app).post("/sum").send({
      a: 2,
      b: 1,
    });
    expect(prismaClient.sum.create).toHaveBeenCalledWith({
      data: {
        a: 1,
        b: 2,
        result: 3,
      },
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(3);
  });

  it("should return 411 if no inputs are provided", async () => {
    const res = await request(app).post("/sum").send({});
    expect(res.statusCode).toBe(411);
    expect(res.body.message).toBe("Incorrect inputs");
  });
});

describe("GET /multiply", () => {
  it("should return the sum of two numbers", async () => {
    prismaClient.sum.create.mockResolvedValue({
      id: 1,
      a: 1,
      b: 1,
      result: 2,
    });
    const res = await request(app)
      .get("/multiply")
      .set({
        a: "1",
        b: "2",
      })
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(2);
  });

  it("should return 411 if no inputs are provided", async () => {
    const res = await request(app).get("/multiply").send();
    expect(res.statusCode).toBe(411);
  });
});
