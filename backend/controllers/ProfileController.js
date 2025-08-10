import { generateRandomNum, imageValidator } from "../utils/helper.js";

class profileController {
  static async index(req, res) {
    try {
      console.log(req.user);
      const { studentId } = req.user; // Assuming `req.user` contains the authenticated user's data
      const profile = await prisma.student.findUnique({
        where: { studentId: studentId },
      });

      if (!profile) {
        return res.status(404).json({ message: "Profile not found." });
      }

      console.log(req.user);
      return res.status(200).json({ status: 200, profile, user: req.user });
    } catch (error) {
      console.error("Error fetching profile:", error);
      return res.status(500).json({ message: "Something went wrong." });
    }
  }

  // static async store() {

  // }

  // static async show(req, res) {
  //     try {
  //         const { id } = req.params;

  //         // Fetch the user profile by ID
  //         const user = await prisma.student.findUnique({
  //             where: { studentId: id },
  //         });

  //         if (!user) {
  //             return res.status(404).json({ message: "Profile not found." });
  //         }

  //         return res.status(200).json({
  //             status: 200,
  //             user,
  //         });
  //     } catch (error) {
  //         console.error("Error fetching profile:", error);
  //         return res.status(500).json({ message: "Something went wrong." });
  //     }
  // }

  static async update(req, res) {
    try {
      const { studentId } = req.params;
      // const authUser = req.user;
      if (!req.files || Object.keys(req.files).lentgh === 0) {
        return res.status(400).json({ message: "Image is required" });
      }

      const profile = req.files.profile;
      const message = imageValidator(profile?.size, profile?.mimetype);
      if (message !== null) {
        return res.status(400).json({ errors: { profile: message } });
      }

      const imgExt = profile?.name.split(".");
      const imgName = generateRandomNum() + "." + imgExt[1];
      const uploadPath = process.cwd() + "/public/images/" + imgName;

      profile.mv(uploadPath, (err) => {
        if (err) throw err;
      });

      await prisma.student.update({
        data: {
          profile: imgName,
        },
        where: {
          studentId: studentId,
        },
      });
      return res.json({
        // name: profile.name,
        // sizse: profile?.size,
        // mimetype: profile?.mimetype,
        status: 200,
        message: "Profile updated successfully!",
      });
    } catch (error) {
      console.log("The error is ", error);
      return res
        .status(500)
        .json({ message: "Something went wrong. Try again" });
    }
  }

  // static async destroy() {

  // }
}

export default profileController;
