// const express = require("express");
// const router = express.Router();
// const quizController = require("../controllers/quizController");

// router
//   .route("/")
//   .get(quizController.getAllQuizzes)
//   .post(quizController.createQuiz);

// router
//   .route("/:quizId")
//   .get(quizController.getQuizById)
//   .put(quizController.updateQuiz)
//   .delete(quizController.deleteQuiz);

// router
//   .route("/:quizId/populate")
//   .get(quizController.getQuizWithCapitalQuestions);

// router.route("/:quizId/question").post(quizController.createQuestionForQuiz);

// router
//   .route("/:quizId/questions")
//   .post(quizController.createManyQuestionsForQuiz);

// module.exports = router;

//-------------------------------------------------------

const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

router.get("/", quizController.renderQuizList);
router.get("/create", quizController.renderCreateForm);
router.post("/create", quizController.handleCreateQuiz);
router.get("/edit/:quizId", quizController.renderEditForm);
router.put("/update/:quizId", quizController.handleUpdateQuiz);
router.delete("/delete/:quizId", quizController.handleDeleteQuiz);
router.get("/:quizId", quizController.renderQuizDetail);
router.post(
  "/:quizId/question/add-existing",
  quizController.handleAddQuestionToQuiz,
);

module.exports = router;
