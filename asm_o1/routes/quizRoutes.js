const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

router
  .route("/")
  .get(quizController.getAllQuizzes)
  .post(quizController.createQuiz);

router
  .route("/:quizId")
  .get(quizController.getQuizById)
  .put(quizController.updateQuiz)
  .delete(quizController.deleteQuiz);

router
  .route("/:quizId/populate")
  .get(quizController.getQuizWithCapitalQuestions);

router.route("/:quizId/question").post(quizController.createQuestionForQuiz);

router
  .route("/:quizId/questions")
  .post(quizController.createManyQuestionsForQuiz);

module.exports = router;
