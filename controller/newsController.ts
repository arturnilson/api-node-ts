import NewsService from "../services/newsService";
import * as HttpStatus from "http-status";
import * as redis from "redis";

import Helper from "../infra/helper";
import ExportFiles from "../infra/exportFiles";

class NewsController {
  async get(req, res) {
    let client = redis.createClient(6379, "redis");

    await client.get("news", async function (err, reply) {
      try {
        if (reply) {
          console.log("redis");
          Helper.sendResponse(res, HttpStatus.OK, JSON.parse(reply));
        } else {
          console.log("db");

          let response = await NewsService.get();

          client.set("news", JSON.stringify(response));

          client.expire("news", 20);

          Helper.sendResponse(res, HttpStatus.OK, response);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  async getById(req, res) {
    try {
      const _id = req.params.id;
      let response = await NewsService.getById(_id);
      Helper.sendResponse(res, HttpStatus.OK, response);
    } catch (error) {
      console.error(error);
    }
  }

  search(req, res) {
    const term = req.params.term;

    const page = req.param("page") ? parseInt(req.param("page")) : 1;
    const perPage = req.param("limit") ? parseInt(req.param("limit")) : 10;

    NewsService.search(term, page, perPage)
      .then((news) => Helper.sendResponse(res, HttpStatus.OK, news))
      .catch((error) => console.error.bind(console, `Error ${error}`));
  }

  async create(req, res) {
    try {
      let vm = req.body;
      await NewsService.create(vm);
      Helper.sendResponse(
        res,
        HttpStatus.OK,
        "Noticia cadastrada com sucesso!"
      );
    } catch (error) {
      console.error(error);
    }
  }

  async update(req, res) {
    try {
      const _id = req.params.id;
      let news = req.body;
      await NewsService.update(_id, news);
      Helper.sendResponse(res, HttpStatus.OK, `Noticia atualiza com sucesso!`);
    } catch (error) {
      console.error(error);
    }
  }

  async delete(req, res) {
    try {
      const _id = req.params.id;
      await NewsService.delete(_id);
      Helper.sendResponse(res, HttpStatus.OK, "Noticia deletada com sucesso!");
    } catch (error) {
      console.error(error);
    }
  }

  async exportToCsv(req, res) {
    try {
      let response = await NewsService.get();
      let fileName = await ExportFiles.tocsv(response);
      Helper.sendResponse(
        res,
        HttpStatus.OK,
        req.get("host") + "/exports/" + fileName
      );
    } catch (error) {
      console.error(error);
    }
  }
}

export default new NewsController();
