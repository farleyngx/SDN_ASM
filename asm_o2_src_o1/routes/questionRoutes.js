// const express = require("express");
// const router = express.Router();
// const questionController = require("../controllers/questionController");

// router
//   .route("/")
//   .get(questionController.getAllQuestions)
//   .post(questionController.createQuestion);

// router
//   .route("/:questionId")
//   .get(questionController.getQuestionById)
//   .put(questionController.updateQuestion)
//   .delete(questionController.deleteQuestion);

// module.exports = router;

//-----------------------------------------------

const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router.get("/", questionController.renderQuestionList);
router.get("/create", questionController.renderCreateForm);
router.post("/create", questionController.handleCreateQuestion);
router.get("/edit/:questionId", questionController.renderEditForm);
router.put("/update/:questionId", questionController.handleUpdateQuestion);
router.delete("/delete/:questionId", questionController.handleDeleteQuestion);
router.get("/:questionId", questionController.renderQuestionDetail);

module.exports = router;
