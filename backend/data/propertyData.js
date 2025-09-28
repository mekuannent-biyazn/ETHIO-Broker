class Property {
  constructor({ title, price, description, picture }) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.picture = picture;
    this.createdAt = new Date.now();
  }
}

module.exports = Property;
