import { Elysia } from 'elysia'
import { html } from '@elysiajs/html'
import { cors } from '@elysiajs/cors'
//import { staticPlugin } from '@elysiajs/static'
const PORT = process.env.PORT || 3000;

const app = new Elysia();
app.use(cors());
app.use(html());

/*
app.use(staticPlugin({ 
  prefix: '/',
  alwaysStatic: false,
}))
*/

// homepage
app.get("/", () => Bun.file("./public/index.html").text())
app.get("/styles.css", () => Bun.file("./public/styles.css"))
app.get("/script.js", () => Bun.file("./public/script.js"))
// favicons
app.get("/favicon-32x32.png", () => Bun.file("./public/favicon-32x32.png"))
app.get("/favicon-16x16.png", () => Bun.file("./public/favicon-16x16.png"))
app.get("/favicon.ico", () => Bun.file("./public/favicon.ico"))
// loading
app.get("/Hitmontop.gif", () => Bun.file("./public/Hitmontop.gif"))
// calcualtion
/*
app.post("/results", async () => {
  return "results";
})
*/

// to explain how to use the calculator
app.get("/howto", () => {
  let html: string = ``;
  html += `<h1>How to use</h1>`;
  return html;
});


// post results to backend
app.post("/results", async ({body}) => {
    console.log(body);
    // parse out
    //const tbody = body as { team1: any, team2: any };
    //const url = 'http://localhost:8080/calculation';
    //const url = 'http://127.0.0.1:8080/calculation';
    const url = 'backend:8080/calculation';
    const { team1, team2 } = body as { team1: string; team2: string }
    const data = {
      "team1" : team1,
      "team2" : team2
  }

    try {
        const result = await postData(url, data);
        //console.log(result);
        const htmlResult = await result.text();
        return htmlResult;
    } catch (error) {
        console.error('Error during POST request:', error);
    }
});



// port
app.listen(PORT);

console.log(
    `Frontend is running at ${app.server?.hostname}:${app.server?.port}`
);



/**
* Posts json to server
* @param {url} http endpoint url 
* @param {data} json object
* @return response from the server
*/
async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return response;
}


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