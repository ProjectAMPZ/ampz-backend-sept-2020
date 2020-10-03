// import { check, validationResult } from "express-validator";

// /**
//  *Contains Post Validator
//  *
//  *
//  *
//  * @class Post
//  */
// class PostValidator {
//   /**
//    * validate user data.
//    * @memberof Post
//    * @returns {null} - No response.
//    */
//   static validateData() {
//     return [
//       check("caption")
//         .not()
//         .isEmpty()
//         .withMessage("Enter a caption for your post"),
//       check("description")
//         .not()
//         .isEmpty()
//         .withMessage("Enter a description for your post")
//         .isLength({ max: 280 })
//         .withMessage("description cannot be more than 280 characters"),
//       check("mediaUrl").not().isEmpty().withMessage("Upload a media file"),
//     ];
//   }

//   /**
//    * Validation results.
//    * @param {Request} req - Response object.
//    * @param {Response} res - The payload.
//    * @param {Response} next - The next parameter.
//    * @memberof SignUp
//    * @returns {JSON} - A JSON success response.
//    */
//   static async ValidationResult(req, res, next) {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       const errArr = errors.array().map(({ msg }) => msg);
//       return res.status(400).json({
//         status: "400 Invalid Request",
//         error: "Your request contains invalid parameters",
//         errors: errArr,
//       });
//     }
//     next();
//   }
// }

// export default PostValidator;
