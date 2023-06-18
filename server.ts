import { Application } from "https://deno.land/x/oak@v12.5.0/mod.ts";

const port = Deno.env.get("PORT") || 8080;
const app = new Application();

app.use(async (ctx) => {
  try {
    await ctx.send({
      root: `./`,
      index: "index.html",
    });
  } catch {
    ctx.response.status = 404;
    ctx.response.body = "404 File not found";
  }
});

console.log(`http://localhost:${port}/`);
await app.listen({ port: +port });