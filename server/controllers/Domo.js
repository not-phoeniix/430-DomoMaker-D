const models = require("../models");
const Domo = models.Domo;

const makerPage = async (req, res) => {
    try {
        const docs = await Domo
            .find({ owner: req.session.account._id })
            .select("name age")
            .lean()
            .exec();

        return res.render("app", { domos: docs });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Error retrieving domos!" });
    }
};

const makeDomo = async (req, res) => {
    if (!req.body.name || !req.body.age) {
        return req.status(400).json({ error: "Both name and age are required!" });
    }


    try {
        const newDomo = new Domo({
            name: req.body.name,
            age: req.body.age,
            owner: req.session.account._id,
        });

        await newDomo.save();

        return res.json({ redirect: "/maker" });
    } catch (err) {
        console.log(err);

        if (err.code === 11000) {
            return res.status(400).json({ error: "Domo already exists!" });
        }

        return res.status(500).json({ error: "An error occured making domo!" });
    }
};

module.exports = {
    makerPage,
    makeDomo,
};
