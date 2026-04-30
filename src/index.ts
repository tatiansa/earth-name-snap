import { serve } from "@hono/node-server";
import { registerSnapHandler } from "@farcaster/snap-hono";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { NASA_LANDSAT_URL, normalizeWord } from "./landsat.js";
import { renderWordImage } from "./render.js";

const app = new Hono();

const SNAP_MEDIA_TYPE = "application/vnd.farcaster.snap+json";
const DEFAULT_BASE_URL = "http://localhost:3003";
const DEFAULT_WORD = "FARCASTER";
const SNAP_LINK_HEADER = `</>; rel="alternate"; type="${SNAP_MEDIA_TYPE}"`;

function getBaseUrl(requestUrl?: string): string {
  const envBase = process.env.SNAP_PUBLIC_BASE_URL?.replace(/\/$/, "");

  if (envBase) {
    return envBase;
  }

  if (requestUrl) {
    const url = new URL(requestUrl);
    return url.origin;
  }

  return DEFAULT_BASE_URL;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Accept,Content-Type,Authorization",
    "Access-Control-Max-Age": "86400"
  };
}

function snapHeaders() {
  return {
    ...corsHeaders(),
    "Content-Type": SNAP_MEDIA_TYPE,
    "Cache-Control": "no-store",
    Vary: "Accept",
    Link: SNAP_LINK_HEADER
  };
}

function htmlHeaders() {
  return {
    ...corsHeaders(),
    "Content-Type": "text/html; charset=utf-8",
    Vary: "Accept",
    Link: SNAP_LINK_HEADER
  };
}

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Accept", "Content-Type", "Authorization"],
    maxAge: 86400
  })
);

app.use("*", async (c, next) => {
  await next();

  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  c.header("Access-Control-Allow-Headers", "Accept,Content-Type,Authorization");
  c.header("Vary", "Accept");
  c.header("Link", SNAP_LINK_HEADER);
});

app.options("*", () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
});

function inputPage(baseUrl: string): any {
  return {
    version: "2.0",
    theme: {
      accent: "teal"
    },
    ui: {
      root: "page",
      elements: {
        page: {
          type: "stack",
          props: {
            gap: "md"
          },
          children: ["badge", "title", "body", "word", "generate", "credit"]
        },
        badge: {
          type: "badge",
          props: {
            label: "Landsat Snap",
            color: "teal",
            icon: "image"
          }
        },
        title: {
          type: "text",
          props: {
            content: "Spell FARCASTER with Earth",
            weight: "bold"
          }
        },
        body: {
          type: "text",
          props: {
            content:
              "Type a name or Farcaster handle. The Snap will build a postcard from real satellite-letter imagery.",
            size: "sm"
          }
        },
        word: {
          type: "input",
          props: {
            name: "word",
            label: "Name or handle",
            placeholder: DEFAULT_WORD,
            defaultValue: DEFAULT_WORD,
            maxLength: 12
          }
        },
        generate: {
          type: "button",
          props: {
            label: "Generate from Earth",
            variant: "primary",
            icon: "zap"
          },
          on: {
            press: {
              action: "submit",
              params: {
                target: `${baseUrl}/?action=generate`
              }
            }
          }
        },
        credit: {
          type: "text",
          props: {
            content:
              "Imagery source: USGS/NASA Landsat. This is an unofficial fan experiment by @tatiansa.",
            size: "sm"
          }
        }
      }
    }
  };
}

