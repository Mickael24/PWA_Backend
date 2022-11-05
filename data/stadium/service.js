function StadiumService(StadiumModel) {
  let service = {
    create,
    find,
    update,
  };

  function create(stadium) {
    let newStadium = StadiumModel(stadium);
    return save(newStadium);
  }

  function save(model) {
    return new Promise(function (resolve, reject) {
      // do a thing, possibly async, then…
      model.save(function (err) {
        if (err) reject("There is a problema with register");

        resolve({
          message: "Stadium saved",
          stadium: model,
        });
      });
    });
  }

  function find(id) {
    return new Promise(function (resolve, reject) {
      StadiumModel.findById(id, function (err, player) {
        if (err) reject(err);

        resolve(player);
      });
    });
  }

  function update(id, stadium) {
    return new Promise(function (resolve, reject) {
        StadiumModel.findByIdAndUpdate(
        id,
        stadium,
        function (err, stadiumUpdated) {
          if (err) console.log(err);
          resolve(stadiumUpdated);
        }
      );
    });
  }

  return service;
}

module.exports = StadiumService;
