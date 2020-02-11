import { Router } from "express";
import Axios from "axios";

const routes = Router();

const request = async optionRequest => {
  const { data } = await Axios(optionRequest);
  return data;
};

/**
 * GET home page
 */
routes.get("/hi", async (req, res) => {
  let joke;
  let tacos;
  let factsCat;
  let address;
  let beer;

  try {
    beer = await request({
      baseURL: "https://api.punkapi.com/v2/beers/1"
    });
    joke = await request({
      baseURL:
        "https://sv443.net/jokeapi/v2/joke/Programming,Miscellaneous?format=json&blacklistFlags=nsfw,sexist&type=single"
    });
    tacos = await request({
      baseURL: "http://taco-randomizer.herokuapp.com/random/"
    });
    factsCat = await request({
      baseURL:
        "https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=3"
    });
    address = await request({
      baseURL:
        "https://api-adresse.data.gouv.fr/search/?q=41+rue+du+port&limit=1"
    });
  } catch (err) {
    console.log(err);
  }

  const arrayCat = [];
  factsCat.map(result => {
    arrayCat.push(result.text);
  });

  const coord = address.features[0].geometry.coordinates;

  const view = {
    gps: { lat: coord[0], long: coord[1] },
    joke: joke.joke,
    catFact: arrayCat,
    beer: { name: beer[0].name, description: beer[0].description },
    taco: tacos.condiment.recipe
  };

  res.render("index", view);
});

/**
 * GET /list
 *
 * This is a sample route demonstrating
 * a simple approach to error handling and testing
 * the global error handler. You most certainly want to
 * create different/better error handlers depending on
 * your use case.
 */
routes.get("/list", (req, res, next) => {
  const { title } = req.query;

  if (title == null || title === "") {
    // You probably want to set the response HTTP status to 400 Bad Request
    // or 422 Unprocessable Entity instead of the default 500 of
    // the global error handler (e.g check out https://github.com/kbariotis/throw.js).
    // This is just for demo purposes.
    next(new Error('The "title" parameter is required'));
    return;
  }

  res.render("index", { title });
});

export default routes;
