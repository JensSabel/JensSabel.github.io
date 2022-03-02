import { serve } from "https://deno.land/std@0.120.0/http/server.ts";
import { configure, renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import * as messageService from "./services/messageService.js";

configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const redirectTo = (path) => {
  return new Response(`Redirecting to ${path}.`, {
    status: 303,
    headers: {
      "Location": path,
    },
  });
};

const addMessage = async (request) => {
  const formData = await request.formData();
  const sender = formData.get("sender");
  const message = formData.get("message");

  await messageService.create(sender, message);

  return redirectTo("/");

}

const listMessages = async (request) => {
  const data = {
    messages: await messageService.findAll(),
  };

  return new Response(await renderFile("index.eta", data), responseDetails);
}

const handleRequest = async (request) => {
  if (request.method === "POST"){
    return await addMessage(request);
  } else {
    return await listMessages(request);
  }
};

let port = 7777;
if (Deno.args.length > 0) {
  const lastArgument = Deno.args[Deno.args.length - 1];
  port = Number(lastArgument);
}

serve(handleRequest, { port: port });
