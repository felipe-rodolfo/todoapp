import { NextApiRequest, NextApiResponse } from "next";
import { todoController } from "src/server/controller/todo";

export default function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method === "GET"){
    todoController.get(req, res);
    return;
  }

  res.status(405).json({
    message: "Method not allowed",
  })
}
