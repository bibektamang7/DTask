import { connectDB } from "./db";
import dotenv from "dotenv";
import app from "./app";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8000;
connectDB()
  .then(() => {
    app.get("*", async (req, res) => {
      const { query } = createStaticHandler(routes);
      const context = await query(new Request(req.url));

      const router = createStaticRouter(routes, context);

      const appHtml = renderToString(
        <StaticRouterProvider
          router={router}
          context={context}
        />
      );

      res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>React Router SSR</title>
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script src="/client.js" type="module"></script>
      </body>
    </html>
  `);
    });
    app.listen(PORT, () => {
      console.log(`Application is running on PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Something went wrong while connecting Database", error);
  });