function resultPage(baseUrl: string, word: string, seed: number): any {
  const imageUrl = `${baseUrl}/image?word=${encodeURIComponent(word)}&seed=${seed}`;
  const snapUrl = `${baseUrl}/?word=${encodeURIComponent(word)}&seed=${seed}`;
  const shareText = `${word}, spelled by Earth. 🌍🛰️ Try yours by @tatiansa`;

  return {
    version: "2.0",
    theme: {
      accent: "teal"
    },
    ui: {
      root: "page",
      elements: {
        page: {
          type: "stack",
          props: {
            gap: "sm"
          },
          children: ["title", "image", "actions", "links", "credit"]
        },
        title: {
          type: "text",
          props: {
            content: `${word} from space`,
            weight: "bold",
            align: "center"
          }
        },
        image: {
          type: "image",
          props: {
            url: imageUrl,
            aspect: "16:9",
            alt: `${word} spelled using USGS/NASA Landsat satellite imagery`
          }
        },
        actions: {
          type: "stack",
          props: {
            direction: "horizontal",
            gap: "sm"
          },
          children: ["again", "share"]
        },
        again: {
          type: "button",
          props: {
            label: "Regenerate",
            icon: "refresh-cw"
          },
          on: {
            press: {
              action: "submit",
              params: {
                target: `${baseUrl}/?action=regenerate&word=${encodeURIComponent(
                  word
                )}&seed=${seed + 1}`
              }
            }
          }
        },
        share: {
          type: "button",
          props: {
            label: "Share",
            variant: "primary",
            icon: "share"
          },
          on: {
            press: {
              action: "compose_cast",
              params: {
                text: shareText,
                embeds: [snapUrl]
              }
            }
          }
        },
        links: {
          type: "stack",
          props: {
            direction: "horizontal",
            gap: "sm"
          },
          children: ["new", "nasa"]
        },
        new: {
          type: "button",
          props: {
            label: "New word"
          },
          on: {
            press: {
              action: "submit",
              params: {
                target: `${baseUrl}/?action=new`
              }
            }
          }
        },
        nasa: {
          type: "button",
          props: {
            label: "NASA tool",
            icon: "external-link"
          },
          on: {
            press: {
              action: "open_url",
              params: {
                target: NASA_LANDSAT_URL
              }
            }
          }
        },
        credit: {
          type: "text",
          props: {
            content: "Unofficial Snap. Imagery source: USGS/NASA Landsat.",
            size: "sm",
            align: "center"
          }
        }
      }
    }
  };
}

function htmlPage() {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Earth Name Snap</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #020617;
        color: #e2e8f0;
        font-family: Inter, Arial, sans-serif;
      }

      main {
        width: min(680px, calc(100vw - 40px));
        border: 1px solid #1e293b;
        border-radius: 24px;
        padding: 32px;
        background: radial-gradient(circle at top, #0f766e33, #020617);
      }

      a {
        color: #5eead4;
      }

      code {
        background: #0f172a;
        padding: 2px 6px;
        border-radius: 6px;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Earth Name Snap</h1>
      <p>This URL serves a Farcaster Snap when requested with <code>Accept: application/vnd.farcaster.snap+json</code>.</p>
      <p>Paste this URL into the Farcaster Snap emulator, or cast it on Farcaster.</p>
      <p><a href="${NASA_LANDSAT_URL}">Original NASA Your Name in Landsat tool</a></p>
    </main>
  </body>
</html>`;
}

app.get("/image", async (c) => {
  const word = normalizeWord(c.req.query("word") || DEFAULT_WORD);
  const seed = Number(c.req.query("seed") || "0") || 0;
  const png = await renderWordImage(word, seed);

  return new Response(new Uint8Array(png), {
    headers: {
      ...corsHeaders(),
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
});

app.get("/health", (c) => {
  return c.json(
    {
      ok: true
    },
    200,
    corsHeaders()
  );
});

registerSnapHandler(app, async (ctx) => {
  const baseUrl = getBaseUrl(ctx.request.url);
  const url = new URL(ctx.request.url);
  const action = url.searchParams.get("action");

  if (ctx.action.type === "get") {
    const word = normalizeWord(url.searchParams.get("word") || "");
    const seed = Number(url.searchParams.get("seed") || "0") || 0;

    if (url.searchParams.has("word")) {
      return resultPage(baseUrl, word, seed);
    }

    return inputPage(baseUrl);
  }

  if (action === "new") {
    return inputPage(baseUrl);
  }

  const inputs = ctx.action.inputs ?? {};
  const rawInput = typeof inputs.word === "string" ? inputs.word : DEFAULT_WORD;
  const wordFromInput = normalizeWord(rawInput || DEFAULT_WORD);
  const wordFromUrl = normalizeWord(url.searchParams.get("word") || DEFAULT_WORD);
  const word = action === "regenerate" ? wordFromUrl : wordFromInput;
  const seed = Number(url.searchParams.get("seed") || Date.now()) || Date.now();

  return resultPage(baseUrl, word, seed);
});

app.get("*", (c) => {
  const accept = c.req.header("Accept") || "";

  if (accept.includes(SNAP_MEDIA_TYPE)) {
    return new Response(JSON.stringify(inputPage(getBaseUrl(c.req.url))), {
      status: 200,
      headers: snapHeaders()
    });
  }

  return new Response(htmlPage(), {
    status: 200,
    headers: htmlHeaders()
  });
});

if (process.env.VERCEL !== "1") {
  const port = Number(process.env.PORT || 3003);

  serve({
    fetch: app.fetch,
    port
  });

  console.log(`Earth Name Snap running at http://localhost:${port}`);
}

export default app;
