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
    getDomos,
};
