const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const { verifyUser, verifyAuthor } = require("../middlewares/authenticate");

router
  .route("/")
  .get(questionController.getAllQuestions)
  .post(verifyUser, questionController.createQuestion);

router
  .route("/:questionId")
  .get(questionController.getQuestionById)
  .put(verifyUser, verifyAuthor, questionController.updateQuestion)
  .delete(verifyUser, verifyAuthor, questionController.deleteQuestion);

module.exports = router;
