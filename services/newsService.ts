import NewsRepository from "../repository/newsRepository";

class NewsService {
  search(term, page, perPage) {
    return NewsRepository.find({
      title: new RegExp(".*" + term + "*.", "i"),
      active: true,
    })
      .skip(page - 1 * perPage)
      .limit(perPage);
  }

  get() {
    let startDate = new Date("2019-01-01T00:00:00.000Z");
    let endDate = new Date("2019-03-01T00:00:00.000Z");

    let result = NewsRepository.find(
      { active: true, publishDate: { $gt: startDate, $lt: endDate } },
      "title hat img" // title hat img: retorno da query
    )
      .sort({ publishDate: -1 })
      .limit(2);
    return result;
  }

  async getById(_id) {
    let result = await NewsRepository.findById(_id);
    return result;
  }

  async create(news) {
    let result = await NewsRepository.create(news);
    return result;
  }

  async update(_id, news) {
    let result = await NewsRepository.findByIdAndUpdate(_id, news);
    return result;
  }

  async delete(_id) {
    let result = await NewsRepository.findByIdAndRemove(_id);
    return result;
  }
}

export default new NewsService();
