/* eslint-disable no-unused-vars */
const express = require("express");
var csrf = require("tiny-csrf");
const app = express();
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const path = require("path");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const flash = require("connect-flash");
const localStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const saltRounds = 10;
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("sshh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my-super-secret-key-21728172615261562",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});
passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid password" });
          }
        })
        .catch((error) => {
          return done(null, false, { message: "Invalid Email or password" });
        });
    }
  )
);
passport.serializeUser((user, done) => {
  console.log("Serializing user in session : ", user.id);
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  console.log("deserializing user from session: ", id);
  User.findByPk(id)
    .then((users) => {
      done(null, users);
    })
    .catch((error) => {
      done(error, null);
    });
});
app.get("/", async function (request, response) {
  try {
    if (request.accepts("html")) {
      response.render("index", {
        title: "Todo application",
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({});
    }
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    try {
      const loggedInUser = request.user.id;
      const overDueItems = await Todo.overdue(loggedInUser);
      const dueTodayItems = await Todo.dueToday(loggedInUser);
      const dueLaterItems = await Todo.dueLater(loggedInUser);
      const completedItems = await Todo.completedItems(loggedInUser);
      const allTodos = await Todo.getTodos();
      if (request.accepts("html")) {
        response.render("todos", {
          title: "Todo Application",
          overDueItems,
          dueTodayItems,
          dueLaterItems,
          completedItems,
          allTodos,
          csrfToken: request.csrfToken(),
        });
      } else {
        response.json({
          overDueItems,
          dueTodayItems,
          dueLaterItems,
          completedItems,
          allTodos,
        });
      }
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);
app.get("/signup", (request, response) => {
  response.render("signup", {
    title: "Sign-Up",
    csrfToken: request.csrfToken(),
  });
});
app.post("/users", async (request, response) => {
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
  console.log(hashedPwd);
  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPwd,
    });
    request.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      response.redirect("/todos");
    });
  } catch (error) {
    console.log(error);
    if (error.name == "SequelizeValidationError") {
      const errMsg = error.errors.map((error) => error.message);
      console.log(errMsg);
      errMsg.forEach((message) => {
        if (message == "Validation notEmpty on firstName failed") {
          request.flash("error", "First name cannot be empty");
        }
        if (message == "Validation notEmpty on email failed") {
          request.flash("error", "Email cannot be empty");
        }
      });
      response.redirect("/signup");
    } else if (error.name == "SequelizeUniqueConstraintError") {
      const errMsg = error.errors.map((error) => error.message);
      console.log(errMsg);
      errMsg.forEach((message) => {
        if (message == "Email must be unique") {
          request.flash("error", "Email already used");
        }
      });
      response.redirect("/signup");
    } else {
      console.log(error);
      return response.status(422).json(error);
    }
  }
});
app.get("/login", (request, response) => {
  response.render("login", { title: "Login", csrfToken: request.csrfToken() });
});
app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (request, response) => {
    console.log(request.user);
    response.redirect("/todos");
  }
);
app.get("/signout", (request, response, next) => {
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    response.redirect("/");
  });
});
app.get("/todos", async function (_request, response) {
  console.log("Processing the list of all Todos");
  try {
    const todo = await Todo.findAll();
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    console.log("Creating a todo", request.body);
    console.log(request.user);
    try {
      await Todo.addTodo({
        title: request.body.title,
        dueDate: request.body.dueDate,
        userId: request.user.id,
      });
      return response.redirect("/todos");
    } catch (error) {
      if (error.name == "SequelizeValidationError") {
        const errMsg = error.errors.map((error) => error.message);
        console.log(errMsg);
        errMsg.forEach((message) => {
          if (message == "Validation isDate on dueDate failed") {
            request.flash("error", "Due Date is empty");
          }
          if (message == "Validation len on title failed") {
            request.flash("error", "Title Length should be atleast 5");
          }
        });
        response.redirect("/todos");
      } else {
        console.log(error);
        return response.status(422).json(error);
      }
    }
  }
);
app.put(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    const todo = await Todo.findByPk(request.params.id);
    try {
      const updatedTodo = await todo.setCompletionStatus(
        request.body.completed
      );
      return response.json(updatedTodo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);
app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    console.log("Delete a Todo with ID: ", request.params.id);
    try {
      await Todo.remove(request.params.id, request.user.id);
      return response.json({ success: true });
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);
module.exports = app;
