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

/*
app.head('/geo', ({ set }) => {
  set.status = 200
})
app.get("/geo", ({ request, set }) => {
  set.status = 200
  return request.headers.get('true-client-ip')
})
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
  html += `
  <head>
  <link rel="stylesheet" type="text/css" href="styles.css">
  </head>
  <body>
  <h1>How to use</h1>
  <p>Pokepastes are stored on the <a href="https://pokepast.es/">https://pokepast.es/</a> website. The following link contains a team: <a href="https://pokepast.es/2c7b8e8730f3c772">https://pokepast.es/2c7b8e8730f3c772</a></p>
  <br>
  <div id="codepaste">
  <div><code>Incineroar @ Sitrus Berry</code></div>
  <div><code>Ability: Intimidate  </code></div>
  <div><code>Level: 50  </code></div>
  <div><code>Tera Type: Dragon  </code></div>
  <div><code>EVs: 252 HP / 252 Atk / 4 SpD  </code></div>
  <div><code>Adamant Nature  </code></div>
  <div><code>- Flare Blitz  </code></div>
  <div><code>- Parting Shot  </code></div>
  <div><code>- Knock Off  </code></div>
  <div><code>- Fake Out </code></div>
  </div>
  <p>For the calculator to work, a pokemon needs only a name.</p>
  <ul>
    <li><p><em>Name</em> and <em>Item</em> must be on the same line separeted by an <code>@</code> symbol. You need a name and an @ but not an item.</p></li>
    <li><p><em>Ability</em>, <em>Level</em>, <em>Tera Type</em>, <em>EVs</em>, <em>IVs</em>, <em>Boosts</em> on their own line. Separated by a <code>:</code> semicolon.</p></li>
    <li><p><em>Nature</em> is preceded by the nature name, no separator.</p></li>
    <li><p><em>Moves</em> must be on their own line and start with a <code>-</code> dash. You can add any number of moves to a pokemon.</p></li>
    <li><p><em>EVs</em>, <em>IVs</em> and <em>Boosts</em> follow the same pattern. HP, Atk, Def, SpA, SpD, Spe must be separated by a <code>/</code> forward-slash.</p></li>
    <li><p>Each pokemon must be separated by a newline.</p></li>
  </ul>
  <p>You can also paste in a <code>pokepaste.es</code> link directly into the input textbox. The server will be able to parse the team out of the paste link on its own.</p>
  <p>The default meta paste is currently this: <a href="https://pokepast.es/dc1eac2d8740c97b">https://pokepast.es/dc1eac2d8740c97b</a></p>
  <br>
  <a href="/">back</a>
  </body>
  `;
  return html;
});


// post results to backend
app.post("/results", async ({request, body}) => {
    console.log(body);
    // parse out
    //const tbody = body as { team1: any, team2: any };
    //const url = 'http://localhost:8080/calculation';
    //const url = 'http://127.0.0.1:8080/calculation';
    const url = 'backend:8080/calculation';
    const { team1, team2, field } = body as { team1: string; team2: string; field: any}
    const data = {
      "team1" : team1,
      "team2" : team2,
      "field": field
    }

    try {
        // track time
        // from here
        const startTime = new Date().getTime();

        // run calculations
        const result = await postData(url, data);        
        const htmlResult = await result.text();

        // to here
        const endTime = new Date().getTime();
        const elapsedTime = endTime - startTime;
        console.log('Elapsed time:', elapsedTime, 'milliseconds');
        
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
