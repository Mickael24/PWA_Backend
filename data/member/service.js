function MemberService(MemberModel) {
  let service = {
    create,
    findAll,
    findById,
    findMemberByTaxNumber,
    update,
    removeById,
  };

  function create(member) {
    let newUser = MemberModel(member);
    return save(newUser);
  }

  function save(model) {
    return new Promise(function (resolve, reject) {
      // do a thing, possibly async, then…
      model.save(function (err) {
        console.log(err);
        if (err) reject("There is a problema with register");

        resolve({
          message: "Member Created",
          member: model,
        });
      });
    });
  }

  function findById(id) {
    return new Promise(function (resolve, reject) {
      MemberModel.findOne({ _id: id }, function (err, member) {
        if (err) reject(err);

        if (!member) {
          reject("Member dont found");
        }
        resolve(member);
      });
    });
  }

  function findAll(pagination) {
    const { limit, skip } = pagination;

    return new Promise(function (resolve, reject) {
      MemberModel.find({}, {}, { skip, limit }, function (err, members) {
        if (err) reject(err);

        resolve(members);
      });
    }).then(async (members) => {
      const totalPlayers = await MemberModel.count();

      return Promise.resolve({
        members: members,
        pagination: {
          pageSize: limit,
          page: Math.floor(skip / limit),
          hasMore: skip + limit < totalPlayers,
          total: totalPlayers,
        },
      });
    });
  }

  function findMemberByTaxNumber(taxNumber) {
    return new Promise(function (resolve, reject) {
      MemberModel.findOne({ tax: taxNumber }, function (err, member) {
        if (err) reject(err);

        if (!member) {
          reject("Member dont found");
        }
        resolve(member);
      });
    });
  }

  function update(id, member) {
    return new Promise(function (resolve, reject) {
      MemberModel.findByIdAndUpdate(id, member, function (err, memberUpdated) {
        if (err) console.log(err);
        resolve(memberUpdated);
      });
    });
  }

  function removeById(id) {
    return new Promise(function (resolve, reject) {
      MemberModel.findByIdAndRemove(id, function (err) {
        if (err)
          reject({
            message: "Does not possible remove",
          });

        resolve();
      });
    });
  }

  return service;
}

module.exports = MemberService;
