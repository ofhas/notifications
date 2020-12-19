import model from './model';

export default {
  getUsersForOrg: (org: string) =>
    model
      .getUsersModel()
      .find({ organization: org })
      .exec()
      .then((docs) => docs.map((doc) => doc._doc)),
  getUserById: (id: string) => model.getUsersModel().findOne({ id }).lean().exec()
};
