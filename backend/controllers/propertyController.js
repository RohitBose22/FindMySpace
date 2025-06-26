import Property from "../models/Property.js";

export const getProperties = async (req, res) => {
  try {
    const { listingType, location, minPrice, maxPrice } = req.query;

    let filter = {};

    if (listingType) filter.listingType = listingType;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(filter)
      .select("title description price location images owner")
      .populate("owner", "name email");

    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .select("title description price location images owner")
      .populate("owner", "name email");

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Error fetching property", error: error.message });
  }
};

export const createProperty = async (req, res) => {
  try {
    const { title, description, price, location, listingType } = req.body;

    if (!["rent", "sell"].includes(listingType)) {
      return res.status(400).json({ error: "Invalid listing type. Must be 'rent' or 'sell'." });
    }

    
    const images = req.files ? req.files.map((file) => file.path) : [];

    if (images.length < 3) {
      return res.status(400).json({ error: "Please upload at least 3 images." });
    }

    const newProperty = new Property({
      title,
      description,
      price,
      location,
      listingType,
      owner: req.user.id,
      images,
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this property" });
    }

    await property.deleteOne();
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
