const models = require("../models");
const Domo = models.Domo;

const makerPage = async (req, res) => res.render("app");

const makeDomo = async (req, res) => {
    if (!req.body.name || !req.body.age || !req.body.height) {
        return req.status(400).json({ error: "Missing required properties!" });
    }

    try {
        const newDomo = new Domo({
            name: req.body.name,
            age: req.body.age,
            height: req.body.height,
            owner: req.session.account._id,
        });

        await newDomo.save();

        return res.status(201).json({
            name: newDomo.name,
            age: newDomo.age,
            height: newDomo.height
        });

    } catch (err) {
        console.log(err);

        if (err.code === 11000) {
            return res.status(400).json({ error: "Domo already exists!" });
        }

        return res.status(500).json({ error: "An error occured making domo!" });
    }
};

const deleteDomo = async (req, res) => {
    if (!req.body.name) {
        return req.status(400).json({ error: "Missing required properties!" });
    }

    try {
        let domo = await Domo
            .findOne({ name: req.body.name, owner: req.session.account._id })
            .exec();

        if (!domo) {
            return res.status(404).json({ error: "Couldn't find domo!" });
        }

        await domo.deleteOne().exec();

        return res.status(202).json({ message: "success" });

    } catch (err) {
        console.log(err);

        return res.status(500).json({ error: "An error occured making domo!" });
    }
};

const getDomos = async (req, res) => {
    try {
        const docs = await Domo
            .find({ owner: req.session.account._id })
            .select("name age height")
            .lean()
            .exec();

        return res.json({ domos: docs });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Error retrieving domos!" });
    }
};

module.exports = {
    makerPage,
    makeDomo,
    deleteDomo,
    getDomos,
};
