import express from "express";
import { body, validationResult } from "express-validator";

const app = express();
const PORT = process.env.PORT || 5012;

app.use(express.json());

const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
};

app.use(loggingMiddleware);

const authMiddleware = (req, res, next) => {
    if (req.headers.authorization) {
        console.log("Authorization header is present");
    } else {
        console.log("No authorization header");
    }
    next();
};

app.use(authMiddleware);

const fullstack = [
        { id: 1, name: "Hafiz", email: "hafiz@gmail.com", age: 21 },
        { id: 2, name: "Yunus", email: "yunus@gmail.com", age: 21 },
        { id: 3, name: "Mel", email: "mel@gmail.com", age: 21 },
        { id: 4, name: "Adam", email: "adam@gmail.com", age: 21 },
        { id: 5, name: "Niqi", email: "niqi@gmail.com", age: 21 },
        { id: 6, name: "Isma", email: "isma@gmail.com", age: 21 },
        { id: 7, name: "Ahmad", email: "ahmad@gmail.com", age: 21 },
        { id: 8, name: "Mashi", email: "mashi@gmail.com", age: 21 },
        { id: 9, name: "PJ", email: "pj@gmail.com", age: 21 },
        { id: 10, name: "Faris", email: "faris@gmail.com", age: 21 },
        { id: 11, name: "Zarina", email: "zarina@gmail.com", age: 21 },
        { id: 12, name: "Acai", email: "acai@gmail.com", age: 21 },
        { id: 13, name: "Nurul", email: "nurul@gmail.com", age: 21 },
        { id: 14, name: "Zayn", email: "zayn@gmail.com", age: 21 },
        { id: 15, name: "Yatt", email: "yatt@gmail.com", age: 21 },
        { id: 16, name: "Lan", email: "lan@gmail.com", age: 21 },
        { id: 17, name: "Wan", email: "wan@gmail.com", age: 21 },
        { id: 18, name: "Shaheera", email: "shaheera@gmail.com", age: 21 },
        { id: 19, name: "Aini", email: "aini@gmail.com", age: 21 },
        { id: 20, name: "Iqbal", email: "iqbal@gmail.com", age: 21 },
        { id: 21, name: "Mino", email: "mino@gmail.com", age: 21 },
        { id: 22, name: "Hamzah", email: "hamzah@gmail.com", age: 21 },
        { id: 23, name: "Amir", email: "amir@gmail.com", age: 21 },
        { id: 24, name: "Kero", email: "kero@gmail.com", age: 21 },
        { id: 25, name: "Sarah", email: "sarah@gmail.com", age: 21 },
    ];

    let currentId = fullstack.length ? Math.max(...fullstack.map(c => c.id)) : 0;
// Query Method
app.get("/fullstack", (req, res) => {
    console.log(req.query);
    const { filter, value } = req.query;
    if (!filter && !value) {
        return res.send(fullstack);
    }
    if (filter && value) {
        const filteredCohort = fullstack.filter(cohort =>
            cohort[filter]?.toString().toLowerCase().includes(value.toString().toLowerCase())
        );
        return res.send(filteredCohort);
    }
});

// Get by ID
app.get("/fullstack/:id", (req, res) => {
    console.log(req.params);
    const parseId = parseInt(req.params.id);
    console.log(parseId);
    if (isNaN(parseId)) {
        return res.status(400).send({ msg: "Bad request. Invalid ID" });
    }
    const findCohort = fullstack.find(cohort => cohort.id === parseId);
    if (!findCohort) {
        return res.status(404).send({ msg: "Cohort not found" });
    }
    res.status(200).send(findCohort);
});

// Post Method
app.post("/fullstack",
    [
        body("name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Name is required"),

        body("email")
        .isEmail()
        .withMessage("Must be a valid email address")
        .normalizeEmail(),

        body("age")
        .trim()
        .isNumeric()
        .withMessage("Age must be a number"),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const newcohort = { id: fullstack[fullstack.length - 1].id + 1, ...req.body };
        fullstack.push(newcohort);
        res.status(201).send(newcohort);
    }
);

// Put Method
app.put("/fullstack/:id",
    [
        body("name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Name is required"),

        body("email")
        .isEmail()
        .withMessage("Must be a valid email address")
        .normalizeEmail(),

        body("age")
        .trim()
        .isNumeric()
        .withMessage("Age must be a number"),
    ],
    (req, res) => {
        const parseId = parseInt(req.params.id);
        if (isNaN(parseId)) {
            return res.status(400).send({ error: "Invalid ID" });
        }

        const cohortIndex = fullstack.findIndex((cohort) => cohort.id === parseId);

        if (cohortIndex === -1) {
            return res.status(404).send({ message: "User not found" });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        fullstack[cohortIndex] = { id: parseId, ...req.body };
        res.sendStatus(200);
    }
);

// Patch Method
app.patch("/fullstack/:id", (req, res) => {
    const { body, params: { id } } = req;
    const parseId = parseInt(id);

    if (isNaN(parseId)) return res.sendStatus(400);
    const cohortIndex = fullstack.findIndex((cohort) => cohort.id === parseId);

    if (cohortIndex === -1) return res.sendStatus(404);

    fullstack[cohortIndex] = { ...fullstack[cohortIndex], ...body };

    return res.sendStatus(200);
});

// Delete Method
app.delete("/fullstack/:id", (req, res) => {
    const { params: { id } } = req;
    const parseId = parseInt(id);

    if (isNaN(parseId)) return res.sendStatus(400);
    const cohortIndex = fullstack.findIndex((cohort) => cohort.id === parseId);

    if (cohortIndex === -1) return res.sendStatus(404);

    fullstack.splice(cohortIndex, 1);
    return res.sendStatus(200);
});
//http://localhost:5012/fullstack?filter=name&value=Hafiz
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));