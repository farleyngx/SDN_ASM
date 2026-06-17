const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { verifyUser, verifyAdmin } = require("../middlewares/authenticate");

router
  .route("/")
  .get(quizController.getAllQuizzes)
  .post(verifyUser, verifyAdmin, quizController.createQuiz);

router
  .route("/:quizId")
  .get(quizController.getQuizById)
  .put(verifyUser, verifyAdmin, quizController.updateQuiz)
  .delete(verifyUser, verifyAdmin, quizController.deleteQuiz);

router
  .route("/:quizId/populate")
  .get(quizController.getQuizWithCapitalQuestions);

router.route("/:quizId/question").post(verifyUser, quizController.createQuestionForQuiz);

router
  .route("/:quizId/questions")
  .post(verifyUser, quizController.createManyQuestionsForQuiz);

module.exports = router;
