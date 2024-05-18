import express from "express";
import { z } from "zod";
export const app = express();
import { prismaClient } from "./db";
app.use(express.json());

const sumInput = z.object({
  a: z.number(),
  b: z.number(),
});

app.post("/sum", async (req, res) => {
  const parsedResponse = sumInput.safeParse(req.body);

  if (!parsedResponse.success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const answer = parsedResponse.data.a + parsedResponse.data.b;
  const response = await prismaClient.sum.create({
    data: {
      a: parsedResponse.data.a,
      b: parsedResponse.data.b,
      result: answer,
    },
  });
  res.json({
    answer,
    id: response.id,
  });
});

app.get("/multiply", async (req, res) => {
  const parsedResponse = sumInput.safeParse({
    a: Number(req.headers["a"]),
    b: Number(req.headers["b"]),
  });

  if (!parsedResponse.success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  const answer = parsedResponse.data.a * parsedResponse.data.b;

  const response = await prismaClient.sum.create({
    data: {
      b: parsedResponse.data.a,
      a: parsedResponse.data.b,
      result: answer,
    },
  });

  res.json({
    answer,
    id: response.id,
  });
});
