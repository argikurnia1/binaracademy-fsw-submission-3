const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const userRouter = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(morgan("common"));
app.use(express.json());

app.use("/css", express.static(path.join(__dirname, "src", "css")));
app.use("/assets", express.static(path.join(__dirname, "src", "assets")));
app.use("/js", express.static(path.join(__dirname, "src", "js")));

app.set("view engine", "hbs");

// Limit requests from same API
const limiter = rateLimit({
  max: 50,
  windowMs: 1 * 60 * 1000,
  message: "Too many requests from this IP, please try again in a minute!",
});
app.use("/api", limiter);

app.get("/", (req, res) => {
  res.render("index", {
    chapterNumber: "3",
    css: [
      "/css/index.css",
      "/css/responsive.css",
      "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.3/font/bootstrap-icons.css",
    ],
    js: "/js/index.js",
    links: [
      {
        href: "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
        integrity:
          "sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3",
        crossorigin: "anonymous",
      },
    ],
    scripts: [
      {
        src: "https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js",
        integrity:
          "sha384-7+zCNj/IqJ95wo16oMtfsKbZ9ccEh31eOz1HGyDuCQ6wgnyJNSYdrPa03rtR1zdB",
        crossorigin: "anonymous",
      },
      {
        src: "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js",
        integrity:
          "sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13",
        crossorigin: "anonymous",
      },
    ],
  });
});

app.get("/games", (req, res) => {
  res.render("games", {
    chapterNumber: "4",
    css: ["/css/games.css"],
    js: "/js/games.js",
  });
});

app.use("/api/v1/users", userRouter);

app.use((error, req, res, next) => {
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.listen(PORT, () => {
  console.log(`App Listen ${PORT}`);
});
