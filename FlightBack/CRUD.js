const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors")

const app = express();
const PORT = 8001;

app.use(express.json());
app.use(cors());


mongoose
  .connect("mongodb://localhost:27017/MyDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

const flightSchema = new mongoose.Schema({
  name: String,
  boarding: String,
  destination: String,
  passport: Number,
});

const Flight = mongoose.model("Flight", flightSchema);

app.get("/getAllFlights", (req, res) => {
  Flight.find()
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.post("/insertData", (req, res) => {
  const { _id, name, boarding, destination, passport } = req.body;
  const flight = new Flight({
    _id,
    name,
    boarding,
    destination,
    passport,
  });

  flight
    .save()
    .then((result) => {
      res.status(201).send({ message: "Record inserted successfully", result });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.put("/updateData", (req, res) => {
  const { _id, name, boarding, destination, passport } = req.body;

  Flight.findByIdAndUpdate(
    _id,
    { name, boarding, destination, passport },
    { new: true }
  )
    .then((result) => {
      if (result) {
        res
          .status(200)
          .send({ message: "Record updated successfully", result });
      } else {
        res.status(404).send({ message: "Record not found" });
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.delete("/deleteRecord/:id", (req, res) => {
  const { id } = req.params;
  console.log("Given id to delete is: " + id);

  Flight.deleteOne({ _id: id })
    .then(() => {
      console.log("Record deleted successfully...");
      res.status(200).send("Record deleted successfully");
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send(err);
    });
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
