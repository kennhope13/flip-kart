class SearchFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword }).sort({ createdAt: -1 });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryString };
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    let queryString = JSON.stringify(queryCopy);
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (key) => `$${key}`
    );

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  // Thêm phương thức sort
  sort() {
    // Nếu không có sort trong query, sẽ mặc định sắp xếp theo _id
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // Sắp xếp theo _id theo thứ tự tăng dần
      this.query = this.query.sort("_id");
    }
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skipProducts = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skipProducts);
    return this;
  }
}

module.exports = SearchFeatures;
