let property = [];

exports.getAllProperty = (req, res) => {
  res.status(200).json(property);
};
exports.createProperty = (req, res) => {
  const { id, pname, price, picture, description } = req.body;
  if (!pname || !price) {
    return res
      .status(400)
      .json({ message: "property name and price is required." });
  }
  const newProperty = { id, pname, price, picture, description };
  property.push(newProperty);

  return res.status(201).json(newProperty);
};
exports.getAllPropertyById = (req, res) => {
  const propert = property.find((p) => p.id === req.params.id);
  if (!propert) {
    return res.status(404).json({ message: "property not found." });
  }
  return res.status(200).json(propert);
};

exports.updateProperty = (req, res) => {
  const propertyIndex = property.findIndex((p) => p.id === req.params.id);
  if (propertyIndex === -1) {
    return res.status(404).json({ message: "property not found." });
  }
  property[propertyIndex] = { ...property[propertyIndex], ...req.body };
  return res.status(200).json({
    message: "data is updated successfully.",
    property: property[propertyIndex],
  });
};

exports.deletePropertyById = (req, res) => {
  const deleteIndex = property.findIndex((p) => p.id === req.params.id);
  if (deleteIndex === -1) {
    return res.status(404).json({ error: "property not found." });
  }
  const deleteData = property.splice(deleteIndex, 1);
  return res.status(200).json({
    massage: "data is deleted successfully.",
    deleteData: deleteData[0],
  });
};
