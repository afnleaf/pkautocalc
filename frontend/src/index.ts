import { Elysia } from 'elysia'
import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'

const app = new Elysia();

app.use(html());

app.use(staticPlugin({ 
  prefix: '/',
  alwaysStatic: true,
}))

// homepage
app.get("/", () => Bun.file("./public/index.html").text())
app.get("/styles.css", () => Bun.file("./public/styles.css"))
app.get("/script.js", () => Bun.file("./public/script.js"))
// favicons
app.get("/favicon-32x32.png", () => Bun.file("./public/favicon-32x32.png"))
app.get("/favicon-16x16.png", () => Bun.file("./public/favicon-16x16.png"))
app.get("/favicon.ico", () => Bun.file("./public/favicon.ico"))
// results
app.get("/results", async () => {
  return "results";
})
// port
app.listen(3000);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);







/*
import { Elysia } from "elysia";

const app = new Elysia();

app.get("/", () => {
  return htmlPage;
})

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
*/


/*
import serveStatic from "serve-static-bun";

const server = Bun.serve({ 
  fetch: serveStatic("public")
});
*/

/*
// starts the calculations
function main() {
  // check if teams are valid
  // return notice to user that teams are not valid
  // get the textarea element by ID
  var textBox1 = document.getElementById("textBoxLeft");
  var textBox2 = document.getElementById("textBoxRight");
  //
  console.log(textBox1);
  console.log(textBox2);
}
*/
/*
import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import { html } from '@elysiajs/html'

const server = new Elysia()
server.use(staticPlugin({
  assets : "./public"
}))
server.use(html())
server.get('*', async () => {
  return Bun.file('./public/index.html')
})
server.listen(3000);
*/